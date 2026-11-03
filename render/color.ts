/**
 * Color math: sRGB ⇄ linear ⇄ OKLab ⇄ OKLCH (Björn Ottosson, 2020), implemented here so
 * ramps are built without any library.
 */

export interface Lab {
  L: number;
  a: number;
  b: number;
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function parseHex(hex: string): Rgb {
  const h = hex.replace('#', '');
  const v = parseInt(h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h, 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

export function toHex(c: Rgb): string {
  const v = (Math.round(c.r) << 16) | (Math.round(c.g) << 8) | Math.round(c.b);
  return `#${v.toString(16).padStart(6, '0')}`;
}

/** Packs into the little-endian ABGR layout of an ImageData Uint32Array view. */
export function packRgba(c: Rgb, alpha = 255): number {
  return ((alpha << 24) | (Math.round(c.b) << 16) | (Math.round(c.g) << 8) | Math.round(c.r)) >>> 0;
}

function toLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function fromLinear(c: number): number {
  const s = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return s * 255;
}

export function rgbToOklab(c: Rgb): Lab {
  const r = toLinear(c.r);
  const g = toLinear(c.g);
  const b = toLinear(c.b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

/** OKLab → linear sRGB (may be out of gamut). */
function oklabToLinear(lab: Lab): Rgb {
  const l = (lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b) ** 3;
  const m = (lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b) ** 3;
  const s = (lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b) ** 3;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

const GAMUT_EPS = 1e-4;

function inGamut(c: Rgb): boolean {
  return c.r >= -GAMUT_EPS && c.r <= 1 + GAMUT_EPS && c.g >= -GAMUT_EPS && c.g <= 1 + GAMUT_EPS && c.b >= -GAMUT_EPS && c.b <= 1 + GAMUT_EPS;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/**
 * OKLCH → sRGB with gamut mapping by chroma reduction (binary search keeps L and h),
 * the standard CSS Color 4 approach.
 */
export function oklchToRgb(L: number, C: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180;
  const cos = Math.cos(h);
  const sin = Math.sin(h);
  let lin = oklabToLinear({ L, a: C * cos, b: C * sin });
  if (!inGamut(lin)) {
    let lo = 0;
    let hi = C;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) * 0.5;
      if (inGamut(oklabToLinear({ L, a: mid * cos, b: mid * sin }))) lo = mid;
      else hi = mid;
    }
    lin = oklabToLinear({ L, a: lo * cos, b: lo * sin });
  }
  return { r: fromLinear(clamp01(lin.r)), g: fromLinear(clamp01(lin.g)), b: fromLinear(clamp01(lin.b)) };
}

export function oklabToRgb(lab: Lab): Rgb {
  const C = Math.hypot(lab.a, lab.b);
  const h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  return oklchToRgb(lab.L, C, h);
}

export function lchOf(c: Rgb): { L: number; C: number; h: number } {
  const lab = rgbToOklab(c);
  return { L: lab.L, C: Math.hypot(lab.a, lab.b), h: ((Math.atan2(lab.b, lab.a) * 180) / Math.PI + 360) % 360 };
}

/** Rotates hue h toward target by at most maxDeg along the shorter arc. */
export function rotateHueToward(h: number, target: number, maxDeg: number): number {
  const d = ((target - h + 540) % 360) - 180;
  if (Math.abs(d) <= maxDeg) return target;
  return (h + Math.sign(d) * maxDeg + 360) % 360;
}

/** Linear interpolation in OKLab (perceptually even blends). */
export function mixOklab(a: Rgb, b: Rgb, t: number): Rgb {
  const la = rgbToOklab(a);
  const lb = rgbToOklab(b);
  return oklabToRgb({ L: la.L + (lb.L - la.L) * t, a: la.a + (lb.a - la.a) * t, b: la.b + (lb.b - la.b) * t });
}
