export type OverheadMinElevationDeg = 10 | 20 | 30;
export type OverheadWindowMinutes = 180 | 360 | 720;

export interface OverheadPassSettings {
  minElevationDeg: OverheadMinElevationDeg;
  windowMinutes: OverheadWindowMinutes;
}

const ELEVATION_KEY = 'geospy-overhead-min-elevation';
const WINDOW_KEY = 'geospy-overhead-window-minutes';

const ELEVATIONS: OverheadMinElevationDeg[] = [10, 20, 30];
const WINDOWS: OverheadWindowMinutes[] = [180, 360, 720];

function readNumber(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function getOverheadPassSettings(): OverheadPassSettings {
  const elev = readNumber(ELEVATION_KEY);
  const win = readNumber(WINDOW_KEY);
  return {
    minElevationDeg: ELEVATIONS.includes(elev as OverheadMinElevationDeg)
      ? (elev as OverheadMinElevationDeg)
      : 20,
    windowMinutes: WINDOWS.includes(win as OverheadWindowMinutes)
      ? (win as OverheadWindowMinutes)
      : 180,
  };
}

export function setOverheadMinElevationDeg(value: OverheadMinElevationDeg): void {
  const safe = ELEVATIONS.includes(value) ? value : 20;
  try {
    localStorage.setItem(ELEVATION_KEY, String(safe));
  } catch {
    /* ignore */
  }
}

export function setOverheadWindowMinutes(value: OverheadWindowMinutes): void {
  const safe = WINDOWS.includes(value) ? value : 180;
  try {
    localStorage.setItem(WINDOW_KEY, String(safe));
  } catch {
    /* ignore */
  }
}
