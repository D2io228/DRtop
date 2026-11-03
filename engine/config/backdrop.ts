/**
 * The "primordial sea" drawn before a world exists: a dithered depth field that drifts with
 * simulation time (so pause and speed are visible). Replaced by world rendering in Step 1.3.
 */
export const BACKDROP = {
  /** Size of one backdrop cell in CSS pixels, per adaptive-quality level. */
  cellCss: [6, 8, 10] as const,
  /** Drift in cells per simulated second. */
  driftX: 0.35,
  driftY: 0.12,
  /** Drift multiplier when Reduce motion is on. */
  reduceMotionDrift: 0.4,
  /** Noise frequency in cycles per cell. */
  frequency: 0.011,
  octaves: 4,
  warpStrength: 9,
  warpFrequency: 0.004,
  /** Maps the fBm value to depth: t = bias + value × contrast (0 = shallow, 1 = deep). */
  bias: 0.62,
  contrast: 0.8,
  /** Bayer dither amplitude across band edges (0..1 of a band). */
  dither: 0.55,
  /** Exposed columns/rows are computed incrementally up to this shift; larger jumps recompute all. */
  maxIncrementalShift: 8,
} as const;
