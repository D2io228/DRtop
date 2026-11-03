/** Frame budgets, loop limits and adaptive-quality thresholds. */
export const PERF = {
  budget: {
    frameMs: 1000 / 60,
    simMs: 7,
    renderMs: 6,
    bakeMs: 3,
  },
  /** Hard cap of simulation ticks in one frame (protects against spirals). */
  maxTicksPerFrame: 40,
  /** Window for the effective-speed measurement (ms). */
  effectiveSpeedWindowMs: 1000,
  /** Frame-time history for the sparkline and 1% low (frames). */
  historyFrames: 240,
  /** Frames used for the FPS average. */
  fpsAverageFrames: 120,
  /** EMA factor for per-frame timings shown in the overlay. */
  timingEma: 0.1,
  adaptive: {
    /** Level 0 = full quality. Higher levels reduce particles and decorative animation. */
    levels: 3,
    /** Smoothing of the work-time signal (EMA factor per frame). */
    workEma: 0.08,
    /** Step down after being over budget this long (ms). */
    overBudgetMs: 3000,
    /** Step up after this much headroom (ms)... */
    headroomMs: 5000,
    /** ...where headroom means work below this share of the frame budget. */
    headroomRatio: 0.6,
    /** Particle spawn multiplier per level. */
    particleScale: [1, 0.6, 0.35] as const,
    /** Decorative animation multiplier per level (sway, glints, ambient motion). */
    decorScale: [1, 0.6, 0.3] as const,
  },
} as const;
