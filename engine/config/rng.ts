/** Salts that split the seeded PRNG family into independent streams. */
export const RNG = {
  streams: {
    worldgen: 0x5bd1e995,
    sim: 0x27d4eb2f,
    fx: 0x165667b1,
  },
  /** Discarded outputs after seeding sfc32 (warm-up). */
  warmup: 12,
  /** Salt for the noise permutation table. */
  noiseSalt: 0x68e31da4,
  /** Digit strings longer than this are hashed instead of parsed. */
  maxNumericSeedDigits: 15,
} as const;
