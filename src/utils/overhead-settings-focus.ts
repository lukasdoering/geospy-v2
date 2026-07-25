/**
 * After Settings opens (possibly via lazy chunk), open the Satellites
 * details group and focus the overhead elevation control.
 * Retries briefly so cold-open races do not no-op.
 */
export function focusOverheadPassSettingsControl(opts?: {
  /** Max wait for the control to appear after Settings open. */
  timeoutMs?: number;
}): void {
  const timeoutMs = opts?.timeoutMs ?? 2500;

  const focusElevation = (): boolean => {
    const elev = document.getElementById('us-overhead-elevation');
    if (!elev) return false;
    const group = elev.closest('details');
    if (group instanceof HTMLDetailsElement) group.open = true;
    elev.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    try {
      (elev as HTMLSelectElement).focus();
    } catch {
      /* ignore */
    }
    return true;
  };

  if (focusElevation()) return;
  const deadline = Date.now() + timeoutMs;
  const tick = (): void => {
    if (focusElevation()) return;
    if (Date.now() < deadline) window.setTimeout(tick, 50);
  };
  window.setTimeout(tick, 50);
}

/** Open Settings (awaiting lazy load) then focus Satellites overhead prefs. */
export function openOverheadPassSettings(
  openSettings: ((tab?: 'settings') => void | Promise<void>) | null | undefined,
): void {
  const scheduleFocus = (): void => focusOverheadPassSettingsControl();
  const opened = openSettings?.('settings');
  if (opened && typeof (opened as Promise<void>).then === 'function') {
    void (opened as Promise<void>).then(scheduleFocus, scheduleFocus);
  } else {
    scheduleFocus();
  }
}
