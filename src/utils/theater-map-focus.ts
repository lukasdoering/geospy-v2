/** Resolve a free-text theater / geo label to a map focus centroid. */
const THEATER_CENTROIDS: Record<string, { lat: number; lon: number }> = {
  'middle east': { lat: 29.0, lon: 48.0 },
  'persian gulf': { lat: 26.5, lon: 52.0 },
  'gulf': { lat: 26.5, lon: 52.0 },
  'strait of hormuz': { lat: 26.5, lon: 56.5 },
  'hormuz': { lat: 26.5, lon: 56.5 },
  'red sea': { lat: 20.0, lon: 38.5 },
  'bab el-mandeb': { lat: 12.6, lon: 43.3 },
  'bab el mandeb': { lat: 12.6, lon: 43.3 },
  'suez': { lat: 30.5, lon: 32.3 },
  'suez canal': { lat: 30.5, lon: 32.3 },
  'mediterranean': { lat: 35.0, lon: 18.0 },
  'eastern mediterranean': { lat: 34.0, lon: 32.0 },
  'black sea': { lat: 43.0, lon: 34.0 },
  'baltic': { lat: 58.0, lon: 20.0 },
  'baltic sea': { lat: 58.0, lon: 20.0 },
  'north atlantic': { lat: 45.0, lon: -30.0 },
  'arctic': { lat: 75.0, lon: 40.0 },
  'south china sea': { lat: 12.0, lon: 114.0 },
  'taiwan strait': { lat: 24.0, lon: 119.0 },
  'east china sea': { lat: 28.0, lon: 125.0 },
  'korean peninsula': { lat: 38.0, lon: 127.0 },
  'indo-pacific': { lat: 10.0, lon: 100.0 },
  'sahel': { lat: 15.0, lon: 0.0 },
  'horn of africa': { lat: 8.0, lon: 45.0 },
  'west africa': { lat: 8.0, lon: -5.0 },
  'central africa': { lat: 0.0, lon: 22.0 },
  'southern africa': { lat: -25.0, lon: 28.0 },
  'latin america': { lat: -15.0, lon: -60.0 },
  'caribbean': { lat: 15.0, lon: -70.0 },
  'europe': { lat: 50.0, lon: 10.0 },
  'eastern europe': { lat: 50.0, lon: 30.0 },
  'northern europe': { lat: 60.0, lon: 15.0 },
  'central asia': { lat: 42.0, lon: 65.0 },
  'south asia': { lat: 22.0, lon: 78.0 },
  'southeast asia': { lat: 10.0, lon: 105.0 },
  'east asia': { lat: 35.0, lon: 120.0 },
  'north america': { lat: 40.0, lon: -100.0 },
  'global': { lat: 20.0, lon: 0.0 },
};

export function resolveTheaterMapFocus(
  theater?: string | null,
): { lat: number; lon: number; key: string } | null {
  const raw = (theater ?? '').trim().toLowerCase();
  if (!raw) return null;
  const hit = THEATER_CENTROIDS[raw];
  if (hit) return { lat: hit.lat, lon: hit.lon, key: raw };
  // Prefix / contains fallback for labels like "Middle East / Gulf"
  for (const [key, centroid] of Object.entries(THEATER_CENTROIDS)) {
    if (raw.includes(key) || key.includes(raw)) {
      return { lat: centroid.lat, lon: centroid.lon, key };
    }
  }
  return null;
}
