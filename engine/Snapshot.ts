import type { SeedInfo } from './Rng';
import type { Season } from './time';

/**
 * The compact UI snapshot (rule 3), published ≈5×/s and immediately after commands that change
 * what it shows. Panels subscribe to slices with useSlice(); later steps add slices (world,
 * population, selection, powers) without touching existing ones.
 */
export interface TimeSlice {
  readonly tick: number;
  readonly year: number;
  readonly season: Season;
  readonly speedIndex: number;
  readonly resumeSpeedIndex: number;
  readonly effectiveSpeed: number;
  readonly dropping: boolean;
}

export interface PerfSlice {
  readonly fpsAvg: number;
  readonly fpsLow: number;
  readonly frameMs: number;
  readonly simMs: number;
  readonly renderMs: number;
  readonly bakeMs: number;
  readonly ticksPerFrame: number;
  readonly quality: number;
  readonly systemsActive: number;
  readonly systemsSuspended: number;
  /** Changes whenever the frame-time history changed (sparkline redraw trigger). */
  readonly historyRev: number;
}

export interface UiSnapshot {
  readonly rev: number;
  readonly time: TimeSlice;
  readonly perf: PerfSlice;
  readonly seed: SeedInfo;
  readonly errorCount: number;
}
