import { UI } from './config';
import { Store } from './Store';
import { t, type StrKey, type StrParams } from './strings';
import type { IconId } from '../render/icons/iconArt';

export type ToastKind = 'info' | 'success' | 'warning' | 'danger';

export interface ToastInput {
  readonly kind: ToastKind;
  readonly textKey: StrKey;
  readonly params?: StrParams;
  /** Toasts with the same mergeKey combine into one ("3 meteor impacts"). */
  readonly mergeKey?: string;
  /** Text used once merged; receives {n} plus the original params. */
  readonly manyKey?: StrKey;
  readonly icon?: IconId;
  /** World tile to fly to from the "Go to" button (available once the camera exists). */
  readonly goto?: { readonly x: number; readonly y: number };
}

/** Immutable view of one toast for the UI. */
export interface ToastView {
  readonly id: number;
  readonly kind: ToastKind;
  readonly icon: IconId;
  readonly text: string;
  readonly count: number;
  readonly leaving: boolean;
  readonly goto?: { readonly x: number; readonly y: number };
}

interface ToastState {
  id: number;
  input: ToastInput;
  count: number;
  remainingMs: number;
  paused: boolean;
  leaving: boolean;
}

const KIND_ICON: Readonly<Record<ToastKind, IconId>> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

/**
 * Toast queue: max 4 visible, 6 s each, hover pauses, similar toasts merge. Lifetimes advance
 * with real frame time from the engine loop (no timers); the store changes only on transitions.
 */
export class ToastCenter {
  readonly store = new Store<readonly ToastView[]>([]);
  private items: ToastState[] = [];
  private nextId = 1;

  push(input: ToastInput): void {
    if (input.mergeKey) {
      for (const it of this.items) {
        if (!it.leaving && it.input.mergeKey === input.mergeKey) {
          it.count++;
          it.input = input;
          it.remainingMs = UI.toast.durationMs;
          this.publish();
          return;
        }
      }
    }
    this.items.push({ id: this.nextId++, input, count: 1, remainingMs: UI.toast.durationMs, paused: false, leaving: false });
    // Over capacity: the oldest visible toast starts leaving.
    let visible = 0;
    for (const it of this.items) if (!it.leaving) visible++;
    for (let i = 0; i < this.items.length && visible > UI.toast.max; i++) {
      const it = this.items[i];
      if (!it.leaving) {
        it.leaving = true;
        it.remainingMs = Math.min(it.remainingMs, UI.toast.exitMs);
        visible--;
      }
    }
    this.publish();
  }

  dismiss(id: number): void {
    for (const it of this.items) {
      if (it.id === id && !it.leaving) {
        it.leaving = true;
        it.paused = false;
        it.remainingMs = UI.toast.exitMs;
        this.publish();
        return;
      }
    }
  }

  setPaused(id: number, paused: boolean): void {
    for (const it of this.items) {
      if (it.id === id && !it.leaving) it.paused = paused;
    }
  }

  /** Advances lifetimes; called once per frame with real elapsed time. */
  update(dtMs: number): void {
    if (this.items.length === 0) return;
    let changed = false;
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      if (it.paused) continue;
      it.remainingMs -= dtMs;
      if (it.remainingMs <= 0) {
        this.items.splice(i, 1);
        changed = true;
      } else if (!it.leaving && it.remainingMs <= UI.toast.exitMs) {
        it.leaving = true;
        changed = true;
      }
    }
    if (changed) this.publish();
  }

  clear(): void {
    this.items = [];
    this.publish();
  }

  private publish(): void {
    const views: ToastView[] = [];
    for (const it of this.items) {
      const inp = it.input;
      const key = it.count > 1 && inp.manyKey ? inp.manyKey : inp.textKey;
      const params = it.count > 1 ? { ...inp.params, n: it.count } : inp.params;
      const view: ToastView = { id: it.id, kind: inp.kind, icon: inp.icon ?? KIND_ICON[inp.kind], text: t(key, params), count: it.count, leaving: it.leaving };
      views.push(inp.goto ? { ...view, goto: inp.goto } : view);
    }
    this.store.set(views);
  }
}
