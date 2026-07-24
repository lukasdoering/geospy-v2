/**
 * Product identity for this fork.
 *
 * GeoSpy is an AGPL-3.0 fork of WorldMonitor (koala73/worldmonitor).
 * Keep API host defaults pointing at the upstream WorldMonitor edge so
 * zero-env local/dev still has live data. User-facing chrome uses GeoSpy.
 */

export const BRAND = {
  name: 'GeoSpy',
  nameUpper: 'GEOSPY',
  shortLogo: 'GEOSPY',
  tagline: 'Real-Time Global Intelligence Dashboard',
  documentTitle: 'GeoSpy — Real-Time Global Intelligence Dashboard',
  description:
    'GeoSpy is a real-time global intelligence dashboard — geopolitics, military, markets, climate, and OSINT on one live map. Fork of WorldMonitor.',
  githubUrl: 'https://github.com/lukasdoering/geospy-v2',
  upstreamName: 'WorldMonitor',
  upstreamUrl: 'https://github.com/koala73/worldmonitor',
  upstreamSite: 'https://www.worldmonitor.app',
} as const;
