import { HOTKEYS, type HotkeyAction, type HotkeyBinding } from './config';
import { isActivationTarget, isTypingTarget } from './platform';

/**
 * Receives canvas input in CSS pixels relative to the canvas. The camera (Step 1.3) and powers
 * (Step 1.8) implement this; until then pointer state is only tracked.
 */
export interface PointerSink {
  pointerDown?(x: number, y: number, button: number, e: PointerEvent): void;
  pointerMove?(x: number, y: number, e: PointerEvent): void;
  pointerUp?(x: number, y: number, button: number, e: PointerEvent): void;
  /** deltaY in pixels (positive = away); pinch is true for trackpad pinch / ctrl+wheel. */
  wheel?(deltaY: number, x: number, y: number, pinch: boolean): void;
  /** Two-finger touch: scale factor since the last event, midpoint, midpoint movement. */
  pinch?(scale: number, cx: number, cy: number, dx: number, dy: number): void;
}

const WHEEL_LINE_PX = 16;
const WHEEL_PAGE_PX = 400;

/**
 * Keyboard (KeyboardEvent.code, so hotkeys work on any layout), pointer with capture, a
 * non-passive wheel listener and two-finger pinch. Ignores hotkeys while typing.
 */
export class Input {
  /** Codes currently held (continuous actions such as WASD panning read this). */
  readonly held = new Set<string>();
  pointerX = 0;
  pointerY = 0;
  pointerInside = false;
  sink: PointerSink | null = null;

  private canvas: HTMLCanvasElement | null = null;
  private onAction: ((action: HotkeyAction) => void) | null = null;
  // Two tracked touch pointers for pinch (fixed slots, no allocation per event).
  private touchId0 = -1;
  private touchId1 = -1;
  private t0x = 0;
  private t0y = 0;
  private t1x = 0;
  private t1y = 0;

  attach(canvas: HTMLCanvasElement, onAction: (action: HotkeyAction) => void): void {
    this.detach();
    this.canvas = canvas;
    this.onAction = onAction;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
    canvas.addEventListener('contextmenu', this.onContextMenu);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerUp);
    canvas.addEventListener('pointerenter', this.onPointerEnter);
    canvas.addEventListener('pointerleave', this.onPointerLeave);
  }

  detach(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    const c = this.canvas;
    if (c) {
      c.removeEventListener('wheel', this.onWheel);
      c.removeEventListener('contextmenu', this.onContextMenu);
      c.removeEventListener('pointerdown', this.onPointerDown);
      c.removeEventListener('pointermove', this.onPointerMove);
      c.removeEventListener('pointerup', this.onPointerUp);
      c.removeEventListener('pointercancel', this.onPointerUp);
      c.removeEventListener('pointerenter', this.onPointerEnter);
      c.removeEventListener('pointerleave', this.onPointerLeave);
    }
    this.canvas = null;
    this.onAction = null;
    this.held.clear();
    this.touchId0 = -1;
    this.touchId1 = -1;
  }

  /** Finds the binding for a key event; Shift must match exactly, Ctrl/Alt/Meta never match. */
  static match(e: KeyboardEvent): HotkeyBinding | null {
    if (e.ctrlKey || e.altKey || e.metaKey) return null;
    for (const b of HOTKEYS) {
      if (b.code === e.code && (b.shift ?? false) === e.shiftKey) return b;
    }
    return null;
  }

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (isTypingTarget(e.target) || isActivationTarget(e.target, e.code)) return;
    this.held.add(e.code);
    const b = Input.match(e);
    if (!b) return;
    e.preventDefault();
    if (e.repeat && !b.repeat) return;
    this.onAction?.(b.action);
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    this.held.delete(e.code);
  };

  private readonly onBlur = (): void => {
    this.held.clear();
  };

  private readonly onContextMenu = (e: Event): void => {
    e.preventDefault();
  };

  private readonly onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const scale = e.deltaMode === 1 ? WHEEL_LINE_PX : e.deltaMode === 2 ? WHEEL_PAGE_PX : 1;
    this.updatePointer(e.clientX, e.clientY);
    this.sink?.wheel?.(e.deltaY * scale, this.pointerX, this.pointerY, e.ctrlKey);
  };

  private readonly onPointerEnter = (): void => {
    this.pointerInside = true;
  };

  private readonly onPointerLeave = (): void => {
    this.pointerInside = false;
  };

  private readonly onPointerDown = (e: PointerEvent): void => {
    const c = this.canvas;
    if (!c) return;
    try {
      c.setPointerCapture(e.pointerId);
    } catch {
      // Capture can fail for synthetic events; tracking still works without it.
    }
    this.updatePointer(e.clientX, e.clientY);
    if (e.pointerType === 'touch') this.touchDown(e);
    if (this.touchId1 < 0) this.sink?.pointerDown?.(this.pointerX, this.pointerY, e.button, e);
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    this.updatePointer(e.clientX, e.clientY);
    if (e.pointerType === 'touch' && this.touchId1 >= 0 && this.touchMove(e)) return;
    this.sink?.pointerMove?.(this.pointerX, this.pointerY, e);
  };

  private readonly onPointerUp = (e: PointerEvent): void => {
    const c = this.canvas;
    if (c && c.hasPointerCapture(e.pointerId)) c.releasePointerCapture(e.pointerId);
    this.updatePointer(e.clientX, e.clientY);
    const wasPinching = this.touchId1 >= 0;
    if (e.pointerType === 'touch') this.touchUp(e.pointerId);
    if (!wasPinching) this.sink?.pointerUp?.(this.pointerX, this.pointerY, e.button, e);
  };

  private updatePointer(clientX: number, clientY: number): void {
    const c = this.canvas;
    if (!c) return;
    const r = c.getBoundingClientRect();
    this.pointerX = clientX - r.left;
    this.pointerY = clientY - r.top;
  }

  private touchDown(e: PointerEvent): void {
    if (this.touchId0 < 0) {
      this.touchId0 = e.pointerId;
      this.t0x = this.pointerX;
      this.t0y = this.pointerY;
    } else if (this.touchId1 < 0 && e.pointerId !== this.touchId0) {
      this.touchId1 = e.pointerId;
      this.t1x = this.pointerX;
      this.t1y = this.pointerY;
    }
  }

  /** Pinch zoom + two-finger pan from the two tracked touches. Returns true when consumed. */
  private touchMove(e: PointerEvent): boolean {
    const is0 = e.pointerId === this.touchId0;
    const is1 = e.pointerId === this.touchId1;
    if (!is0 && !is1) return false;
    const oldDist = Math.hypot(this.t1x - this.t0x, this.t1y - this.t0y);
    const oldCx = (this.t0x + this.t1x) * 0.5;
    const oldCy = (this.t0y + this.t1y) * 0.5;
    if (is0) {
      this.t0x = this.pointerX;
      this.t0y = this.pointerY;
    } else {
      this.t1x = this.pointerX;
      this.t1y = this.pointerY;
    }
    const dist = Math.hypot(this.t1x - this.t0x, this.t1y - this.t0y);
    const cx = (this.t0x + this.t1x) * 0.5;
    const cy = (this.t0y + this.t1y) * 0.5;
    if (oldDist > 0) this.sink?.pinch?.(dist / oldDist, cx, cy, cx - oldCx, cy - oldCy);
    return true;
  }

  private touchUp(id: number): void {
    if (id === this.touchId1) {
      this.touchId1 = -1;
    } else if (id === this.touchId0) {
      this.touchId0 = this.touchId1;
      this.t0x = this.t1x;
      this.t0y = this.t1y;
      this.touchId1 = -1;
    }
  }
}
