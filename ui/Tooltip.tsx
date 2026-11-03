import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from 'react';
import { UI } from '../engine/config';

export interface TipContent {
  readonly title: string;
  readonly desc?: string;
  /** Keycap labels shown as chips ("Space", "1"). */
  readonly keys?: readonly string[];
}

interface TooltipApi {
  show(anchor: HTMLElement, content: TipContent): void;
  hide(anchor: HTMLElement | null): void;
}

interface Shown {
  readonly anchor: HTMLElement;
  readonly content: TipContent;
}

const TooltipContext = createContext<TooltipApi | null>(null);

/** One shared tooltip: appears after 350 ms, fades in over 120 ms, never covers its control. */
export function TooltipProvider({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState<Shown | null>(null);
  const timer = useRef(0);
  const api = useMemo<TooltipApi>(
    () => ({
      show(anchor, content) {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setShown({ anchor, content }), UI.tooltip.delayMs);
      },
      hide(anchor) {
        window.clearTimeout(timer.current);
        setShown((s) => (s && (anchor === null || s.anchor === anchor) ? null : s));
      },
    }),
    [],
  );
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <TooltipContext.Provider value={api}>
      {children}
      {shown && <TooltipBubble anchor={shown.anchor} content={shown.content} />}
    </TooltipContext.Provider>
  );
}

function TooltipBubble({ anchor, content }: Shown) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !anchor.isConnected) return;
    const a = anchor.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const { gapPx, marginPx } = UI.tooltip;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Prefer below the control; flip above when there is no room. Never overlap the anchor.
    let y = a.bottom + gapPx;
    if (y + b.height > vh - marginPx) y = a.top - gapPx - b.height;
    let x = a.left + a.width / 2 - b.width / 2;
    x = Math.max(marginPx, Math.min(vw - marginPx - b.width, x));
    setPos({ x: Math.round(x), y: Math.round(Math.max(marginPx, y)) });
  }, [anchor, content]);
  return (
    <div ref={ref} className={pos ? 'tooltip is-visible' : 'tooltip'} role="tooltip" style={pos ? { left: pos.x, top: pos.y } : undefined}>
      <div className="tooltip__head">
        <span className="tooltip__title">{content.title}</span>
        {content.keys?.map((k) => (
          <kbd key={k} className="keycap">
            {k}
          </kbd>
        ))}
      </div>
      {content.desc && <p className="tooltip__desc">{content.desc}</p>}
    </div>
  );
}

export interface TooltipHandlers {
  onPointerEnter(e: PointerEvent<HTMLElement>): void;
  onPointerLeave(e: PointerEvent<HTMLElement>): void;
  onPointerDown(e: PointerEvent<HTMLElement>): void;
  onFocus(e: FocusEvent<HTMLElement>): void;
  onBlur(e: FocusEvent<HTMLElement>): void;
}

/** Event handlers that attach a tooltip to any element (mouse hover and keyboard focus). */
export function useTooltip(content: TipContent | null): TooltipHandlers {
  const api = useContext(TooltipContext);
  const ref = useRef(content);
  useLayoutEffect(() => {
    ref.current = content;
  });
  const show = useCallback(
    (el: HTMLElement) => {
      if (ref.current) api?.show(el, ref.current);
    },
    [api],
  );
  return useMemo<TooltipHandlers>(
    () => ({
      onPointerEnter: (e) => {
        if (e.pointerType !== 'touch') show(e.currentTarget);
      },
      onPointerLeave: (e) => api?.hide(e.currentTarget),
      onPointerDown: (e) => api?.hide(e.currentTarget),
      onFocus: (e) => {
        if (e.currentTarget.matches(':focus-visible')) show(e.currentTarget);
      },
      onBlur: (e) => api?.hide(e.currentTarget),
    }),
    [api, show],
  );
}
