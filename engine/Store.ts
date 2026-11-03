/**
 * Minimal external store for useSyncExternalStore. Values are treated as immutable:
 * set() replaces the value and notifies subscribers only when the reference changes.
 */
export class Store<T> {
  private value: T;
  private readonly listeners = new Set<() => void>();

  constructor(initial: T) {
    this.value = initial;
  }

  readonly get = (): T => this.value;

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  set(next: T): void {
    if (Object.is(next, this.value)) return;
    this.value = next;
    for (const l of this.listeners) l();
  }

  /** Shallow-merges a partial object into an object-valued store. */
  patch(partial: Partial<T>): void {
    let changed = false;
    const cur = this.value;
    for (const k in partial) {
      if (!Object.is(partial[k], cur[k])) {
        changed = true;
        break;
      }
    }
    if (changed) this.set({ ...cur, ...partial });
  }
}

/** Shallow equality for plain objects and arrays (one level deep). */
export function shallowEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  const ra = a as Record<string, unknown>;
  const rb = b as Record<string, unknown>;
  for (const k of ka) if (!Object.is(ra[k], rb[k])) return false;
  return true;
}
