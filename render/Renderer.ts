import { ROBUSTNESS } from '../engine/config';

/** Per-frame drawing context, one reused object (no allocation per frame). */
export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  /** Canvas size in device pixels. */
  widthPx: number;
  heightPx: number;
  dpr: number;
  /** Real time in seconds (UI and decorative animation). */
  nowSec: number;
  dtSec: number;
  /** Simulation time in seconds at 1× scale: (tick + alpha) / ticksPerSecond. */
  simSeconds: number;
  alpha: number;
  quality: number;
  decorScale: number;
  reduceMotion: boolean;
}

/** A render layer (section 3.3 frame order). Layers draw in registration order. */
export interface RenderLayer {
  readonly id: string;
  draw(rc: RenderContext): void;
}

export interface LayerInfo {
  readonly id: string;
  readonly avgMs: number;
  readonly suspended: boolean;
}

interface Slot {
  layer: RenderLayer;
  failures: number;
  suspended: boolean;
  avgMs: number;
}

const EMA = 0.05;

/**
 * Owns the main canvas: devicePixelRatio-correct sizing via ResizeObserver, imageSmoothing
 * re-applied after every resize, and layers isolated by try/catch with suspension after
 * repeated failures (rule 14).
 */
export class Renderer {
  readonly rc: RenderContext;
  private canvas: HTMLCanvasElement | null = null;
  private observer: ResizeObserver | null = null;
  private dprQuery: MediaQueryList | null = null;
  private slots: Slot[] = [];
  private background = '#000000';

  constructor(
    private readonly onError: (id: string, err: unknown) => void,
    private readonly onSuspend: (id: string, err: unknown) => void,
  ) {
    const stub = document.createElement('canvas').getContext('2d');
    if (!stub) throw new Error('Canvas 2D is not available in this browser');
    this.rc = {
      ctx: stub,
      widthPx: 1,
      heightPx: 1,
      dpr: 1,
      nowSec: 0,
      dtSec: 0,
      simSeconds: 0,
      alpha: 0,
      quality: 0,
      decorScale: 1,
      reduceMotion: false,
    };
  }

  setBackground(css: string): void {
    this.background = css;
  }

  attach(canvas: HTMLCanvasElement): void {
    this.detach();
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D is not available in this browser');
    this.canvas = canvas;
    this.rc.ctx = ctx;
    this.observer = new ResizeObserver(this.onResize);
    try {
      this.observer.observe(canvas, { box: 'device-pixel-content-box' });
    } catch {
      this.observer.observe(canvas);
    }
    this.watchDpr();
    this.measure(null);
  }

  detach(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.dprQuery?.removeEventListener('change', this.onDprChange);
    this.dprQuery = null;
    this.canvas = null;
  }

  addLayer(layer: RenderLayer): void {
    this.removeLayer(layer.id);
    this.slots.push({ layer, failures: 0, suspended: false, avgMs: 0 });
  }

  removeLayer(id: string): void {
    this.slots = this.slots.filter((s) => s.layer.id !== id);
  }

  hasLayer(id: string): boolean {
    for (const s of this.slots) if (s.layer.id === id) return true;
    return false;
  }

  /** Draws all layers. Returns false when there is nothing to draw on. */
  render(): boolean {
    if (!this.canvas) return false;
    const rc = this.rc;
    const ctx = rc.ctx;
    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, rc.widthPx, rc.heightPx);
    const slots = this.slots;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (s.suspended) continue;
      const t0 = performance.now();
      ctx.save();
      try {
        s.layer.draw(rc);
        s.failures = 0;
      } catch (err) {
        this.fail(s, err);
      }
      ctx.restore();
      s.avgMs += (performance.now() - t0 - s.avgMs) * EMA;
    }
    return true;
  }

  list(): LayerInfo[] {
    return this.slots.map((s) => ({ id: s.layer.id, avgMs: s.avgMs, suspended: s.suspended }));
  }

  get suspendedCount(): number {
    let n = 0;
    for (const s of this.slots) if (s.suspended) n++;
    return n;
  }

  private fail(s: Slot, err: unknown): void {
    s.failures++;
    this.onError(s.layer.id, err);
    if (s.failures >= ROBUSTNESS.maxConsecutiveFailures && !s.suspended) {
      s.suspended = true;
      this.onSuspend(s.layer.id, err);
    }
  }

  private readonly onResize = (entries: ResizeObserverEntry[]): void => {
    this.measure(entries[0] ?? null);
  };

  private readonly onDprChange = (): void => {
    this.watchDpr();
    this.measure(null);
  };

  /** Re-registers a media query that fires when devicePixelRatio changes (zoom, monitor move). */
  private watchDpr(): void {
    this.dprQuery?.removeEventListener('change', this.onDprChange);
    try {
      this.dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      this.dprQuery.addEventListener('change', this.onDprChange);
    } catch {
      this.dprQuery = null;
    }
  }

  private measure(entry: ResizeObserverEntry | null): void {
    const c = this.canvas;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    let w: number;
    let h: number;
    const box = entry?.devicePixelContentBoxSize?.[0];
    if (box) {
      w = box.inlineSize;
      h = box.blockSize;
    } else {
      const r = c.getBoundingClientRect();
      w = Math.round(r.width * dpr);
      h = Math.round(r.height * dpr);
    }
    w = Math.max(1, w);
    h = Math.max(1, h);
    if (c.width !== w) c.width = w;
    if (c.height !== h) c.height = h;
    this.rc.widthPx = w;
    this.rc.heightPx = h;
    this.rc.dpr = dpr;
    // Resizing a canvas resets its context state: re-apply crisp pixel scaling every time.
    this.rc.ctx.imageSmoothingEnabled = false;
  }
}
