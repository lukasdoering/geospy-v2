// Phase 2 — Orbital Surveillance (in progress)
// ✅ Overhead Pass Prediction: predictNextPasses / predictOverheadPassesAt
// - Revisit Time Analysis: how often a location is observed by hostile/friendly sats
// - Imaging Window Alerts: notify when SAR/optical sats are overhead a watched region
// - Sensor Swath Visualization: show ground coverage cone (FOV-based) not just nadir dot
// - Cross-Layer Correlation: satellite overhead + GPS jamming zone = EW context;
//   satellite overhead + conflict zone = battlefield ISR; satellite + AIS gap = maritime recon
// - Satellite Intel Summary Panel: table of tracked sats with orbit type, operator,
//   sensor capability, current position, next pass over user POI
// - Historical Pass Log: which sats passed over a location in the last 24h
//   (useful for identifying imaging windows after events)

import { createLazyClient, getRpcBaseUrl } from '@/services/rpc-client';

import type { SatRec } from 'satellite.js';
import { IntelligenceServiceClient } from '@/services/generated-rpc-clients';

// satellite.js (~20KB) is only needed once the satellite layer fetches TLEs — never at
// boot. Lazy-load + cache the module so it ships off the eager main entry. initSatRecs
// (async) resolves the lib before propagatePositions (sync) runs in the loop.
type SatelliteLib = typeof import('satellite.js');
let satLib: SatelliteLib | null = null;
let satLibPromise: Promise<SatelliteLib> | null = null;
async function ensureSatelliteLib(): Promise<SatelliteLib> {
  if (satLib) return satLib;
  if (!satLibPromise) {
    satLibPromise = import('satellite.js')
      .then((m) => { satLib = m; return m; })
      .catch((err) => { satLibPromise = null; throw err; });
  }
  return satLibPromise;
}

const getIntelligenceClient = createLazyClient(() => new IntelligenceServiceClient(getRpcBaseUrl(), { fetch: (...args) => globalThis.fetch(...args) }));

export interface SatelliteTLE {
  noradId: string;
  name: string;
  line1: string;
  line2: string;
  type: string;
  country: string;
}

export interface SatellitePosition {
  noradId: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
  type: string;
  country: string;
  velocity: number;
  inclination: number;
  trail: [number, number, number][];
}

export interface SatRecEntry {
  satrec: SatRec;
  meta: { noradId: string; name: string; type: string; country: string };
}

export interface OverheadPass {
  noradId: string;
  name: string;
  type: string;
  country: string;
  /** Acquisition of signal — first sample above the elevation threshold (ms). */
  aosMs: number;
  /** Loss of signal — last sample above the elevation threshold (ms). */
  losMs: number;
  /** Peak elevation during the pass, degrees above horizon. */
  maxElevationDeg: number;
  /** Timestamp of peak elevation (ms). */
  maxElevationMs: number;
}

export interface PredictPassesOptions {
  /** Look-ahead window in minutes (default 180). */
  windowMinutes?: number;
  /** Sample step in seconds (default 60). */
  stepSeconds?: number;
  /** Minimum elevation to count as an overhead pass, degrees (default 20). */
  minElevationDeg?: number;
  /** Max passes to return after sorting by AOS (default 12). */
  limit?: number;
  /** Optional clock override for tests. */
  nowMs?: number;
}

let cachedData: SatelliteTLE[] | null = null;
let cachedAt = 0;
const CACHE_TTL = 10 * 60 * 1000;

let failures = 0;
let cooldownUntil = 0;
const MAX_FAILURES = 3;
const COOLDOWN_MS = 10 * 60 * 1000;

/** Mean motion below this (rad/min) is treated as MEO/GEO and skipped for overhead passes. */
const LEO_MEAN_MOTION_MIN = 0.03;

export async function fetchSatelliteTLEs(): Promise<SatelliteTLE[] | null> {
  const now = Date.now();
  if (now < cooldownUntil) return cachedData;
  if (cachedData && now - cachedAt < CACHE_TTL) return cachedData;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);
    let resp;
    try {
      resp = await getIntelligenceClient().listSatellites({ country: '' }, { signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
    // Proto returns `id` (the NORAD identifier); local SatelliteTLE uses `noradId`.
    // `alt`/`velocity`/`inclination` in the proto are unused by the propagation
    // client — we compute them ourselves from the TLE via satellite.js.
    const satellites: SatelliteTLE[] = (resp.satellites ?? []).map((s) => ({
      noradId: s.id,
      name: s.name,
      line1: s.line1,
      line2: s.line2,
      type: s.type,
      country: s.country,
    }));
    cachedData = satellites;
    cachedAt = now;
    failures = 0;
    return cachedData;
  } catch {
    failures++;
    if (failures >= MAX_FAILURES) {
      cooldownUntil = now + COOLDOWN_MS;
    }
    return cachedData;
  }
}

export async function initSatRecs(tles: SatelliteTLE[]): Promise<SatRecEntry[]> {
  const { twoline2satrec } = await ensureSatelliteLib();
  const entries: SatRecEntry[] = [];
  for (const tle of tles) {
    try {
      const satrec = twoline2satrec(tle.line1, tle.line2);
      entries.push({
        satrec,
        meta: { noradId: tle.noradId, name: tle.name, type: tle.type, country: tle.country },
      });
    } catch { /* skip malformed */ }
  }
  return entries;
}

export function propagatePositions(satRecs: SatRecEntry[], date?: Date): SatellitePosition[] {
  // satellite.js is loaded by initSatRecs before any propagation runs; if it has not
  // resolved yet (propagatePositions called before init), yield no positions this tick.
  if (!satLib) return [];
  const { gstime, propagate, eciToGeodetic, degreesLat, degreesLong } = satLib;
  const now = date || new Date();
  const gmst = gstime(now);
  const positions: SatellitePosition[] = [];

  for (const { satrec, meta } of satRecs) {
    try {
      const pv = propagate(satrec, now);
      if (!pv || !pv.position || typeof pv.position === 'boolean') continue;
      const geo = eciToGeodetic(pv.position, gmst);
      const lat = degreesLat(geo.latitude);
      const lng = degreesLong(geo.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const alt = geo.height;

      let velocity = 0;
      if (pv.velocity && typeof pv.velocity !== 'boolean') {
        const { x, y, z } = pv.velocity;
        velocity = Math.sqrt(x * x + y * y + z * z);
      }

      const trail: [number, number, number][] = [];
      for (let t = 1; t <= 15; t++) {
        const pastDate = new Date(now.getTime() - t * 60_000);
        const pastGmst = gstime(pastDate);
        try {
          const pastPv = propagate(satrec, pastDate);
          if (!pastPv || !pastPv.position || typeof pastPv.position === 'boolean') continue;
          const pastGeo = eciToGeodetic(pastPv.position, pastGmst);
          const tLat = degreesLat(pastGeo.latitude);
          const tLng = degreesLong(pastGeo.longitude);
          if (!Number.isFinite(tLat) || !Number.isFinite(tLng)) continue;
          trail.push([tLng, tLat, pastGeo.height]);
        } catch { /* skip */ }
      }

      const inclination = satrec.inclo * (180 / Math.PI);
      positions.push({ ...meta, lat, lng, alt, velocity, inclination, trail });
    } catch { /* skip propagation errors */ }
  }
  return positions;
}

export function startPropagationLoop(
  satRecs: SatRecEntry[],
  callback: (positions: SatellitePosition[]) => void,
  intervalMs = 3000,
): () => void {
  const id = setInterval(() => {
    const positions = propagatePositions(satRecs);
    callback(positions);
  }, intervalMs);
  return () => clearInterval(id);
}

export function getSatelliteStatus(): string {
  if (Date.now() < cooldownUntil) return 'cooldown';
  if (failures > 0) return 'degraded';
  return 'ok';
}

function elevationAt(
  lib: SatelliteLib,
  satrec: SatRec,
  observer: { latitude: number; longitude: number; height: number },
  when: Date,
): number | null {
  const { gstime, propagate, eciToEcf, ecfToLookAngles } = lib;
  try {
    const pv = propagate(satrec, when);
    if (!pv || !pv.position || typeof pv.position === 'boolean') return null;
    const gmst = gstime(when);
    const ecf = eciToEcf(pv.position, gmst);
    const look = ecfToLookAngles(observer, ecf);
    const elevDeg = look.elevation * (180 / Math.PI);
    return Number.isFinite(elevDeg) ? elevDeg : null;
  } catch {
    return null;
  }
}

/**
 * Predict upcoming overhead passes for a ground point using already-initialized
 * SGP4 records. Skips non-LEO mean-motion objects. Pure / sync once satLib is loaded.
 */
export function predictNextPasses(
  lat: number,
  lng: number,
  satRecs: SatRecEntry[],
  options: PredictPassesOptions = {},
): OverheadPass[] {
  if (!satLib || satRecs.length === 0) return [];
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

  const windowMinutes = options.windowMinutes ?? 180;
  const stepSeconds = options.stepSeconds ?? 60;
  const minElevationDeg = options.minElevationDeg ?? 20;
  const limit = options.limit ?? 12;
  const nowMs = options.nowMs ?? Date.now();
  const endMs = nowMs + windowMinutes * 60_000;
  const stepMs = stepSeconds * 1000;

  const observer = {
    latitude: satLib.degreesToRadians(lat),
    longitude: satLib.degreesToRadians(lng),
    height: 0,
  };

  const passes: OverheadPass[] = [];

  for (const { satrec, meta } of satRecs) {
    // Mean motion (rad/min): LEO imaging sats are well above this floor.
    if (!(satrec.no > LEO_MEAN_MOTION_MIN)) continue;

    let inPass = false;
    let aosMs = 0;
    let losMs = 0;
    let maxElev = -Infinity;
    let maxElevMs = 0;

    for (let t = nowMs; t <= endMs; t += stepMs) {
      const elev = elevationAt(satLib, satrec, observer, new Date(t));
      if (elev == null) {
        if (inPass) {
          passes.push({
            ...meta,
            aosMs,
            losMs,
            maxElevationDeg: maxElev,
            maxElevationMs: maxElevMs,
          });
          inPass = false;
          maxElev = -Infinity;
        }
        continue;
      }

      if (elev >= minElevationDeg) {
        if (!inPass) {
          inPass = true;
          aosMs = t;
        }
        losMs = t;
        if (elev > maxElev) {
          maxElev = elev;
          maxElevMs = t;
        }
      } else if (inPass) {
        passes.push({
          ...meta,
          aosMs,
          losMs,
          maxElevationDeg: maxElev,
          maxElevationMs: maxElevMs,
        });
        inPass = false;
        maxElev = -Infinity;
      }
    }

    if (inPass) {
      passes.push({
        ...meta,
        aosMs,
        losMs,
        maxElevationDeg: maxElev,
        maxElevationMs: maxElevMs,
      });
    }
  }

  passes.sort((a, b) => a.aosMs - b.aosMs || b.maxElevationDeg - a.maxElevationDeg);
  return passes.slice(0, limit);
}

/**
 * Fetch TLEs (using the shared client cache), initialize SGP4, and predict
 * overhead passes for a map click / POI. Safe to call with the satellites layer off.
 *
 * Throws if the satellite catalog cannot be loaded (network/cooldown empty),
 * so the UI can distinguish "catalog unavailable" from "no overhead passes".
 */
export async function predictOverheadPassesAt(
  lat: number,
  lng: number,
  options: PredictPassesOptions = {},
): Promise<OverheadPass[]> {
  const tles = await fetchSatelliteTLEs();
  if (!tles || tles.length === 0) {
    throw new Error('SATELLITE_CATALOG_UNAVAILABLE');
  }
  const satRecs = await initSatRecs(tles);
  // ensureSatelliteLib resolved inside initSatRecs
  return predictNextPasses(lat, lng, satRecs, options);
}
