#!/usr/bin/env node
/**
 * Zero-credential GeoSpy smoke check for overnight / CI agents.
 * Verifies brand + overhead-pass product surface files and key strings.
 * Exit 0 on success, 1 on failure.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function read(rel) {
  const p = resolve(root, rel);
  if (!existsSync(p)) {
    failures.push(`missing file: ${rel}`);
    return '';
  }
  return readFileSync(p, 'utf8');
}

function mustInclude(rel, pattern, label) {
  const text = read(rel);
  if (!text) return;
  const ok = typeof pattern === 'string' ? text.includes(pattern) : pattern.test(text);
  if (!ok) failures.push(`${rel}: expected ${label}`);
}

mustInclude('src/config/brand.ts', "name: 'GeoSpy'", 'GeoSpy brand name');
mustInclude('src/config/brand.ts', 'lukasdoering/geospy-v2', 'GeoSpy github URL');
mustInclude('src/components/OrbitalPassesPopup.ts', 'buildOverheadPassesSummaryLine', 'revisit summary helper');
mustInclude('src/components/OrbitalPassesPopup.ts', 'orbital-passes-popup', 'popup testid');
mustInclude('src/components/OrbitalPassesPopup.ts', 'aria-modal', 'popup aria-modal');
mustInclude('src/components/OrbitalPassesPopup.ts', 'orbital-passes-prefs', 'prefs footer testid');
mustInclude('src/components/OrbitalPassesPopup.ts', 'buildOverheadShareUrl', 'overhead share URL helper');
mustInclude('src/components/OrbitalPassesPopup.ts', 'filterPassesByType', 'SAR/optical type filter');
mustInclude('src/components/OrbitalPassesPopup.ts', 'copyTextToClipboard', 'clipboard helper');
mustInclude('src/components/OrbitalPassesPopup.ts', 'flashClipboardFeedback', 'clipboard feedback helper');
mustInclude('src/components/OrbitalPassesPopup.ts', 'getActiveOverheadShareLocation', 'active overhead share location');
mustInclude('src/components/OrbitalPassesPopup.ts', 'onOpenSettings', 'prefs footer settings callback');
mustInclude('src/utils/urlState.ts', 'parseOverheadParam', 'overhead deep-link parser');
mustInclude('src/App.ts', 'pendingDeepLinkOverhead', 'overhead deep-link wiring');
mustInclude('src/components/SatellitesFlatHint.ts', 'geospy-satellites-flat-hint', 'flat-map hint');
mustInclude('src/components/SatellitesFlatHint.ts', 'Predict passes', 'flat-map Predict passes CTA');
mustInclude('src/components/NextOverheadChip.ts', 'geospy-next-overhead-chip', 'next overhead chip');
mustInclude('src/services/overhead-pass-settings.ts', 'geospy-overhead-min-elevation', 'overhead prefs storage');
mustInclude('src/config/commands.ts', "id: 'view:overhead-passes'", 'Cmd+K overhead command');
mustInclude('src/config/commands.ts', "id: 'view:overhead-passes-last'", 'Cmd+K last-location command');
mustInclude('src/app/country-intel.ts', 'geospy-overhead-last-location', 'last location persistence');
mustInclude('src/app/country-intel.ts', 'geospy-overhead-tip-try', 'tip Try now CTA');
mustInclude('src/app/country-intel.ts', 'dismissPermanently', 'tip permanent dismiss only on CTA');
mustInclude('src/app/event-handlers.ts', "key.toLowerCase() === 'o'", 'Cmd+Shift+O hotkey');
mustInclude('src/app/event-handlers.ts', 'OVERHEAD_POPUP_CHANGE_EVENT', 'overhead URL sync event');
mustInclude('src/config/variants/full.ts', 'satellites: true', 'satellites default-on');
mustInclude('public/offline.html', 'GeoSpy - Offline', 'offline title');
mustInclude('index.html', 'GeoSpy is a real-time global intelligence dashboard', 'honest meta description');
mustInclude('GEOSPY.md', 'cursor/geospy-working-demo-4151', 'getting-started demo checkout');
mustInclude('GEOSPY.md', 'npm run geospy:verify', 'getting-started verify command');
mustInclude('package.json', '"geospy:verify"', 'geospy:verify script');
mustInclude('scripts/geospy-verify.mjs', 'focused GeoSpy tests', 'verify runner label');
mustInclude('server/worldmonitor/intelligence/v1/list-satellites.ts', 'inferSensorType', 'SAR name classification');
mustInclude('server/worldmonitor/intelligence/v1/list-satellites.ts', 'CELESTRAK', 'CelesTrak catalog fallback');

if (failures.length) {
  console.error('GeoSpy smoke check FAILED:');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}

console.log('GeoSpy smoke check OK');
console.log('  brand + overhead-pass surface + honest meta present');
console.log('  checkout: cursor/geospy-working-demo-4151');
