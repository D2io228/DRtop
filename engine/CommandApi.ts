import { SPEED_HOTKEY_INDEX, type HotkeyAction, type SettingsValues } from './config';
import type { Game } from './Game';
import { copyText } from './platform';
import { t, type StrKey } from './strings';

/**
 * The typed UI → engine command surface (rule 3). React panels and hotkeys call only these.
 * Later steps add selectPower, setMapMode, flyTo, follow, … here.
 */
export interface CommandApi {
  setSpeed(index: number): void;
  togglePause(): void;
  setConsoleOpen(open: boolean): void;
  toggleConsole(): void;
  setSettingsOpen(open: boolean): void;
  toggleSettings(): void;
  togglePerfOverlay(): void;
  setSetting<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]): void;
  toggleFullscreen(): void;
  runConsole(line: string): void;
  copySeed(): void;
  copyText(text: string, successKey: StrKey): void;
  dismissToast(id: number): void;
  pauseToast(id: number, paused: boolean): void;
  clearErrors(): void;
  resetCrashProbe(): void;
  /** Esc: closes the top-most panel, then leaves fullscreen or the maximized view. */
  escape(): void;
  hotkey(action: HotkeyAction): void;
}

export function createCommandApi(g: Game): CommandApi {
  const api: CommandApi = {
    setSpeed(index) {
      g.loop.setSpeedIndex(index);
      g.publishSnapshot();
    },
    togglePause() {
      g.loop.togglePause();
      g.publishSnapshot();
    },
    setConsoleOpen(open) {
      g.ui.patch({ consoleOpen: open });
    },
    toggleConsole() {
      api.setConsoleOpen(!g.ui.get().consoleOpen);
    },
    setSettingsOpen(open) {
      g.ui.patch({ settingsOpen: open });
    },
    toggleSettings() {
      api.setSettingsOpen(!g.ui.get().settingsOpen);
    },
    togglePerfOverlay() {
      g.settings.set('perfOverlay', !g.settings.values.perfOverlay);
    },
    setSetting(key, value) {
      g.settings.set(key, value);
    },
    toggleFullscreen() {
      void g.fullscreen.toggle();
    },
    runConsole(line) {
      g.console.exec(line);
    },
    copySeed() {
      const seed = g.seed.text;
      api.copyText(seed, 'toast.seedCopied');
    },
    copyText(text, successKey) {
      void copyText(text).then((ok) => {
        g.toasts.push(
          ok
            ? { kind: 'success', textKey: successKey, params: { seed: g.seed.text }, mergeKey: `copy:${successKey}` }
            : { kind: 'warning', textKey: 'toast.copyFailed', mergeKey: 'copy-failed' },
        );
      });
    },
    dismissToast(id) {
      g.toasts.dismiss(id);
    },
    pauseToast(id, paused) {
      g.toasts.setPaused(id, paused);
    },
    clearErrors() {
      g.errors.clear();
    },
    resetCrashProbe() {
      g.ui.patch({ crashUi: false });
    },
    escape() {
      const ui = g.ui.get();
      if (ui.consoleOpen) api.setConsoleOpen(false);
      else if (ui.settingsOpen) api.setSettingsOpen(false);
      else if (ui.fullscreen === 'fullscreen') void g.fullscreen.toggle();
      else g.fullscreen.exitMaximized();
    },
    hotkey(action) {
      switch (action) {
        case 'togglePause':
          api.togglePause();
          break;
        case 'speed1':
        case 'speed2':
        case 'speed3':
        case 'speed4':
        case 'speed5':
          api.setSpeed(SPEED_HOTKEY_INDEX[action]);
          break;
        case 'togglePerf':
          api.togglePerfOverlay();
          break;
        case 'toggleConsole':
          api.toggleConsole();
          break;
        case 'escape':
          api.escape();
          break;
      }
    },
  };
  return api;
}

/** Plain-text report for "Copy error": everything needed to reproduce. */
export function formatErrorReport(g: Game, source: string, message: string, stack: string, count: number, tick: number): string {
  const body = t('console.reportBody', {
    source,
    message,
    count,
    tick,
    seedText: g.seed.text,
    seed: g.seed.value,
    time: new Date().toISOString(),
    agent: navigator.userAgent,
  });
  return `${t('console.reportHeader')}\n${body}\n\n${stack || t('console.noStack')}`;
}
