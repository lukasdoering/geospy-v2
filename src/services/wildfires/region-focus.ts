/** Minimal detection shape for region map focus (avoids Vite-bound wildfires barrel). */
export interface FocusableFireDetection {
  location?: { latitude?: number; longitude?: number } | null;
}

export interface FocusableFireRegion {
  fires: FocusableFireDetection[];
}

/** Average lat/lon of detections in a region for panel → map focus. */
export function regionMapFocus(stats: FocusableFireRegion): { lat: number; lon: number } | null {
  let latSum = 0;
  let lonSum = 0;
  let n = 0;
  for (const f of stats.fires) {
    const lat = f.location?.latitude;
    const lon = f.location?.longitude;
    if (typeof lat !== 'number' || typeof lon !== 'number') continue;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (lat === 0 && lon === 0) continue;
    latSum += lat;
    lonSum += lon;
    n += 1;
  }
  if (n === 0) return null;
  return { lat: latSum / n, lon: lonSum / n };
}
