import { BackdropLayer } from '../render/Backdrop';
import { IconSet } from '../render/icons/IconSet';
import { Palette } from '../render/Palette';
import { Renderer } from '../render/Renderer';
import { CalendarSystem } from '../sim/Calendar';
import { AdaptiveQuality } from './AdaptiveQuality';
import { createCommandApi, type CommandApi } from './CommandApi';
import { CommandQueue, type SimCommand } from './Commands';
import { ROBUSTNESS, UI } from './config';
import { registerCoreCommands } from './console/commands';
import { DevConsole } from './console/DevConsole';
import { CRASH_SYSTEM_ID, CrashTestSystem } from './dev/CrashTest';
import { describeError, ErrorLog } from './ErrorLog';
import { EventBus } from './EventBus';
import { FullscreenController } from './Fullscreen';
import { Input } from './Input';
import type { LoopHost } from './Loop';
import { Loop } from './Loop';
import { PerfMonitor, type FpsStats } from './PerfMonitor';
import { parseSeed, randomSeed, RngStreams, type SeedInfo } from './Rng';
import { Scheduler } from './Scheduler';
import { SettingsStore } from './Settings';
import type { UiSnapshot } from './Snapshot';
import { Store } from './Store';
import { t } from './strings';
import { seasonOf, TICKS_PER_SECOND, yearOf } from './time';
import { ToastCenter } from './Toasts';
import { createUiStateStore } from './UiState';
import { waitForFonts } from './platform';

declare global {
  interface Window {
    /** Debug handle for the browser console and automated checks. */
    demiurge?: Game;
  }
}

const SNAPSHOT_INTERVAL_MS = 1000 / UI.snapshotHz;

/**
 * The engine hub: owns the loop, systems, renderer, input, stores and the command API.
 * Created exactly once per page (ui/engineHost.ts); mount()/unmount() attach it to the DOM and
 * fully release listeners, rAF and observers so StrictMode and hot reload never double it.
 */
export class Game implements LoopHost {
  readonly errors = new ErrorLog();
  readonly toasts = new ToastCenter();
  readonly settings = new SettingsStore();
  readonly ui = createUiStateStore();
  readonly events = new EventBus();
  readonly perf = new PerfMonitor();
  readonly quality = new AdaptiveQuality();
  readonly commands = new CommandQueue();
  readonly input = new Input();
  readonly palette = new Palette();
  readonly icons: IconSet;
  readonly loop: Loop;
  readonly scheduler: Scheduler;
  readonly renderer: Renderer;
  readonly console: DevConsole;
  readonly fullscreen: FullscreenController;
  readonly store: Store<UiSnapshot>;
  readonly cmd: CommandApi;
  readonly rng: RngStreams;
  /** Resolves once the pixel font is loaded; text baking waits on it (rule 16). */
  readonly fontsReady: Promise<void>;
  seed: SeedInfo;
  /** Simulation ticks elapsed since the world began. */
  tick = 0;

  private readonly backdrop: BackdropLayer;
  private mounted = false;
  private lastSnapshotAt = -Infinity;
  private snapshotRev = 0;
  private renderMs = 0;
  private readonly fpsScratch: FpsStats = { avg: 0, low1: 0 };

  constructor() {
    this.seed = randomSeed();
    this.rng = new RngStreams(this.seed.value);
    this.icons = new IconSet(this.palette);
    this.loop = new Loop(this);
    this.scheduler = new Scheduler(
      (id, err) => this.reportError(`system:${id}`, err),
      (id, err) => this.onSuspended('system', id, err),
    );
    this.renderer = new Renderer(
      (id, err) => this.reportError(`layer:${id}`, err),
      (id, err) => this.onSuspended('layer', id, err),
    );
    this.renderer.setBackground(this.palette.depth[this.palette.depth.length - 1].css);
    this.backdrop = new BackdropLayer(this.palette, this.seed.value);
    this.renderer.addLayer(this.backdrop);
    this.console = new DevConsole((name, err) => this.reportError(`console:${name}`, err));
    registerCoreCommands(this.console, this);
    this.fullscreen = new FullscreenController(
      (mode) => this.ui.patch({ fullscreen: mode }),
      () => this.toasts.push({ kind: 'info', textKey: 'toast.fullscreenFallback', mergeKey: 'fullscreen-fallback' }),
    );
    this.store = new Store<UiSnapshot>(this.buildSnapshot());
    this.cmd = createCommandApi(this);
    this.fontsReady = waitForFonts();
    // Systems in tick order (section 3.3). Later steps insert theirs at the right position.
    this.scheduler.add(new CalendarSystem(), this);
  }

  /** Attaches to the DOM and starts the loop. Idempotent. */
  mount(canvas: HTMLCanvasElement, root: HTMLElement): void {
    if (this.mounted) this.unmount();
    this.mounted = true;
    this.renderer.attach(canvas);
    this.input.attach(canvas, (action) => this.cmd.hotkey(action));
    this.fullscreen.attach(root);
    window.addEventListener('error', this.onWindowError);
    window.addEventListener('unhandledrejection', this.onRejection);
    window.demiurge = this;
    this.loop.start();
  }

  /** Stops the loop and removes every listener and observer. */
  unmount(): void {
    if (!this.mounted) return;
    this.mounted = false;
    this.loop.stop();
    this.input.detach();
    this.renderer.detach();
    this.fullscreen.detach();
    window.removeEventListener('error', this.onWindowError);
    window.removeEventListener('unhandledrejection', this.onRejection);
    if (window.demiurge === this) window.demiurge = undefined;
  }

  /** Final release (hot reload). Audio contexts are closed here once audio exists (Step 1.10). */
  destroy(): void {
    this.unmount();
  }

  setSeed(text: string): void {
    this.seed = parseSeed(text);
    this.rng.reseed(this.seed.value);
    this.backdrop.reseed(this.seed.value);
    this.events.emit('seedChanged', this.tick, 1, { seed: this.seed.value, text: this.seed.text });
    this.publishSnapshot();
  }

  // ── LoopHost ────────────────────────────────────────────────────────────────

  stepTick(): void {
    this.tick++;
    this.commands.drain(this.applyCommand);
    this.scheduler.run(this, this.tick);
    this.events.flush(this.onListenerError);
  }

  renderFrame(alpha: number, nowMs: number, dtMs: number): void {
    const rc = this.renderer.rc;
    rc.nowSec = nowMs / 1000;
    rc.dtSec = dtMs / 1000;
    rc.alpha = alpha;
    rc.simSeconds = (this.tick + alpha) / TICKS_PER_SECOND;
    rc.quality = this.quality.level;
    rc.decorScale = this.quality.decorScale;
    rc.reduceMotion = this.settings.values.reduceMotion;
    const t0 = performance.now();
    this.renderer.render();
    this.renderMs = performance.now() - t0;
  }

  endFrame(nowMs: number, dtMs: number): void {
    // Events emitted outside ticks (e.g. while paused) are delivered at the end of the frame.
    if (this.events.hasPending) this.events.flush(this.onListenerError);
    this.toasts.update(dtMs);
    this.perf.record(dtMs, this.loop.simMs, this.renderMs, 0, this.loop.ticksThisFrame);
    const step = this.quality.update(this.perf.workMs, dtMs);
    if (step !== 0) {
      const level = t(`quality.${this.quality.level as 0 | 1 | 2}`);
      this.console.print(t(step > 0 ? 'console.qualityDown' : 'console.qualityUp', { level }), 'muted');
    }
    if (nowMs - this.lastSnapshotAt >= SNAPSHOT_INTERVAL_MS) {
      this.lastSnapshotAt = nowMs;
      this.store.set(this.buildSnapshot());
    }
  }

  reportLoopError(stage: 'tick' | 'render' | 'frame', err: unknown): void {
    this.reportError(`loop:${stage}`, err);
  }

  // ── Snapshot ────────────────────────────────────────────────────────────────

  /** Publishes immediately (after commands whose result the UI must show at once). */
  publishSnapshot(): void {
    this.lastSnapshotAt = performance.now();
    this.store.set(this.buildSnapshot());
  }

  private buildSnapshot(): UiSnapshot {
    const loop = this.loop;
    const fps = this.perf.fps(this.fpsScratch);
    const suspended = this.scheduler.suspendedCount;
    return {
      rev: ++this.snapshotRev,
      time: {
        tick: this.tick,
        year: yearOf(this.tick),
        season: seasonOf(this.tick),
        speedIndex: loop.speedIndex,
        resumeSpeedIndex: loop.resumeSpeedIndex,
        effectiveSpeed: loop.effectiveSpeed,
        dropping: loop.dropping,
      },
      perf: {
        fpsAvg: fps.avg,
        fpsLow: fps.low1,
        frameMs: this.perf.lastFrameMs,
        simMs: this.perf.simMs,
        renderMs: this.perf.renderMs,
        bakeMs: this.perf.bakeMs,
        ticksPerFrame: this.perf.ticksPerFrame,
        quality: this.quality.level,
        systemsActive: this.scheduler.count - suspended,
        systemsSuspended: suspended,
        historyRev: this.perf.rev,
      },
      seed: this.seed,
      errorCount: this.errors.totalReported,
    };
  }

  // ── Commands and errors ─────────────────────────────────────────────────────

  private readonly applyCommand = (cmd: SimCommand): void => {
    switch (cmd.kind) {
      case 'injectFaultySystem':
        this.scheduler.remove(CRASH_SYSTEM_ID);
        this.scheduler.add(new CrashTestSystem(), this);
        break;
    }
  };

  /** Logs an error to the Dev Console; extraStack carries e.g. a React component stack. */
  reportError(source: string, err: unknown, extraStack?: string): void {
    this.errors.report(source, err, this.tick, extraStack);
  }

  private onSuspended(kind: 'system' | 'layer', id: string, err: unknown): void {
    const message = describeError(err).message;
    const n = ROBUSTNESS.maxConsecutiveFailures;
    if (kind === 'system') {
      this.events.emit('systemSuspended', this.tick, 2, { system: id, message });
      this.console.print(t('console.systemSuspended', { system: id, n, message }), 'error');
      this.toasts.push({ kind: 'danger', textKey: 'toast.systemSuspended', manyKey: 'toast.systemSuspendedMany', params: { system: id, n }, mergeKey: 'suspended-system' });
    } else {
      this.events.emit('layerSuspended', this.tick, 2, { layer: id, message });
      this.console.print(t('console.layerSuspended', { layer: id, n, message }), 'error');
      this.toasts.push({ kind: 'danger', textKey: 'toast.layerSuspended', manyKey: 'toast.layerSuspendedMany', params: { layer: id, n }, mergeKey: 'suspended-layer' });
    }
    this.publishSnapshot();
  }

  private readonly onListenerError = (err: unknown): void => {
    this.reportError('events', err);
  };

  private readonly onWindowError = (e: ErrorEvent): void => {
    this.reportError('window', e.error ?? e.message);
  };

  private readonly onRejection = (e: PromiseRejectionEvent): void => {
    this.reportError('promise', e.reason);
  };
}
