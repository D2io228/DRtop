import { UI } from './config';

/** Browser APIs that may be blocked inside sandboxed iframes, each with a safe fallback. */

export function storageLoad(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function storageSave(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Clipboard API first; a hidden-textarea + execCommand fallback for iframes without permission. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied inside the preview iframe: fall through to the legacy path.
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

/** Resolves when the pixel font is ready (or after a timeout), before any text is baked. */
export function waitForFonts(): Promise<void> {
  const fonts = document.fonts;
  if (!fonts) return Promise.resolve();
  const loaded = fonts
    .load(`16px "${UI.fonts.family}"`)
    .then(() => fonts.ready)
    .then(() => undefined)
    .catch(() => undefined);
  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, UI.fonts.waitTimeoutMs);
  });
  return Promise.race([loaded, timeout]);
}

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** True when keyboard input should go to a text field instead of game hotkeys. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag !== 'INPUT') return false;
  const type = (target as HTMLInputElement).type;
  return type !== 'checkbox' && type !== 'radio' && type !== 'button' && type !== 'range';
}

/** Space/Enter on a focused button activate that button rather than global hotkeys. */
export function isActivationTarget(target: EventTarget | null, code: string): boolean {
  if (code !== 'Space' && code !== 'Enter' && code !== 'NumpadEnter') return false;
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === 'BUTTON' || target.getAttribute('role') === 'switch' || target.tagName === 'A';
}
