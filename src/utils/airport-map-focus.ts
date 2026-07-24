import { MONITORED_AIRPORTS } from '@/config/airports';

/** Resolve a monitored-airport IATA code to a map focus point. */
export function resolveAirportMapFocus(
  iata?: string | null,
): { lat: number; lon: number; iata: string } | null {
  const code = (iata ?? '').trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(code)) return null;
  const airport = MONITORED_AIRPORTS.find((a) => a.iata === code);
  if (!airport) return null;
  if (!Number.isFinite(airport.lat) || !Number.isFinite(airport.lon)) return null;
  if (Math.abs(airport.lat) < 1e-6 && Math.abs(airport.lon) < 1e-6) return null;
  return { lat: airport.lat, lon: airport.lon, iata: code };
}
