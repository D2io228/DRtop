/** 4×4 Bayer ordered-dither thresholds in [0, 1), indexed by (y & 3) * 4 + (x & 3). */
export const BAYER4 = new Float32Array([0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16));

export function bayer4(x: number, y: number): number {
  return BAYER4[((y & 3) << 2) | (x & 3)];
}
