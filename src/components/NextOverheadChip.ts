/**
 * Persistent GeoSpy chip: next overhead pass at the last predicted location.
 * Keeps the SGP4 differentiator visible after tip/flat-hint are dismissed.
 */

import { formatEta } from '@/components/OrbitalPassesPopup';
import { getOverheadPassSettings } from '@/services/overhead-pass-settings';
import type { OverheadPass } from '@/services/satellites';

const CHIP_ID = 'geospy-next-overhead-chip';
const DISMISS_KEY = 'geospy-next-overhead-chip-dismissed';
const LAST_LOC_KEY = 'geospy-overhead-last-location';

export interface NextOverheadChipHost {
  isDestroyed?: boolean;
  predictOverheadPasses?: (lat: number, lon: number, screenX: number, screenY: number) => void | Promise<void>;
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return true;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(DISMISS_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function readLastOverheadLocation(): { lat: number; lon: number } | null {
  try {
    const raw = localStorage.getItem(LAST_LOC_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { lat?: unknown; lon?: unknown };
    if (typeof parsed.lat === 'number' && typeof parsed.lon === 'number') {
      return { lat: parsed.lat, lon: parsed.lon };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function buildNextOverheadChipLabel(pass: OverheadPass, nowMs = Date.now()): string {
  const type = (pass.type || 'sat').toUpperCase();
  return `Next ${type}: ${pass.name} ${formatEta(pass.aosMs, nowMs)}`;
}

export function removeNextOverheadChip(): void {
  document.getElementById(CHIP_ID)?.remove();
}

/** Refresh the chip from last location + a fresh short prediction. */
export async function syncNextOverheadChip(host: NextOverheadChipHost): Promise<void> {
  if (host.isDestroyed || isDismissed()) {
    removeNextOverheadChip();
    return;
  }
  // Don't stack on top of the full popup.
  if (document.querySelector('[data-testid="orbital-passes-popup"]')) {
    removeNextOverheadChip();
    return;
  }

  const loc = readLastOverheadLocation();
  if (!loc) {
    removeNextOverheadChip();
    return;
  }

  try {
    const { predictOverheadPassesAt } = await import('@/services/satellites');
    const prefs = getOverheadPassSettings();
    const passes = await predictOverheadPassesAt(loc.lat, loc.lon, {
      windowMinutes: prefs.windowMinutes,
      stepSeconds: 60,
      minElevationDeg: prefs.minElevationDeg,
      limit: 3,
    });
    if (host.isDestroyed || isDismissed()) return;
    if (!passes.length) {
      removeNextOverheadChip();
      return;
    }
    const next = passes[0]!;
    const nowMs = Date.now();
    renderChip(host, loc, next, nowMs);
  } catch {
    // Catalog failures should not leave a broken chip.
    removeNextOverheadChip();
  }
}

function renderChip(
  host: NextOverheadChipHost,
  loc: { lat: number; lon: number },
  pass: OverheadPass,
  nowMs: number,
): void {
  let chip = document.getElementById(CHIP_ID);
  if (!chip) {
    chip = document.createElement('div');
    chip.id = CHIP_ID;
    chip.className = 'geospy-next-overhead-chip';
    chip.setAttribute('role', 'status');
    chip.setAttribute('data-testid', 'geospy-next-overhead-chip');
    document.body.appendChild(chip);
    requestAnimationFrame(() => chip?.classList.add('visible'));
  }

  chip.replaceChildren();

  const openBtn = document.createElement('button');
  openBtn.type = 'button';
  openBtn.className = 'geospy-next-overhead-chip-open';
  openBtn.setAttribute('data-testid', 'geospy-next-overhead-chip-open');
  openBtn.setAttribute(
    'aria-label',
    `Open overhead passes near ${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)}`,
  );
  openBtn.textContent = buildNextOverheadChipLabel(pass, nowMs);
  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const screenX = Math.round(window.innerWidth * 0.55);
    const screenY = Math.round(window.innerHeight * 0.35);
    void host.predictOverheadPasses?.(loc.lat, loc.lon, screenX, screenY);
    removeNextOverheadChip();
  });

  const dismissBtn = document.createElement('button');
  dismissBtn.type = 'button';
  dismissBtn.className = 'geospy-next-overhead-chip-dismiss';
  dismissBtn.setAttribute('aria-label', 'Dismiss next-pass chip');
  dismissBtn.textContent = '×';
  dismissBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    markDismissed();
    removeNextOverheadChip();
  });

  chip.append(openBtn, dismissBtn);
  chip.classList.add('visible');
}
