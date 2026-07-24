/** Shared clipboard helpers for GeoSpy copy/share controls. */

/** Write text to the clipboard; returns false when the API is unavailable or rejects. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    const write = navigator.clipboard?.writeText;
    if (typeof write !== 'function') return false;
    await write.call(navigator.clipboard, text);
    return true;
  } catch {
    return false;
  }
}

/** Temporarily replace a control's label after a clipboard attempt. */
export function flashClipboardFeedback(
  el: HTMLElement,
  ok: boolean,
  idleLabel: string,
  ms = 1200,
): void {
  el.textContent = ok ? 'Copied' : (navigator.clipboard?.writeText ? 'Copy failed' : 'Copy unavailable');
  window.setTimeout(() => {
    if (el.isConnected) el.textContent = idleLabel;
  }, ms);
}
