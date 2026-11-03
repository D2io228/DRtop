/** Labels for hotkeys (Controls overlay, tooltips) and keycap glyphs for KeyboardEvent.code values. */
export const HOTKEY_STRINGS = {
  'hotkey.togglePause': 'Pause / resume',
  'hotkey.speed1': 'Speed 1×',
  'hotkey.speed2': 'Speed 2×',
  'hotkey.speed3': 'Speed 5×',
  'hotkey.speed4': 'Speed 10×',
  'hotkey.speed5': 'Speed 25×',
  'hotkey.escape': 'Cancel / close',
  'hotkey.togglePerf': 'Performance overlay',
  'hotkey.toggleConsole': 'Dev Console',
  'hotkey.group.time': 'Time',
  'hotkey.group.interface': 'Interface',
  'hotkey.group.developer': 'Developer',
} as const;

/** Keycap text for codes whose label is not derivable from the code itself. */
export const KEYCAP_LABELS: Readonly<Record<string, string>> = {
  Space: 'Space',
  Escape: 'Esc',
  Backquote: '`',
  Backslash: '\\',
  BracketLeft: '[',
  BracketRight: ']',
  Slash: '/',
  Equal: '=',
  Minus: '−',
  Delete: 'Del',
  Backspace: 'Bksp',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Home: 'Home',
  Enter: 'Enter',
  Tab: 'Tab',
};
