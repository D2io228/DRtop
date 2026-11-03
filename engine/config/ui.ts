/** UI timing and layout constants shared by the engine and React panels. */
export const UI = {
  /** UI snapshot publications per second. */
  snapshotHz: 5,
  toast: {
    max: 4,
    durationMs: 6000,
    /** Exit animation length; must match the CSS transition. */
    exitMs: 220,
  },
  tooltip: {
    delayMs: 350,
    gapPx: 8,
    marginPx: 8,
  },
  console: {
    maxLines: 600,
    historyMax: 60,
    defaultEventCount: 15,
    maxEventCount: 200,
  },
  /** Icon scale used by top-bar and panel buttons (16×16 art at 2×). */
  iconScale: 2,
  fonts: {
    family: 'Pixelify Sans',
    waitTimeoutMs: 2500,
  },
} as const;
