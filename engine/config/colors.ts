/** Base colors (the middle step of every ramp, section 4.2) plus UI/icon ramps. */
export const BASE_COLORS = {
  deepOcean: '#173a5e',
  ocean: '#1f4e79',
  shallow: '#3b8fb8',
  foam: '#cfe9f2',
  beach: '#e3cf9a',
  desert: '#dcb96a',
  savanna: '#b5b04f',
  grassland: '#6fae4a',
  forestFloor: '#3f7d3a',
  jungle: '#2a6a3c',
  swamp: '#4a6b45',
  taiga: '#3d6b52',
  tundra: '#9aa98a',
  snow: '#eef3f7',
  hills: '#8a9a5b',
  rock: '#7a7470',
  peaks: '#a8a29c',
  soil: '#8b6a43',
  ash: '#3a3433',
  lava: '#ff6a1a',
  ember: '#ffb347',
  bark: '#6e4b32',
  wool: '#efe9dc',
  furBrown: '#8a5a3a',
  furGrey: '#7d808c',
  // UI and icon ramps (same ramp rules, used by the icon set).
  gold: '#f2c14e',
  danger: '#e5534b',
  success: '#5fc77a',
  info: '#58a6ff',
  parchment: '#d8d2c4',
} as const;

export type RampId = keyof typeof BASE_COLORS;

/** Darkest ink and brightest highlight: nothing in the game is pure black or white. */
export const INK = '#141220';
export const HIGHLIGHT = '#fff6e0';
/** Shadow ellipse color (drawn at SHADOW_ALPHA). */
export const SHADOW = '#0b0a14';
export const SHADOW_ALPHA = 0.28;

/** OKLCH ramp construction (section 4.2). */
export const RAMP_RULES = {
  steps: 5,
  lightnessStep: 0.075,
  chromaFalloff: 0.12,
  coolHue: 265,
  warmHue: 85,
  shadowHueShiftDeg: 7,
  highlightHueShiftDeg: 5,
} as const;

/** The 6-step water depth ramp (shallow → deep ocean) is interpolated through these stops. */
export const DEPTH_RAMP = {
  steps: 6,
  stops: ['shallow', 'ocean', 'deepOcean'] as const,
} as const;
