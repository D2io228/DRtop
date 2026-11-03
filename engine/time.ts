import { TIME } from './config';

/** Calendar math. Config is written in seconds and years; systems convert with these helpers. */
export const TICKS_PER_SECOND = TIME.ticksPerSecond;
export const TICK_MS = 1000 / TIME.ticksPerSecond;
export const TICKS_PER_YEAR = TIME.ticksPerSecond * TIME.yearSeconds;
export const TICKS_PER_SEASON = TICKS_PER_YEAR / TIME.seasonsPerYear;

export const Season = { Spring: 0, Summer: 1, Autumn: 2, Winter: 3 } as const;
export type Season = (typeof Season)[keyof typeof Season];

/** Seconds at 1× → ticks (at least 1). */
export function secondsToTicks(seconds: number): number {
  return Math.max(1, Math.round(seconds * TICKS_PER_SECOND));
}

/** In-game years → ticks. */
export function yearsToTicks(years: number): number {
  return Math.round(years * TICKS_PER_YEAR);
}

export function ticksToYears(ticks: number): number {
  return ticks / TICKS_PER_YEAR;
}

/** Year 1 starts at tick 0. */
export function yearOf(tick: number): number {
  return Math.floor(tick / TICKS_PER_YEAR) + 1;
}

/** Year 1 starts in spring. */
export function seasonOf(tick: number): Season {
  return Math.floor((tick % TICKS_PER_YEAR) / TICKS_PER_SEASON) as Season;
}

/** Fraction of the current season elapsed, 0..1. */
export function seasonProgress(tick: number): number {
  return (tick % TICKS_PER_SEASON) / TICKS_PER_SEASON;
}

export function speedOf(index: number): number {
  return TIME.speeds[index] ?? 0;
}
