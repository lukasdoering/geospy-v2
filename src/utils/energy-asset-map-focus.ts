/** Guard Null Island / missing coords for energy asset map focus. */
export function isUsableMapCoord(lat: number, lon: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  if (Math.abs(lat) < 1e-6 && Math.abs(lon) < 1e-6) return false;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return false;
  return true;
}

/** Midpoint of pipeline start/end when both are usable; else either endpoint. */
export function resolvePipelineMapFocus(
  start?: { lat?: number; lon?: number } | null,
  end?: { lat?: number; lon?: number } | null,
): { lat: number; lon: number } | null {
  const sLat = start?.lat;
  const sLon = start?.lon;
  const eLat = end?.lat;
  const eLon = end?.lon;
  const startOk = typeof sLat === 'number' && typeof sLon === 'number' && isUsableMapCoord(sLat, sLon);
  const endOk = typeof eLat === 'number' && typeof eLon === 'number' && isUsableMapCoord(eLat, eLon);
  if (startOk && endOk) {
    return { lat: (sLat + eLat) / 2, lon: (sLon + eLon) / 2 };
  }
  if (startOk) return { lat: sLat, lon: sLon };
  if (endOk) return { lat: eLat, lon: eLon };
  return null;
}

export function resolveStorageFacilityMapFocus(
  location?: { lat?: number; lon?: number } | null,
): { lat: number; lon: number } | null {
  const lat = location?.lat;
  const lon = location?.lon;
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;
  if (!isUsableMapCoord(lat, lon)) return null;
  return { lat, lon };
}
