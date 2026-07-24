import type {
  IntelligenceServiceHandler,
  ServerContext,
  ListSatellitesRequest,
  ListSatellitesResponse,
  Satellite,
} from '../../../../src/generated/server/worldmonitor/intelligence/v1/service_server';
import { getCachedJson } from '../../../_shared/redis';

const REDIS_KEY = 'intelligence:satellites:tle:v1';
const CELESTRAK_UA = 'GeoSpy/WorldMonitor (+https://github.com/lukasdoering/geospy-v2)';

/** In-memory fallback so empty Redis does not hammer CelesTrak every request. */
let celestrakFallback: { at: number; satellites: Satellite[] } | null = null;
const CELESTRAK_TTL_MS = 30 * 60 * 1000;

interface SatelliteCacheItem {
  id?: string;
  noradId?: string;
  name?: string;
  country?: string;
  type?: string;
  alt?: number | string;
  velocity?: number | string;
  inclination?: number | string;
  line1?: string;
  line2?: string;
}

interface SatelliteCacheResponse {
  satellites?: SatelliteCacheItem[];
}

function toNumber(value: number | string | undefined): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function toSatellite(item: SatelliteCacheItem): Satellite {
  return {
    id: String(item.id || item.noradId || ''),
    name: item.name || '',
    country: item.country || '',
    type: item.type || '',
    alt: toNumber(item.alt),
    velocity: toNumber(item.velocity),
    inclination: toNumber(item.inclination),
    line1: item.line1 || '',
    line2: item.line2 || '',
  };
}

// Note: SENTINEL-1A has no word boundary between "1" and "A", so allow a letter/digit suffix.
const SAR_NAME_RE =
  /\b(?:SAR|RADARSAT(?:-\d+)?|COSMO[- ]?SKYMED(?:-\d+)?|TERRASAR(?:-X)?|TANDEM-X|SENTINEL-1[A-Z0-9]*|ALOS-[24]|BIOMASS|RISAT(?:-\d+[A-Z]?)?|ICEYE(?:-[A-Z0-9]+)?|CAPELLA(?:-\d+)?|UMBRA(?:-\d+)?|NOVASAR(?:-\d+)?|SAOCOM(?:-\d+[A-Z]?)?|PAZ|CSG-\d+)\b/i;

function inferSensorType(name: string, fallback: string): string {
  if (SAR_NAME_RE.test(name)) return 'sar';
  return fallback;
}

/** Parse classic 3-line TLE text into Satellite messages. */
export function parseTleCatalog(
  text: string,
  defaults: { type: string; country: string },
): Satellite[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);
  const out: Satellite[] = [];
  for (let i = 0; i + 2 < lines.length; i += 3) {
    const name = lines[i]!.trim();
    const line1 = lines[i + 1]!.trim();
    const line2 = lines[i + 2]!.trim();
    if (!line1.startsWith('1 ') || !line2.startsWith('2 ')) {
      i -= 2; // resync if a blank/name-only glitch
      continue;
    }
    const norad = line1.slice(2, 7).trim();
    if (!norad) continue;
    out.push({
      id: norad,
      name,
      country: defaults.country,
      type: inferSensorType(name, defaults.type),
      alt: 0,
      velocity: 0,
      inclination: 0,
      line1,
      line2,
    });
  }
  return out;
}

async function fetchCelestrakGroup(
  group: string,
  defaults: { type: string; country: string },
): Promise<Satellite[]> {
  const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${encodeURIComponent(group)}&FORMAT=tle`;
  const resp = await fetch(url, {
    headers: { 'User-Agent': CELESTRAK_UA, Accept: 'text/plain' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!resp.ok) return [];
  const text = await resp.text();
  if (!text || text.length < 50) return [];
  return parseTleCatalog(text, defaults);
}

async function loadCelestrakFallback(): Promise<Satellite[]> {
  const now = Date.now();
  if (celestrakFallback && now - celestrakFallback.at < CELESTRAK_TTL_MS) {
    return celestrakFallback.satellites;
  }
  // resource ≈ earth-observation / imaging; stations covers ISS-class LEO for demo.
  const [resource, stations] = await Promise.all([
    fetchCelestrakGroup('resource', { type: 'optical', country: 'INT' }),
    fetchCelestrakGroup('stations', { type: 'optical', country: 'INT' }),
  ]);
  const byId = new Map<string, Satellite>();
  for (const sat of [...resource, ...stations]) {
    if (sat.id && sat.line1 && sat.line2) byId.set(sat.id, sat);
  }
  const satellites = [...byId.values()];
  if (satellites.length > 0) {
    celestrakFallback = { at: now, satellites };
  }
  return satellites;
}

export const listSatellites: IntelligenceServiceHandler['listSatellites'] = async (
  _ctx: ServerContext,
  req: ListSatellitesRequest,
): Promise<ListSatellitesResponse> => {
  const cached = await getCachedJson(REDIS_KEY, true);
  let satellites: Satellite[] = [];

  if (cached && typeof cached === 'object') {
    const payload = cached as SatelliteCacheResponse;
    if (Array.isArray(payload.satellites) && payload.satellites.length > 0) {
      satellites = payload.satellites.map(toSatellite);
    }
  }

  if (satellites.length === 0) {
    try {
      satellites = await loadCelestrakFallback();
    } catch {
      satellites = [];
    }
  }

  const filterCountry = req.country?.trim().toUpperCase();
  if (filterCountry) {
    satellites = satellites.filter((satellite) => satellite.country.toUpperCase() === filterCountry);
  }

  return { satellites };
};
