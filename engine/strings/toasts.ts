/** Toast notifications. Keys ending in "Many" are used when similar toasts merge ({n} = count). */
export const TOAST_STRINGS = {
  'toast.dismiss': 'Dismiss',
  'toast.goTo': 'Go to',
  'toast.regionLabel': 'Notifications',
  'toast.seedCopied': 'Seed {seed} copied to the clipboard.',
  'toast.copyFailed': 'Copying is blocked here. Select the text and copy it manually.',
  'toast.errorCopied': 'Error report copied to the clipboard.',
  'toast.fullscreenFallback': 'Fullscreen is blocked in this frame, so DEMIURGE is maximized inside the page instead. Open the app in its own tab for true fullscreen; Esc exits.',
  'toast.systemSuspended': 'The “{system}” system stopped after {n} errors in a row. The game keeps running; details are in the Dev Console (`).',
  'toast.systemSuspendedMany': '{n} systems stopped after repeated errors. Details are in the Dev Console (`).',
  'toast.layerSuspended': 'The “{layer}” render layer stopped after {n} errors in a row. The rest of the picture keeps drawing.',
  'toast.layerSuspendedMany': '{n} render layers stopped after repeated errors. Details are in the Dev Console (`).',
} as const;
