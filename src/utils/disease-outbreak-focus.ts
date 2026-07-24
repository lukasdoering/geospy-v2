import type { DiseaseOutbreakItem } from '@/services/disease-outbreaks';
import { toIso2 } from '@/utils/country-codes';
import { getCountryCentroid } from '@/services/country-geometry';

/** Prefer real coords; otherwise country centroid for map focus. */
export function resolveOutbreakMapFocus(
  o: Pick<DiseaseOutbreakItem, 'lat' | 'lng' | 'countryCode'>,
): { lat: number; lon: number } | null {
  if (Number.isFinite(o.lat) && Number.isFinite(o.lng) && (o.lat !== 0 || o.lng !== 0)) {
    return { lat: o.lat, lon: o.lng };
  }
  const code = toIso2(o.countryCode ?? '');
  if (!code) return null;
  const centroid = getCountryCentroid(code);
  if (!centroid) return null;
  return { lat: centroid.lat, lon: centroid.lon };
}

export function outbreakLocationLabel(
  o: Pick<DiseaseOutbreakItem, 'location' | 'countryCode'>,
): string {
  const loc = (o.location || '').trim();
  if (loc) return loc;
  const code = (o.countryCode || '').trim();
  return code || '';
}
