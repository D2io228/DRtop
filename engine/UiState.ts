import { Store } from './Store';

export type FullscreenMode = 'none' | 'fullscreen' | 'maximized';

/** Which panels are open. Lives in the engine so hotkeys and buttons drive the same state. */
export interface UiState {
  readonly consoleOpen: boolean;
  readonly settingsOpen: boolean;
  readonly fullscreen: FullscreenMode;
  /** Set by "crashtest ui": a probe component throws to prove error-boundary isolation. */
  readonly crashUi: boolean;
}

export const INITIAL_UI_STATE: UiState = {
  consoleOpen: false,
  settingsOpen: false,
  fullscreen: 'none',
  crashUi: false,
};

export function createUiStateStore(): Store<UiState> {
  return new Store<UiState>(INITIAL_UI_STATE);
}
