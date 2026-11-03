/** Error isolation thresholds. */
export const ROBUSTNESS = {
  /** A system or render layer that throws this many times in a row is suspended. */
  maxConsecutiveFailures: 3,
  /** Distinct error entries kept in the Dev Console. */
  maxErrorEntries: 100,
  /** Events kept in the EventBus history ring. */
  eventHistory: 512,
} as const;
