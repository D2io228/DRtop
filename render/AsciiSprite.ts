import type { RampId } from '../engine/config';
import type { Palette, PaletteColor } from './Palette';

/**
 * Hand-authored ASCII pixel map (section 4.5):
 * '.' transparent · '1'–'5' primary ramp (dark → light) · 'A'–'E' secondary ramp ·
 * 'x' darkest ink · 'w' highlight · 'k','l','m' swap ramp steps 1–3 (variants, kingdom colors).
 * Outlines are generated at bake time — never drawn by hand.
 */
export interface Frame {
  readonly w: number;
  readonly h: number;
  /** Foot/pivot point in frame pixels. */
  readonly anchor: readonly [number, number];
  readonly primary: RampId;
  readonly secondary?: RampId;
  readonly swap?: RampId;
  readonly rows: readonly string[];
}

export interface BakeOptions {
  /** Generate the selective outline. */
  readonly outline: boolean;
  /** Transparent border added around the frame (room for the outline). */
  readonly pad: number;
  /** Replaces the swap ramp (palette swaps). */
  readonly swapOverride?: RampId;
}

const PRIMARY = '12345';
const SECONDARY = 'ABCDE';
const SWAP = 'klm';

interface Resolved {
  color: PaletteColor;
  outline: PaletteColor;
}

function resolve(ch: string, frame: Frame, palette: Palette, swap: RampId | undefined): Resolved | null {
  if (ch === '.') return null;
  if (ch === 'x') return { color: palette.ink, outline: palette.ink };
  if (ch === 'w') return { color: palette.highlight, outline: palette.ink };
  let i = PRIMARY.indexOf(ch);
  if (i >= 0) return { color: palette.ramp(frame.primary)[i], outline: palette.darkest(frame.primary) };
  i = SECONDARY.indexOf(ch);
  if (i >= 0 && frame.secondary) return { color: palette.ramp(frame.secondary)[i], outline: palette.darkest(frame.secondary) };
  i = SWAP.indexOf(ch);
  if (i >= 0 && swap) return { color: palette.ramp(swap)[i + 1], outline: palette.darkest(swap) };
  throw new Error(`Sprite uses undefined pixel '${ch}'`);
}

/**
 * Bakes a frame into a canvas. Selective outline: every transparent pixel 4-adjacent to an opaque
 * one takes the darkest step of that neighbor's ramp (never black). Outline pixels are written to
 * a second buffer so they never chain into a thicker outline.
 */
export function bakeFrame(frame: Frame, palette: Palette, opts: BakeOptions): HTMLCanvasElement {
  if (frame.rows.length !== frame.h) throw new Error(`Sprite has ${frame.rows.length} rows, expected ${frame.h}`);
  const pad = opts.pad;
  const W = frame.w + pad * 2;
  const H = frame.h + pad * 2;
  const px = new Uint32Array(W * H);
  const outlineOf = new Uint32Array(W * H);
  const swap = opts.swapOverride ?? frame.swap;
  for (let y = 0; y < frame.h; y++) {
    const row = frame.rows[y];
    if (row.length !== frame.w) throw new Error(`Sprite row ${y} has ${row.length} pixels, expected ${frame.w}`);
    for (let x = 0; x < frame.w; x++) {
      const r = resolve(row[x], frame, palette, swap);
      if (!r) continue;
      const i = (y + pad) * W + (x + pad);
      px[i] = r.color.u32;
      outlineOf[i] = r.outline.u32;
    }
  }
  const out = new Uint32Array(px);
  if (opts.outline) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (px[i] !== 0) continue;
        let n = 0;
        if (y > 0 && px[i - W] !== 0) n = outlineOf[i - W];
        else if (x > 0 && px[i - 1] !== 0) n = outlineOf[i - 1];
        else if (x < W - 1 && px[i + 1] !== 0) n = outlineOf[i + 1];
        else if (y < H - 1 && px[i + W] !== 0) n = outlineOf[i + W];
        if (n !== 0) out[i] = n;
      }
    }
  }
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');
  const img = ctx.createImageData(W, H);
  new Uint32Array(img.data.buffer).set(out);
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Nearest-neighbor integer upscale (pixel-exact). */
export function upscale(src: HTMLCanvasElement, factor: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = src.width * factor;
  c.height = src.height * factor;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return c;
}
