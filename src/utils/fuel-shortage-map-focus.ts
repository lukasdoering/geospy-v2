import { getCountryCentroid } from '@/services/country-geometry';
import { toIso2 } from '@/utils/country-codes';

/** Resolve a fuel-shortage country code to a map focus point. */
export function resolveFuelShortageMapFocus(
  country?: string | null,
): { lat: number; lon: number; code: string } | null {
  const code = toIso2(country ?? '');
  if (!code) return null;
  const centroid = getCountryCentroid(code);
  if (!centroid) return null;
  // Guard Null Island / bad centroids — same contract as displacement focus.
  if (!Number.isFinite(centroid.lat) || !Number.isFinite(centroid.lon)) return null;
  if (Math.abs(centroid.lat) < 1e-6 && Math.abs(centroid.lon) < 1e-6) return null;
  return { lat: centroid.lat, lon: centroid.lon, code };
}
