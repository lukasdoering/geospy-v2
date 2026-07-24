import { toIso2 } from '@/utils/country-codes';
import { getCountryCentroid, getCountryNameByCode } from '@/services/country-geometry';

/** Resolve advisory country (ISO2/name) to a map focus point. */
export function resolveAdvisoryMapFocus(
  country?: string | null,
): { lat: number; lon: number; code: string } | null {
  const code = toIso2(country ?? '');
  if (!code) return null;
  const centroid = getCountryCentroid(code);
  if (!centroid) return null;
  return { lat: centroid.lat, lon: centroid.lon, code };
}

export function advisoryCountryLabel(country?: string | null): string {
  const code = toIso2(country ?? '');
  if (!code) return (country || '').trim();
  return getCountryNameByCode(code) || code;
}
