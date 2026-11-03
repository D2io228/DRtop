import { PERF, TIME } from './config';
import { TICK_MS, speedOf } from './time';

/** What the loop drives. Game implements it. */
export interface LoopHost {
  stepTick(): void;
  renderFrame(alpha: number, nowMs: number, dtMs: number): void;
  endFrame(nowMs: number, dtMs: number): void;
  reportLoopError(stage: 'tick' | 'render' | 'frame', err: unknown): void;
}

/**
 * One requestAnimationFrame loop with a fixed-timestep accumulator ("Fix Your Timestep",
 * G. Fiedler). Ticks are capped by count and by the sim budget; when the sim falls behind,
 * the remaining ticks are dropped (never a spiral of death) and the effective speed is reported.
 */
export class Loop {
  speedIndex: number = TIME.defaultSpeedIndex;
  /** Interpolation factor between the previous and current tick, 0..1. */
  alpha = 0;
  ticksThisFrame = 0;
  simMs = 0;
  /** Measured speed over the last window (ticks run per second / ticks per second at 1×). */
  effectiveSpeed: number = speedOf(TIME.defaultSpeedIndex);
  /** True when ticks were dropped during the last window. */
  dropping = false;
  droppedTotal = 0;

  private lastSpeedIndex: number = TIME.defaultSpeedIndex;
  private rafId = 0;
  private running = false;
  private lastNow = -1;
  private acc = 0;
  private freezeUntil = 0;
  private windowStart = -1;
  private windowTicks = 0;
  private windowDrops = 0;

  constructor(private readonly host: LoopHost) {}

  get speed(): number {
    return speedOf(this.speedIndex);
  }

  get paused(): boolean {
    return this.speedIndex === 0;
  }

  /** Speed index to restore when unpausing. */
  get resumeSpeedIndex(): number {
    return this.lastSpeedIndex;
  }

  setSpeedIndex(index: number): void {
    const i = Math.max(0, Math.min(TIME.speeds.length - 1, Math.round(index)));
    if (i > 0) this.lastSpeedIndex = i;
    this.speedIndex = i;
    this.resetWindow();
  }

  togglePause(): void {
    this.setSpeedIndex(this.paused ? this.lastSpeedIndex : 0);
  }

  /** Hit-stop: freezes the simulation (not rendering) for ms milliseconds. */
  freeze(ms: number): void {
    this.freezeUntil = Math.max(this.freezeUntil, performance.now() + ms);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastNow = -1;
    this.acc = 0;
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  get isRunning(): boolean {
    return this.running;
  }

  private readonly frame = (now: number): void => {
    if (!this.running) return;
    // Schedule first so an exception can never stop the loop.
    this.rafId = requestAnimationFrame(this.frame);
    const dt = this.lastNow < 0 ? 0 : Math.min(now - this.lastNow, TIME.maxFrameDeltaMs);
    this.lastNow = now;
    try {
      this.advance(now, dt);
    } catch (err) {
      this.host.reportLoopError('tick', err);
    }
    try {
      this.host.renderFrame(this.alpha, now, dt);
    } catch (err) {
      this.host.reportLoopError('render', err);
    }
    try {
      this.host.endFrame(now, dt);
    } catch (err) {
      this.host.reportLoopError('frame', err);
    }
  };

  private advance(now: number, dt: number): void {
    this.ticksThisFrame = 0;
    this.simMs = 0;
    if (this.windowStart < 0) this.windowStart = now;
    if (!this.paused && now >= this.freezeUntil) {
      this.acc += dt * this.speed;
      const t0 = performance.now();
      while (this.acc >= TICK_MS) {
        const overCount = this.ticksThisFrame >= PERF.maxTicksPerFrame;
        const overTime = this.ticksThisFrame > 0 && performance.now() - t0 > PERF.budget.simMs;
        if (overCount || overTime) {
          const drop = Math.floor(this.acc / TICK_MS);
          this.windowDrops += drop;
          this.droppedTotal += drop;
          this.acc -= drop * TICK_MS;
          break;
        }
        this.host.stepTick();
        this.ticksThisFrame++;
        this.acc -= TICK_MS;
      }
      this.simMs = performance.now() - t0;
      this.alpha = this.acc / TICK_MS;
      this.windowTicks += this.ticksThisFrame;
    }
    const elapsed = now - this.windowStart;
    if (elapsed >= PERF.effectiveSpeedWindowMs) {
      const ticksPerSecond = (this.windowTicks * 1000) / elapsed;
      this.effectiveSpeed = this.paused ? 0 : ticksPerSecond / TIME.ticksPerSecond;
      this.dropping = this.windowDrops > 0;
      this.windowStart = now;
      this.windowTicks = 0;
      this.windowDrops = 0;
    }
  }

  private resetWindow(): void {
    this.windowStart = -1;
    this.windowTicks = 0;
    this.windowDrops = 0;
    this.dropping = false;
    this.effectiveSpeed = this.speed;
  }
}
