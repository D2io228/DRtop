import { ROBUSTNESS } from './config';
import type { Game } from './Game';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A simulation system (section 3.2). Systems run in registration order (section 3.3). */
export interface System {
  readonly id: string;
  /** Run every N ticks (1 = every tick). */
  readonly every: number;
  /** Optional phase so slow systems with the same period don't share a tick. */
  readonly offset?: number;
  init(g: Game): void;
  tick(g: Game): void;
  onRegionEdited?(r: Rect): void;
}

export interface SystemInfo {
  readonly id: string;
  readonly every: number;
  readonly avgMs: number;
  readonly suspended: boolean;
  readonly failures: number;
}

interface Slot {
  sys: System;
  failures: number;
  suspended: boolean;
  avgMs: number;
}

const EMA = 0.05;

/**
 * Runs systems with error isolation (rule 14): each tick call is wrapped in try/catch, and a
 * system that throws ROBUSTNESS.maxConsecutiveFailures times in a row is suspended and reported.
 */
export class Scheduler {
  private slots: Slot[] = [];

  constructor(
    private readonly onError: (id: string, err: unknown) => void,
    private readonly onSuspend: (id: string, err: unknown) => void,
  ) {}

  add(sys: System, g: Game): void {
    this.remove(sys.id);
    const slot: Slot = { sys, failures: 0, suspended: false, avgMs: 0 };
    this.slots.push(slot);
    try {
      sys.init(g);
    } catch (err) {
      this.fail(slot, err);
    }
  }

  remove(id: string): void {
    this.slots = this.slots.filter((s) => s.sys.id !== id);
  }

  has(id: string): boolean {
    for (const s of this.slots) if (s.sys.id === id) return true;
    return false;
  }

  run(g: Game, tick: number): void {
    const slots = this.slots;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (s.suspended) continue;
      const every = s.sys.every;
      if (every > 1 && (tick + (s.sys.offset ?? 0)) % every !== 0) continue;
      const t0 = performance.now();
      try {
        s.sys.tick(g);
        s.failures = 0;
      } catch (err) {
        this.fail(s, err);
      }
      s.avgMs += (performance.now() - t0 - s.avgMs) * EMA;
    }
  }

  /** Tells every system that a region of the world changed (terrain edits, Step 1.8). */
  regionEdited(r: Rect): void {
    for (const s of this.slots) {
      if (s.suspended || !s.sys.onRegionEdited) continue;
      try {
        s.sys.onRegionEdited(r);
      } catch (err) {
        this.fail(s, err);
      }
    }
  }

  resume(id: string): boolean {
    for (const s of this.slots) {
      if (s.sys.id === id && s.suspended) {
        s.suspended = false;
        s.failures = 0;
        return true;
      }
    }
    return false;
  }

  list(): SystemInfo[] {
    return this.slots.map((s) => ({ id: s.sys.id, every: s.sys.every, avgMs: s.avgMs, suspended: s.suspended, failures: s.failures }));
  }

  get suspendedCount(): number {
    let n = 0;
    for (const s of this.slots) if (s.suspended) n++;
    return n;
  }

  get count(): number {
    return this.slots.length;
  }

  private fail(s: Slot, err: unknown): void {
    s.failures++;
    this.onError(s.sys.id, err);
    if (s.failures >= ROBUSTNESS.maxConsecutiveFailures && !s.suspended) {
      s.suspended = true;
      this.onSuspend(s.sys.id, err);
    }
  }
}
