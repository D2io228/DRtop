import type { FullscreenMode } from './UiState';

interface LegacyFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

interface LegacyFullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenEnabled?: boolean;
}

/**
 * Fullscreen API on the app root. When the browser refuses (sandboxed iframes such as the
 * AI Studio preview), falls back to an in-page maximized mode and asks the host to explain.
 */
export class FullscreenController {
  private root: HTMLElement | null = null;
  private maximized = false;

  constructor(
    private readonly onModeChange: (mode: FullscreenMode) => void,
    private readonly onFallback: () => void,
  ) {}

  attach(root: HTMLElement): void {
    this.root = root;
    document.addEventListener('fullscreenchange', this.sync);
    document.addEventListener('webkitfullscreenchange', this.sync);
    this.sync();
  }

  detach(): void {
    document.removeEventListener('fullscreenchange', this.sync);
    document.removeEventListener('webkitfullscreenchange', this.sync);
    this.root = null;
  }

  get mode(): FullscreenMode {
    if (this.fullscreenElement() !== null && this.fullscreenElement() === this.root) return 'fullscreen';
    return this.maximized ? 'maximized' : 'none';
  }

  async toggle(): Promise<void> {
    const mode = this.mode;
    if (mode === 'fullscreen') {
      await this.exitNative();
      return;
    }
    if (mode === 'maximized') {
      this.setMaximized(false);
      return;
    }
    if (await this.requestNative()) return;
    this.setMaximized(true);
    this.onFallback();
  }

  /** Leaves the in-page maximized mode (Esc). Returns true if it was active. */
  exitMaximized(): boolean {
    if (!this.maximized) return false;
    this.setMaximized(false);
    return true;
  }

  private setMaximized(on: boolean): void {
    this.maximized = on;
    this.onModeChange(this.mode);
  }

  private readonly sync = (): void => {
    this.onModeChange(this.mode);
  };

  private fullscreenElement(): Element | null {
    const d = document as LegacyFullscreenDocument;
    return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
  }

  private async requestNative(): Promise<boolean> {
    const root = this.root as LegacyFullscreenElement | null;
    const d = document as LegacyFullscreenDocument;
    if (!root) return false;
    const enabled = d.fullscreenEnabled ?? d.webkitFullscreenEnabled ?? false;
    if (!enabled) return false;
    try {
      if (typeof root.requestFullscreen === 'function') await root.requestFullscreen();
      else if (root.webkitRequestFullscreen) await root.webkitRequestFullscreen();
      else return false;
      return this.fullscreenElement() === root;
    } catch {
      return false;
    }
  }

  private async exitNative(): Promise<void> {
    const d = document as LegacyFullscreenDocument;
    try {
      if (typeof d.exitFullscreen === 'function') await d.exitFullscreen();
      else if (d.webkitExitFullscreen) await d.webkitExitFullscreen();
    } catch {
      // Already left fullscreen (e.g. the user pressed Esc); sync() reports the real mode.
    }
    this.sync();
  }
}
