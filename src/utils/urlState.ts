import type { MapLayers } from '@/types';
import type { MapView, TimeRange } from '@/components/Map';

const LAYER_KEYS: (keyof MapLayers)[] = [
  'conflicts',
  'bases',
  'cables',
  'pipelines',
  'hotspots',
  'ais',
  'nuclear',
  'irradiators',
  'sanctions',
  'weather',
  'economic',
  'waterways',
  'outages',
  'cyberThreats',
  'datacenters',
  'protests',
  'flights',
  'military',
  'natural',
  'spaceports',
  'minerals',
  'fires',
  'ucdpEvents',
  'displacement',
  'climate',
  'startupHubs',
  'cloudRegions',
  'accelerators',
  'techHQs',
  'techEvents',
  'tradeRoutes',
  'iranAttacks',
  'gpsJamming',
  'satellites',
  'ciiChoropleth',
  'resilienceScore',
];

const TIME_RANGES: TimeRange[] = ['1h', '6h', '24h', '48h', '7d', 'all'];
const VIEW_VALUES: MapView[] = ['global', 'america', 'mena', 'eu', 'asia', 'latam', 'africa', 'oceania'];

export interface ParsedMapUrlState {
  view?: MapView;
  zoom?: number;
  lat?: number;
  lon?: number;
  timeRange?: TimeRange;
  layers?: MapLayers;
  country?: string;
  expanded?: boolean;
  chokepoint?: string;
  /** GeoSpy: open overhead-pass prediction at these coordinates. */
  overhead?: { lat: number; lon: number };
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const parseEnumParam = <T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[]
): T | undefined => {
  const value = params.get(key);
  return value && allowed.includes(value as T) ? (value as T) : undefined;
};

const parseClampedFloatParam = (
  params: URLSearchParams,
  key: string,
  min: number,
  max: number
): number | undefined => {
  const rawValue = params.get(key);
  const value = rawValue ? Number.parseFloat(rawValue) : NaN;
  return Number.isFinite(value) ? clamp(value, min, max) : undefined;
};

/** Parse ?overhead=1 (with lat/lon) or ?overhead=40.7128,-74.0060 */
export function parseOverheadParam(
  params: URLSearchParams,
  latFromQuery?: number,
  lonFromQuery?: number,
): { lat: number; lon: number } | undefined {
  const raw = params.get('overhead');
  if (raw == null || raw === '') return undefined;
  if (raw === '1' || raw.toLowerCase() === 'true') {
    if (latFromQuery == null || lonFromQuery == null) return undefined;
    return { lat: latFromQuery, lon: lonFromQuery };
  }
  const parts = raw.split(',').map((p) => p.trim());
  if (parts.length !== 2) return undefined;
  const lat = Number.parseFloat(parts[0]!);
  const lon = Number.parseFloat(parts[1]!);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return undefined;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return undefined;
  return { lat, lon };
}

export function parseMapUrlState(
  search: string,
  fallbackLayers: MapLayers
): ParsedMapUrlState {
  const params = new URLSearchParams(search);

  const view = parseEnumParam(params, 'view', VIEW_VALUES);
  const zoom = parseClampedFloatParam(params, 'zoom', 1, 10);
  const lat = parseClampedFloatParam(params, 'lat', -90, 90);
  const lon = parseClampedFloatParam(params, 'lon', -180, 180);
  const timeRange = parseEnumParam(params, 'timeRange', TIME_RANGES);

  const countryParam = params.get('country');
  const country = countryParam && /^[A-Z]{2}$/i.test(countryParam.trim()) ? countryParam.trim().toUpperCase() : undefined;

  const expandedParam = params.get('expanded');
  const expanded = expandedParam === '1' ? true : undefined;

  // Chokepoint deep-link (?chokepoint=bab_el_mandeb): opens the waterway popup on
  // the live map. Value is a canonical chokepoint/waterway id (lowercase, snake).
  // The map resolves it against STRATEGIC_WATERWAYS and no-ops on an unknown id,
  // so this only needs to reject obviously malformed input.
  const chokepointParam = params.get('chokepoint');
  const chokepoint = chokepointParam && /^[a-z][a-z0-9_]{1,40}$/i.test(chokepointParam.trim())
    ? chokepointParam.trim().toLowerCase()
    : undefined;

  const overhead = parseOverheadParam(params, lat, lon);

  const layersParam = params.get('layers');
  let layers: MapLayers | undefined;
  if (layersParam !== null) {
    layers = { ...fallbackLayers };
    const normalizedLayers = layersParam.trim();
    if (normalizedLayers !== '' && normalizedLayers !== 'none') {
      const requested = new Set(
        normalizedLayers
          .split(',')
          .map((layer) => layer.trim())
          .filter(Boolean)
      );
      if (requested.has('satelliteImagery')) {
        requested.delete('satelliteImagery');
        requested.add('satellites');
      }
      LAYER_KEYS.forEach((key) => {
        layers![key] = requested.has(key);
      });
    } else {
      LAYER_KEYS.forEach((key) => {
        layers![key] = false;
      });
    }
  }

  return {
    view,
    zoom,
    lat,
    lon,
    timeRange,
    layers,
    country,
    expanded,
    chokepoint,
    overhead,
  };
}

export function buildMapUrl(
  baseUrl: string,
  state: {
    view: MapView;
    zoom: number;
    center?: { lat: number; lon: number } | null;
    timeRange: TimeRange;
    layers: MapLayers;
    country?: string;
    expanded?: boolean;
    chokepoint?: string;
    /** When true with a center, append overhead=1 for GeoSpy share links. */
    overhead?: boolean;
  }
): string {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    // window.location.origin can be "null" string in some in-app browsers / WebViews
    url = new URL(window.location.href);
  }
  const params = new URLSearchParams();

  if (state.center) {
    params.set('lat', state.center.lat.toFixed(4));
    params.set('lon', state.center.lon.toFixed(4));
  }

  params.set('zoom', state.zoom.toFixed(2));
  params.set('view', state.view);
  params.set('timeRange', state.timeRange);

  const activeLayers = LAYER_KEYS.filter((layer) => state.layers[layer]);
  params.set('layers', activeLayers.length > 0 ? activeLayers.join(',') : 'none');

  if (state.country) {
    params.set('country', state.country);
  }

  if (state.expanded) {
    params.set('expanded', '1');
  }

  if (state.chokepoint) {
    params.set('chokepoint', state.chokepoint);
  }

  if (state.overhead && state.center) {
    params.set('overhead', '1');
  }

  url.search = params.toString();
  return url.toString();
}
