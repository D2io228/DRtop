import { bakeFrame, upscale } from '../AsciiSprite';
import type { Palette } from '../Palette';
import { ICON_ART, type IconId } from './iconArt';

const ICON_SIZE = 16;
/** Baked scales: 1× for small inline glyphs, 2× and 3× per section 4.8. */
const SCALES = [3, 2, 1] as const;

/**
 * Icons baked once from ASCII art into cached data URLs (section 4.8), shown with
 * image-rendering: pixelated. url() picks the bake whose pixels land on whole device pixels.
 */
export class IconSet {
  private readonly urls = new Map<IconId, readonly string[]>();

  constructor(palette: Palette) {
    for (const id of Object.keys(ICON_ART) as IconId[]) {
      const base = bakeFrame(ICON_ART[id], palette, { outline: true, pad: 0 });
      const byScale: string[] = [];
      byScale[1] = base.toDataURL('image/png');
      byScale[2] = upscale(base, 2).toDataURL('image/png');
      byScale[3] = upscale(base, 3).toDataURL('image/png');
      this.urls.set(id, byScale);
    }
  }

  /** cssScale: CSS pixels per art pixel (1 or 2); dpr: window.devicePixelRatio. */
  url(id: IconId, cssScale: number, dpr: number): string {
    const list = this.urls.get(id);
    if (!list) return '';
    const devicePx = ICON_SIZE * cssScale * dpr;
    // Largest bake that divides the displayed size exactly (nearest-neighbor stays uniform).
    for (const s of SCALES) {
      const k = devicePx / (ICON_SIZE * s);
      if (k >= 1 && Math.abs(k - Math.round(k)) < 0.01) return list[s];
    }
    return list[cssScale * dpr >= 2.5 ? 3 : cssScale * dpr >= 1.5 ? 2 : 1];
  }
}
