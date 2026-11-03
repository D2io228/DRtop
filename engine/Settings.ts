import { SETTINGS, type SettingsValues } from './config';
import { Store } from './Store';
import { prefersReducedMotion, storageLoad, storageSave } from './platform';

/** Player settings, persisted to localStorage (guarded; silently in-memory when blocked). */
export class SettingsStore {
  readonly store: Store<SettingsValues>;

  constructor() {
    const defaults: SettingsValues = { ...SETTINGS.defaults, reduceMotion: prefersReducedMotion() };
    this.store = new Store<SettingsValues>(merge(defaults, storageLoad(SETTINGS.storageKey)));
  }

  get values(): SettingsValues {
    return this.store.get();
  }

  set<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]): void {
    const patch: Partial<SettingsValues> = {};
    patch[key] = value;
    this.store.patch(patch);
    storageSave(SETTINGS.storageKey, this.store.get());
  }
}

/** Accepts only known keys whose stored type matches the default's type. */
function merge(defaults: SettingsValues, raw: unknown): SettingsValues {
  const out: SettingsValues = { ...defaults };
  if (typeof raw !== 'object' || raw === null) return out;
  const src = raw as Record<string, unknown>;
  const target = out as unknown as Record<string, unknown>;
  for (const key of Object.keys(defaults)) {
    const v = src[key];
    if (v !== undefined && typeof v === typeof target[key]) target[key] = v;
  }
  return out;
}
