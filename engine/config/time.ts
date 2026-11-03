/** Simulation clock. Values are written in seconds/years and converted by engine/time.ts. */
export const TIME = {
  /** Fixed simulation steps per second at 1×. */
  ticksPerSecond: 20,
  /** Real seconds per in-game year at 1× (1 year = 600 ticks). */
  yearSeconds: 30,
  seasonsPerYear: 4,
  /** Speed multipliers; index 0 is pause. Hotkeys 1–5 select indices 1–5. */
  speeds: [0, 1, 2, 5, 10, 25] as const,
  defaultSpeedIndex: 1,
  /** Accumulator clamp after tab switches or long frames (ms). */
  maxFrameDeltaMs: 250,
  /** Slow systems run every N ticks. */
  slowTickEvery: 20,
} as const;
