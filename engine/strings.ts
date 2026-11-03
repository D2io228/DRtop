import { UI_STRINGS } from './strings/ui';
import { TIME_STRINGS } from './strings/time';
import { TOAST_STRINGS } from './strings/toasts';
import { CONSOLE_STRINGS } from './strings/console';
import { HOTKEY_STRINGS, KEYCAP_LABELS } from './strings/hotkeys';

/** All player-facing text (rule 13). Domains live in strings/*.ts. */
export const STRINGS = {
  ...UI_STRINGS,
  ...TIME_STRINGS,
  ...TOAST_STRINGS,
  ...CONSOLE_STRINGS,
  ...HOTKEY_STRINGS,
} as const;

export type StrKey = keyof typeof STRINGS;
export type StrParams = Readonly<Record<string, string | number>>;

const PARAM_RE = /\{(\w+)\}/g;

/** Look up a string and substitute {name} parameters. */
export function t(key: StrKey, params?: StrParams): string {
  const text: string = STRINGS[key];
  if (!params) return text;
  return text.replace(PARAM_RE, (match: string, name: string) => {
    const v = params[name];
    return v === undefined ? match : String(v);
  });
}

/** Keycap label for a KeyboardEvent.code ("Digit1" → "1", "KeyQ" → "Q", "Backquote" → "`"). */
export function keycap(code: string, shift = false): string {
  if (shift && code === 'Slash') return '?';
  const base = KEYCAP_LABELS[code] ?? code.replace(/^Key/, '').replace(/^Digit/, '');
  return shift ? `Shift+${base}` : base;
}

/** Formats a number with a fixed number of decimals for UI readouts. */
export function fmt(n: number, decimals = 0): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : '—';
}
