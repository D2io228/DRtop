import { RNG } from './config';

/**
 * sfc32 ("Small Fast Counting" PRNG by Chris Doty-Humphrey): 128-bit state, passes PractRand,
 * and needs only 32-bit integer ops. One instance per stream; streams never share state.
 */
export class Rng {
  private a = 0;
  private b = 0;
  private c = 0;
  private d = 0;

  constructor(seed: number, salt: number) {
    this.reseed(seed, salt);
  }

  /** Seeds the four state words with splitmix32 so nearby seeds give unrelated streams. */
  reseed(seed: number, salt: number): void {
    let s = (seed ^ salt) >>> 0;
    s = (s + 0x9e3779b9) | 0;
    this.a = splitmix(s);
    s = (s + 0x9e3779b9) | 0;
    this.b = splitmix(s);
    s = (s + 0x9e3779b9) | 0;
    this.c = splitmix(s);
    s = (s + 0x9e3779b9) | 0;
    this.d = splitmix(s);
    for (let i = 0; i < RNG.warmup; i++) this.nextU32();
  }

  /** Uniform 32-bit unsigned integer. */
  nextU32(): number {
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const t = (((a + b) | 0) + d) | 0;
    this.d = (d + 1) | 0;
    this.a = b ^ (b >>> 9);
    this.b = (c + (c << 3)) | 0;
    const r = (c << 21) | (c >>> 11);
    this.c = (r + t) | 0;
    return t >>> 0;
  }

  /** Uniform float in [0, 1). */
  float(): number {
    return this.nextU32() / 4294967296;
  }

  /** Uniform float in [min, max). */
  range(min: number, max: number): number {
    return min + (max - min) * this.float();
  }

  /** Uniform integer in [0, n). */
  int(n: number): number {
    return Math.floor(this.float() * n);
  }

  /** Uniform integer in [min, max] (inclusive). */
  intRange(min: number, max: number): number {
    return min + Math.floor(this.float() * (max - min + 1));
  }

  chance(p: number): boolean {
    return this.float() < p;
  }

  /** Approximately normal (sum of 4 uniforms), mean 0, standard deviation ≈ 1. */
  gaussish(): number {
    return (this.float() + this.float() + this.float() + this.float() - 2) * 1.7320508;
  }

  /** Copies the state into out[0..3] (save games, replays). */
  getState(out: Uint32Array): void {
    out[0] = this.a >>> 0;
    out[1] = this.b >>> 0;
    out[2] = this.c >>> 0;
    out[3] = this.d >>> 0;
  }

  setState(src: Uint32Array): void {
    this.a = src[0] | 0;
    this.b = src[1] | 0;
    this.c = src[2] | 0;
    this.d = src[3] | 0;
  }
}

function splitmix(x: number): number {
  let z = x | 0;
  z = Math.imul(z ^ (z >>> 16), 0x21f0aaad);
  z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
  return (z ^ (z >>> 15)) >>> 0;
}

/** MurmurHash3 finalizer: full avalanche of a 32-bit value. */
export function fmix32(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Integer hash of (x, y, salt) → uint32. Used for per-tile variation (never consumes a stream). */
export function hash2(x: number, y: number, salt: number): number {
  let h = Math.imul((salt | 0) ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (x | 0), 0xcc9e2d51);
  h = (h << 15) | (h >>> 17);
  h = Math.imul(h ^ (y | 0), 0x1b873593);
  h = (h << 13) | (h >>> 19);
  return fmix32(h);
}

/** hash2 mapped to [0, 1). */
export function hash2f(x: number, y: number, salt: number): number {
  return hash2(x, y, salt) / 4294967296;
}

/** FNV-1a over UTF-16 code units, then fmix32. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return fmix32(h);
}

export interface SeedInfo {
  /** What the player typed or saw ("12345", "velmora"). */
  readonly text: string;
  /** The 32-bit seed actually used. */
  readonly value: number;
}

/** Seeds can be numbers or words; words (and very long numbers) are hashed to 32 bits. */
export function parseSeed(input: string): SeedInfo {
  const text = input.trim();
  if (/^\d+$/.test(text) && text.length <= RNG.maxNumericSeedDigits) {
    return { text, value: Number(text) >>> 0 };
  }
  return { text, value: hashString(text) };
}

/** A fresh non-deterministic seed from the platform CSPRNG (never Math.random). */
export function randomSeed(): SeedInfo {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const value = buf[0] >>> 0;
  return { text: String(value), value };
}

/** The three independent streams of rule 6. fx is visual-only and never touches the simulation. */
export class RngStreams {
  readonly worldgen: Rng;
  readonly sim: Rng;
  readonly fx: Rng;

  constructor(seed: number) {
    this.worldgen = new Rng(seed, RNG.streams.worldgen);
    this.sim = new Rng(seed, RNG.streams.sim);
    this.fx = new Rng(seed, RNG.streams.fx);
  }

  reseed(seed: number): void {
    this.worldgen.reseed(seed, RNG.streams.worldgen);
    this.sim.reseed(seed, RNG.streams.sim);
    this.fx.reseed(seed, RNG.streams.fx);
  }
}
