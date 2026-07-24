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

export function flatHintCopy(satellitesEnabled: boolean): string {
  return satellitesEnabled
    ? 'Live orbits on 3D globe · Right-click / Cmd+Shift+O for overhead passes'
    : 'Right-click or Cmd+Shift+O for overhead passes · Switch to 3D for live orbits';
}

export function syncSatellitesFlatHint(
  satellitesEnabled: boolean,
  map: SatellitesFlatHintHost | null | undefined,
): void {
  const existing = document.getElementById(HINT_ID);
  const onFlat = Boolean(map && map.isGlobeMode && !map.isGlobeMode());
  // Show on flat map even if the satellites layer was turned off in a prior
  // session — overhead-pass prediction still works, and Switch to 3D explains
  // where live orbits appear. satellitesEnabled only tweaks the copy.
  const shouldShow = Boolean(onFlat && !isDismissed());

  if (!shouldShow) {
    existing?.remove();
    return;
  }
  if (existing) {
    const textEl = existing.querySelector('.geospy-satellites-flat-hint-text');
    if (textEl) textEl.textContent = flatHintCopy(satellitesEnabled);
    existing.classList.add('visible');
    return;
  }

  const hint = document.createElement('div');
  hint.id = HINT_ID;
  hint.className = 'geospy-satellites-flat-hint';
  hint.setAttribute('role', 'status');

  const text = document.createElement('span');
  text.className = 'geospy-satellites-flat-hint-text';
  text.textContent = flatHintCopy(satellitesEnabled);

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
  // Fixed to the viewport so map WebGL/canvas stacking cannot bury the hint.
  document.body.appendChild(hint);
  requestAnimationFrame(() => hint.classList.add('visible'));
}

export function removeSatellitesFlatHint(): void {
  document.getElementById(HINT_ID)?.remove();
}
