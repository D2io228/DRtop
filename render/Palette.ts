import { BASE_COLORS, DEPTH_RAMP, HIGHLIGHT, INK, RAMP_RULES, SHADOW, type RampId } from '../engine/config';
import { lchOf, mixOklab, oklchToRgb, packRgba, parseHex, rotateHueToward, toHex, type Rgb } from './color';

/** One color in every representation the renderers need (built once, never per draw). */
export interface PaletteColor {
  readonly rgb: Rgb;
  readonly css: string;
  /** ImageData Uint32 (little-endian ABGR). */
  readonly u32: number;
}

/** A ramp: steps ordered dark → light. Index 2 is the base color for 5-step ramps. */
export type Ramp = readonly PaletteColor[];

function color(rgb: Rgb): PaletteColor {
  return { rgb, css: toHex(rgb), u32: packRgba(rgb) };
}

/**
 * Hue-shifted OKLCH ramps (section 4.2): for k ∈ {−2..2}, L = L0 + 0.075k, chroma × (1 − 0.12|k|),
 * hue rotated toward 265° (cool) in shadows and 85° (warm) in highlights, gamut-mapped, and
 * lightness clamped between the ink and highlight colors (no pure black or white).
 */
export class Palette {
  readonly ink: PaletteColor = color(parseHex(INK));
  readonly highlight: PaletteColor = color(parseHex(HIGHLIGHT));
  readonly shadow: PaletteColor = color(parseHex(SHADOW));
  /** Shallow → deep ocean, DEPTH_RAMP.steps entries. */
  readonly depth: Ramp;
  private readonly ramps = new Map<RampId, Ramp>();

  constructor() {
    const minL = lchOf(this.ink.rgb).L;
    const maxL = lchOf(this.highlight.rgb).L;
    for (const id of Object.keys(BASE_COLORS) as RampId[]) {
      this.ramps.set(id, buildRamp(BASE_COLORS[id], minL, maxL));
    }
    this.depth = buildDepthRamp();
  }

  ramp(id: RampId): Ramp {
    const r = this.ramps.get(id);
    if (!r) throw new Error(`Unknown ramp ${id}`);
    return r;
  }

  /** Base (middle) color of a ramp. */
  base(id: RampId): PaletteColor {
    return this.ramp(id)[2];
  }

  /** Darkest step: used for selective outlines. */
  darkest(id: RampId): PaletteColor {
    return this.ramp(id)[0];
  }
}

function buildRamp(hex: string, minL: number, maxL: number): Ramp {
  const base = lchOf(parseHex(hex));
  const R = RAMP_RULES;
  const half = (R.steps - 1) / 2;
  const out: PaletteColor[] = [];
  for (let i = 0; i < R.steps; i++) {
    const k = i - half;
    const L = Math.min(maxL, Math.max(minL, base.L + R.lightnessStep * k));
    const C = base.C * (1 - R.chromaFalloff * Math.abs(k));
    let h = base.h;
    if (k < 0) h = rotateHueToward(h, R.coolHue, R.shadowHueShiftDeg * -k);
    else if (k > 0) h = rotateHueToward(h, R.warmHue, R.highlightHueShiftDeg * k);
    out.push(color(oklchToRgb(L, C, h)));
  }
  return out;
}

/** Piecewise OKLab interpolation through the depth stops (shallow → ocean → deep ocean). */
function buildDepthRamp(): Ramp {
  const stops = DEPTH_RAMP.stops.map((id) => parseHex(BASE_COLORS[id]));
  const n = DEPTH_RAMP.steps;
  const out: PaletteColor[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (stops.length - 1);
    const seg = Math.min(stops.length - 2, Math.floor(t));
    out.push(color(mixOklab(stops[seg], stops[seg + 1], t - seg)));
  }
  return out;
}
