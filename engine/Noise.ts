import { RNG } from './config';
import { Rng } from './Rng';

/** Mutable 2D vector used as an out-parameter so noise calls never allocate. */
export interface Vec2 {
  x: number;
  y: number;
}

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
/** The 12 classic gradient directions (x/y of Perlin's grad3 set). */
const GRAD_X = new Float64Array([1, -1, 1, -1, 1, -1, 1, -1, 0, 0, 0, 0]);
const GRAD_Y = new Float64Array([1, 1, -1, -1, 0, 0, 0, 0, 1, -1, 1, -1]);
/** Decorrelates fBm octaves: each octave samples a shifted region of the same field. */
const OCTAVE_SHIFT_X = 17.137;
const OCTAVE_SHIFT_Y = -9.713;
/** Offsets that make the two warp layers sample independent regions (Quilez, "Domain warping"). */
const WARP_OFFSETS = new Float64Array([0, 0, 5.2, 1.3, 1.7, 9.2, 8.3, 2.8]);

/**
 * Seeded 2D simplex noise (Gustavson's reference formulation) with fBm, ridged multifractal and
 * two-layer domain warping. Output of simplex() is roughly in [-1, 1]. No library, no allocation.
 */
export class Noise2D {
  private readonly perm = new Uint8Array(512);
  private readonly permMod12 = new Uint8Array(512);

  constructor(seed: number, salt: number = RNG.noiseSalt) {
    this.reseed(seed, salt);
  }

  /** Builds the permutation table with a seeded Fisher–Yates shuffle. */
  reseed(seed: number, salt: number = RNG.noiseSalt): void {
    const rng = new Rng(seed, salt);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = rng.int(i + 1);
      const t = p[i];
      p[i] = p[j];
      p[j] = t;
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  simplex(xin: number, yin: number): number {
    const perm = this.perm;
    const pm = this.permMod12;
    // Skew the input space to find the containing simplex cell.
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    let n = 0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 > 0) {
      const g = pm[ii + perm[jj]];
      t0 *= t0;
      n += t0 * t0 * (GRAD_X[g] * x0 + GRAD_Y[g] * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 > 0) {
      const g = pm[ii + i1 + perm[jj + j1]];
      t1 *= t1;
      n += t1 * t1 * (GRAD_X[g] * x1 + GRAD_Y[g] * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 > 0) {
      const g = pm[ii + 1 + perm[jj + 1]];
      t2 *= t2;
      n += t2 * t2 * (GRAD_X[g] * x2 + GRAD_Y[g] * y2);
    }
    return 70 * n;
  }

  /** Fractional Brownian motion: sum of octaves, normalized to roughly [-1, 1]. */
  fbm(x: number, y: number, octaves: number, lacunarity = 2, gain = 0.5): number {
    let sum = 0;
    let amp = 1;
    let freq = 1;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += amp * this.simplex(x * freq + o * OCTAVE_SHIFT_X, y * freq + o * OCTAVE_SHIFT_Y);
      norm += amp;
      amp *= gain;
      freq *= lacunarity;
    }
    return sum / norm;
  }

  /**
   * Ridged multifractal (Musgrave): inverted |noise| squared, each octave weighted by the
   * previous one so ridges stay sharp and valleys smooth. Returns [0, 1].
   */
  ridged(x: number, y: number, octaves: number, lacunarity = 2, gain = 0.5): number {
    let sum = 0;
    let amp = 1;
    let freq = 1;
    let norm = 0;
    let weight = 1;
    for (let o = 0; o < octaves; o++) {
      let n = 1 - Math.abs(this.simplex(x * freq + o * OCTAVE_SHIFT_X, y * freq + o * OCTAVE_SHIFT_Y));
      n *= n;
      n *= weight;
      weight = n * 2;
      if (weight > 1) weight = 1;
      else if (weight < 0) weight = 0;
      sum += n * amp;
      norm += amp;
      amp *= gain;
      freq *= lacunarity;
    }
    return sum / norm;
  }

  /**
   * Two-layer domain warp (Quilez): q = fbm(p), r = fbm(p + 4q), result = p + strength·r.
   * `frequency` scales p before sampling; strength is in input units. Writes into `out`.
   */
  warp(x: number, y: number, frequency: number, strength: number, octaves: number, out: Vec2): void {
    const px = x * frequency;
    const py = y * frequency;
    const o = WARP_OFFSETS;
    const qx = this.fbm(px + o[0], py + o[1], octaves);
    const qy = this.fbm(px + o[2], py + o[3], octaves);
    const rx = this.fbm(px + 4 * qx + o[4], py + 4 * qy + o[5], octaves);
    const ry = this.fbm(px + 4 * qx + o[6], py + 4 * qy + o[7], octaves);
    out.x = x + strength * rx;
    out.y = y + strength * ry;
  }
}
