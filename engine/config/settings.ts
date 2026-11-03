/** Persisted settings (localStorage, guarded). Options are added here as their features land. */
export interface SettingsValues {
  reduceMotion: boolean;
  perfOverlay: boolean;
}

export const SETTINGS = {
  storageKey: 'demiurge.settings.v1',
  defaults: {
    reduceMotion: false,
    perfOverlay: false,
  } satisfies SettingsValues,
} as const;
