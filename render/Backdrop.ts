import { BACKDROP } from '../engine/config';
import { Noise2D, type Vec2 } from '../engine/Noise';
import { bayer4 } from './dither';
import type { Palette } from './Palette';
import type { RenderContext, RenderLayer } from './Renderer';

/**
 * The primordial sea shown before a world exists (replaced by terrain rendering in Step 1.3):
 * a domain-warped fBm depth field quantized to the 6-step depth ramp with Bayer dithering on band
 * edges. It drifts with simulation time, so pause and speed changes are visible. The field lives
 * in a small ImageData; when the drift crosses a cell, the buffer is shifted and only the newly
 * exposed cells are computed (incremental scrolling, no full recompute per frame).
 */
export class BackdropLayer implements RenderLayer {
  readonly id = 'backdrop';
  private readonly noise: Noise2D;
  private readonly canvas = document.createElement('canvas');
  private readonly ctx: CanvasRenderingContext2D;
  private img: ImageData | null = null;
  private buf = new Uint32Array(0);
  private cols = 0;
  private rows = 0;
  private originX = 0;
  private originY = 0;
  private valid = false;
  private driftX = 0;
  private driftY = 0;
  private lastSim = 0;
  private readonly colors: Uint32Array;
  private readonly warped: Vec2 = { x: 0, y: 0 };

  constructor(palette: Palette, seed: number) {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas unavailable');
    this.ctx = ctx;
    this.noise = new Noise2D(seed);
    this.colors = new Uint32Array(palette.depth.map((c) => c.u32));
  }

  reseed(seed: number): void {
    this.noise.reseed(seed);
    this.valid = false;
  }

  draw(rc: RenderContext): void {
    const cell = Math.max(2, Math.round(BACKDROP.cellCss[Math.min(rc.quality, BACKDROP.cellCss.length - 1)] * rc.dpr));
    const cols = Math.ceil(rc.widthPx / cell) + 2;
    const rows = Math.ceil(rc.heightPx / cell) + 2;
    if (cols !== this.cols || rows !== this.rows) this.allocate(cols, rows);

    // Integrate drift from simulation time (frozen while paused, faster at higher speeds).
    const dSim = rc.simSeconds - this.lastSim;
    this.lastSim = rc.simSeconds;
    if (dSim > 0 && dSim < 60) {
      const k = rc.reduceMotion ? BACKDROP.reduceMotionDrift : 1;
      this.driftX += dSim * BACKDROP.driftX * k;
      this.driftY += dSim * BACKDROP.driftY * k;
    }
    const ox = Math.floor(this.driftX);
    const oy = Math.floor(this.driftY);
    this.scrollTo(ox, oy);

    const fx = Math.round((this.driftX - ox) * cell);
    const fy = Math.round((this.driftY - oy) * cell);
    const ctx = rc.ctx;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.canvas, 0, 0, cols, rows, -fx, -fy, cols * cell, rows * cell);
  }

  private allocate(cols: number, rows: number): void {
    this.cols = cols;
    this.rows = rows;
    this.canvas.width = cols;
    this.canvas.height = rows;
    this.img = this.ctx.createImageData(cols, rows);
    this.buf = new Uint32Array(this.img.data.buffer);
    this.valid = false;
  }

  private scrollTo(ox: number, oy: number): void {
    const img = this.img;
    if (!img) return;
    const dx = ox - this.originX;
    const dy = oy - this.originY;
    if (this.valid && dx === 0 && dy === 0) return;
    const cols = this.cols;
    const rows = this.rows;
    const max = BACKDROP.maxIncrementalShift;
    if (!this.valid || Math.abs(dx) > max || Math.abs(dy) > max || Math.abs(dx) >= cols || Math.abs(dy) >= rows) {
      this.originX = ox;
      this.originY = oy;
      this.fill(0, 0, cols, rows);
      this.valid = true;
    } else {
      this.shift(dx, dy);
      this.originX = ox;
      this.originY = oy;
      if (dx > 0) this.fill(cols - dx, 0, cols, rows);
      else if (dx < 0) this.fill(0, 0, -dx, rows);
      if (dy > 0) this.fill(0, rows - dy, cols, rows);
      else if (dy < 0) this.fill(0, 0, cols, -dy);
    }
    this.ctx.putImageData(img, 0, 0);
  }

  /** Moves existing cells by (−dx, −dy) in place with copyWithin. */
  private shift(dx: number, dy: number): void {
    const b = this.buf;
    const cols = this.cols;
    const rows = this.rows;
    if (dy > 0) b.copyWithin(0, dy * cols, rows * cols);
    else if (dy < 0) b.copyWithin(-dy * cols, 0, (rows + dy) * cols);
    if (dx !== 0) {
      for (let r = 0; r < rows; r++) {
        const row = r * cols;
        if (dx > 0) b.copyWithin(row, row + dx, row + cols);
        else b.copyWithin(row - dx, row, row + cols + dx);
      }
    }
  }

  private fill(c0: number, r0: number, c1: number, r1: number): void {
    const b = this.buf;
    const cols = this.cols;
    const colors = this.colors;
    const bands = colors.length;
    const noise = this.noise;
    const w = this.warped;
    const f = BACKDROP.frequency;
    for (let r = r0; r < r1; r++) {
      const wy = this.originY + r;
      for (let c = c0; c < c1; c++) {
        const wx = this.originX + c;
        noise.warp(wx, wy, BACKDROP.warpFrequency, BACKDROP.warpStrength, 1, w);
        const v = noise.fbm(w.x * f, w.y * f, BACKDROP.octaves);
        let t = BACKDROP.bias + v * BACKDROP.contrast;
        t = t < 0 ? 0 : t > 0.9999 ? 0.9999 : t;
        // Ordered dithering only near band edges: the threshold shifts the band by < 1/2 band.
        let band = Math.floor(t * bands + (bayer4(wx, wy) - 0.5) * BACKDROP.dither);
        band = band < 0 ? 0 : band >= bands ? bands - 1 : band;
        b[r * cols + c] = colors[band];
      }
    }
  }
}
