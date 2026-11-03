import type { StrKey } from '../strings';

/** Engine actions reachable from the keyboard. Later steps append actions here. */
export type HotkeyAction =
  | 'togglePause'
  | 'speed1'
  | 'speed2'
  | 'speed3'
  | 'speed4'
  | 'speed5'
  | 'togglePerf'
  | 'toggleConsole'
  | 'escape';

export type HotkeyGroup = 'time' | 'interface' | 'developer';

export interface HotkeyBinding {
  readonly action: HotkeyAction;
  /** KeyboardEvent.code — layout-independent (works on Russian and other layouts). */
  readonly code: string;
  readonly shift?: boolean;
  readonly group: HotkeyGroup;
  readonly labelKey: StrKey;
  /** Fire on auto-repeat while held. */
  readonly repeat?: boolean;
}

/** The single source of truth for keyboard shortcuts; tooltips and keycaps read from it. */
export const HOTKEYS: readonly HotkeyBinding[] = [
  { action: 'togglePause', code: 'Space', group: 'time', labelKey: 'hotkey.togglePause' },
  { action: 'speed1', code: 'Digit1', group: 'time', labelKey: 'hotkey.speed1' },
  { action: 'speed2', code: 'Digit2', group: 'time', labelKey: 'hotkey.speed2' },
  { action: 'speed3', code: 'Digit3', group: 'time', labelKey: 'hotkey.speed3' },
  { action: 'speed4', code: 'Digit4', group: 'time', labelKey: 'hotkey.speed4' },
  { action: 'speed5', code: 'Digit5', group: 'time', labelKey: 'hotkey.speed5' },
  { action: 'escape', code: 'Escape', group: 'interface', labelKey: 'hotkey.escape' },
  { action: 'togglePerf', code: 'F3', group: 'developer', labelKey: 'hotkey.togglePerf' },
  { action: 'toggleConsole', code: 'Backquote', group: 'developer', labelKey: 'hotkey.toggleConsole' },
];

/** Speed index selected by each speed hotkey. */
export const SPEED_HOTKEY_INDEX: Readonly<Record<'speed1' | 'speed2' | 'speed3' | 'speed4' | 'speed5', number>> = {
  speed1: 1,
  speed2: 2,
  speed3: 3,
  speed4: 4,
  speed5: 5,
};

export function bindingFor(action: HotkeyAction): HotkeyBinding | undefined {
  for (const b of HOTKEYS) if (b.action === action) return b;
  return undefined;
}
