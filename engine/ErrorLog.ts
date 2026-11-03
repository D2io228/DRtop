import { ROBUSTNESS } from './config';
import { Store } from './Store';

export interface ErrorEntry {
  readonly id: number;
  /** "system:calendar", "layer:backdrop", "ui:console", "window", … */
  readonly source: string;
  readonly message: string;
  readonly stack: string;
  readonly count: number;
  readonly tick: number;
  readonly firstAt: number;
  readonly lastAt: number;
}

/** Converts anything thrown into a message and a stack trace. */
export function describeError(err: unknown): { message: string; stack: string } {
  if (err instanceof Error) return { message: err.message || err.name, stack: err.stack ?? '' };
  if (typeof err === 'string') return { message: err, stack: '' };
  try {
    return { message: JSON.stringify(err), stack: '' };
  } catch {
    return { message: String(err), stack: '' };
  }
}

/**
 * Collects every caught error for the Dev Console. Identical errors (same source and message)
 * merge into one entry with a count, so a failing loop cannot flood the list.
 */
export class ErrorLog {
  readonly store = new Store<readonly ErrorEntry[]>([]);
  private nextId = 1;
  private total = 0;

  get totalReported(): number {
    return this.total;
  }

  report(source: string, err: unknown, tick: number, extraStack?: string): ErrorEntry {
    const { message, stack } = describeError(err);
    const fullStack = extraStack ? `${stack}\n${extraStack}`.trim() : stack;
    const now = Date.now();
    const list = this.store.get();
    this.total++;
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (e.source === source && e.message === message) {
        const updated: ErrorEntry = { ...e, count: e.count + 1, lastAt: now, tick, stack: fullStack || e.stack };
        const next = list.slice();
        next.splice(i, 1);
        next.push(updated);
        this.store.set(next);
        return updated;
      }
    }
    const entry: ErrorEntry = { id: this.nextId++, source, message, stack: fullStack, count: 1, tick, firstAt: now, lastAt: now };
    const next = list.length >= ROBUSTNESS.maxErrorEntries ? list.slice(1) : list.slice();
    next.push(entry);
    this.store.set(next);
    return entry;
  }

  clear(): void {
    this.store.set([]);
  }
}
