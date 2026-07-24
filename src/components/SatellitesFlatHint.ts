/**
 * GeoSpy coherence hint when the satellites layer is on in flat/DeckGL map mode.
 * Live orbital tracks only render on the 3D globe; overhead-pass prediction
 * still works via right-click / Cmd+K on any map mode.
 */

const TIP_DISMISS_KEY = 'geospy-satellites-flat-hint-dismissed';
const HINT_ID = 'geospy-satellites-flat-hint';

export interface SatellitesFlatHintHost {
  isGlobeMode?: () => boolean;
  switchToGlobe?: () => void;
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(TIP_DISMISS_KEY) === '1';
  } catch {
    return true;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(TIP_DISMISS_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function syncSatellitesFlatHint(
  satellitesEnabled: boolean,
  map: SatellitesFlatHintHost | null | undefined,
): void {
  const existing = document.getElementById(HINT_ID);
  const shouldShow = Boolean(satellitesEnabled && map && !map.isGlobeMode?.() && !isDismissed());

  if (!shouldShow) {
    existing?.remove();
    return;
  }
  if (existing) return;

  const hint = document.createElement('div');
  hint.id = HINT_ID;
  hint.className = 'geospy-satellites-flat-hint';
  hint.setAttribute('role', 'status');

  const text = document.createElement('span');
  text.className = 'geospy-satellites-flat-hint-text';
  text.textContent = 'Live orbits on 3D globe · Right-click any point for overhead passes';

  const switchBtn = document.createElement('button');
  switchBtn.type = 'button';
  switchBtn.className = 'geospy-satellites-flat-hint-switch';
  switchBtn.textContent = 'Switch to 3D';
  switchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    try {
      localStorage.setItem('worldmonitor-map-mode', 'globe');
    } catch {
      /* ignore */
    }
    map?.switchToGlobe?.();
    const toggle = document.getElementById('mapDimensionToggle');
    toggle?.querySelectorAll('.map-dim-btn').forEach((b) => b.classList.remove('active'));
    toggle?.querySelector('.map-dim-btn[data-mode="globe"]')?.classList.add('active');
    hint.remove();
  });

  const dismissBtn = document.createElement('button');
  dismissBtn.type = 'button';
  dismissBtn.className = 'geospy-satellites-flat-hint-dismiss';
  dismissBtn.setAttribute('aria-label', 'Dismiss');
  dismissBtn.textContent = '×';
  dismissBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    markDismissed();
    hint.remove();
  });

  hint.append(text, switchBtn, dismissBtn);
  const mapSection = document.getElementById('mapSection') || document.body;
  mapSection.appendChild(hint);
}

export function removeSatellitesFlatHint(): void {
  document.getElementById(HINT_ID)?.remove();
}
