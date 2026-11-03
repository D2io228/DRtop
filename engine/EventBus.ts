import { ROBUSTNESS } from './config';

/** 0 = trace, 1 = minor, 2 = notable, 3 = major. The Phase 4 Chronicle filters by this. */
export type Importance = 0 | 1 | 2 | 3;

/**
 * Event payloads by type. Every payload is a flat record of numbers and strings so events can be
 * stored, saved and turned into Chronicle sentences. Later steps add their event types here.
 */
export interface EventDataMap {
  seasonChanged: { year: number; season: number };
  yearChanged: { year: number };
  systemSuspended: { system: string; message: string };
  layerSuspended: { layer: string; message: string };
  seedChanged: { seed: number; text: string };
}

export type EventType = keyof EventDataMap;

export interface GameEvent<K extends EventType = EventType> {
  readonly type: K;
  readonly tick: number;
  readonly importance: Importance;
  readonly x?: number;
  readonly y?: number;
  readonly data: EventDataMap[K];
}

type AnyListener = (e: GameEvent) => void;

/**
 * Typed event bus. emit() queues; flush() (end of each tick, or end of frame while paused)
 * delivers to listeners and appends to a fixed-size history ring. High-volume facts (births,
 * deaths) use count() instead of events.
 */
export class EventBus {
  private pending: GameEvent[] = [];
  private delivering: GameEvent[] = [];
  private readonly history: Array<GameEvent | null>;
  private historyHead = 0;
  private readonly byType = new Map<EventType, Set<AnyListener>>();
  private readonly any = new Set<AnyListener>();
  private readonly counters = new Map<string, number>();
  private emitted = 0;

  constructor(historySize: number = ROBUSTNESS.eventHistory) {
    this.history = new Array<GameEvent | null>(historySize).fill(null);
  }

  get totalEmitted(): number {
    return this.emitted;
  }

  get hasPending(): boolean {
    return this.pending.length > 0;
  }

  emit<K extends EventType>(type: K, tick: number, importance: Importance, data: EventDataMap[K], x?: number, y?: number): void {
    const e: GameEvent<K> = x === undefined || y === undefined ? { type, tick, importance, data } : { type, tick, importance, data, x, y };
    this.pending.push(e as unknown as GameEvent);
    this.emitted++;
  }

  /** Delivers queued events. Listener errors are reported but never stop delivery. */
  flush(onError: (err: unknown) => void): void {
    if (this.pending.length === 0) return;
    const batch = this.pending;
    this.pending = this.delivering;
    this.delivering = batch;
    for (let i = 0; i < batch.length; i++) {
      const e = batch[i];
      this.history[this.historyHead] = e;
      this.historyHead = (this.historyHead + 1) % this.history.length;
      const set = this.byType.get(e.type);
      if (set) {
        for (const l of set) {
          try {
            l(e);
          } catch (err) {
            onError(err);
          }
        }
      }
      for (const l of this.any) {
        try {
          l(e);
        } catch (err) {
          onError(err);
        }
      }
    }
    batch.length = 0;
  }

  on<K extends EventType>(type: K, listener: (e: GameEvent<K>) => void): () => void {
    let set = this.byType.get(type);
    if (!set) {
      set = new Set();
      this.byType.set(type, set);
    }
    const l = listener as unknown as AnyListener;
    set.add(l);
    return () => {
      set.delete(l);
    };
  }

  onAny(listener: AnyListener): () => void {
    this.any.add(listener);
    return () => {
      this.any.delete(listener);
    };
  }

  /** Increments a named counter (births, deaths, …). */
  count(key: string, n = 1): void {
    this.counters.set(key, (this.counters.get(key) ?? 0) + n);
  }

  counter(key: string): number {
    return this.counters.get(key) ?? 0;
  }

  /** The most recent n delivered events, oldest first (console and Chronicle use). */
  recent(n: number): GameEvent[] {
    const out: GameEvent[] = [];
    const size = this.history.length;
    const take = Math.min(n, size);
    for (let i = take; i >= 1; i--) {
      const e = this.history[(this.historyHead - i + size) % size];
      if (e) out.push(e);
    }
    return out;
  }

  /** Drops queued events, history and counters (new world). */
  reset(): void {
    this.pending.length = 0;
    this.history.fill(null);
    this.historyHead = 0;
    this.counters.clear();
    this.emitted = 0;
  }
}
