#!/usr/bin/env node
/**
 * GeoSpy overnight verification: smoke check + focused product-surface tests.
 * Runs sequentially to avoid worktree OOM (same guidance as pre-push heavy checks).
 */
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tsxBin = resolve(root, 'node_modules/.bin/tsx');

const focusedTests = [
  'tests/orbital-passes-popup-polish.test.mts',
  'tests/overhead-pass-settings.test.mts',
  'tests/overhead-last-location.test.mts',
  'tests/satellite-overhead-passes.test.mts',
  'tests/satellites-flat-hint.test.mts',
  'tests/renewable-fallback-disclose.test.mts',
  'tests/urlState.test.mts',
  'tests/list-satellites-celestrak.test.mts',
  'tests/markets-chart-hint.test.mts',
  'tests/next-overhead-chip.test.mts',
  'tests/disease-panel-polish.test.mts',
  'tests/geospy-brand.test.mts',
  'tests/satellite-fires-panel.test.mts',
  'tests/internet-disruptions-map.test.mts',
  'tests/security-advisories-search.test.mts',
  'tests/security-advisories-map.test.mts',
  'tests/panel-map-layer-enable.test.mts',
  'tests/displacement-map-focus.test.mts',
  'tests/population-exposure-map.test.mts',
  'tests/radiation-watch-map.test.mts',
  'tests/thermal-escalation-search.test.mts',
  'tests/ucdp-events-map-a11y.test.mts',
  'tests/climate-anomaly-map-a11y.test.mts',
  'tests/settings-satellites-command.test.mts',
  'tests/strategic-map-a11y.test.mts',
  'tests/hubs-map-a11y.test.mts',
  'tests/tech-events-map-focus.test.mts',
  'tests/oref-sirens-map-focus.test.mts',
  'tests/investments-chokepoint-map.test.mts',
  'tests/hormuz-map-focus.test.mts',
  'tests/cascade-map-focus.test.mts',
  'tests/strategic-risk-enable-panel.test.mts',
  'tests/breaking-news-enable-panel.test.mts',
  'tests/energy-disruptions-enable-panels.test.mts',
  'tests/energy-map-enable-panels.test.mts',
  'tests/fuel-shortage-map-focus.test.mts',
];

function run(cmd, args, label) {
  console.log(`\n→ ${label}`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(`\nGeoSpy verify FAILED at: ${label}`);
    process.exit(result.status ?? 1);
  }
}

run(process.execPath, [resolve(root, 'scripts/geospy-smoke-check.mjs')], 'geospy:smoke');
run(tsxBin, ['--test', '--test-concurrency=1', ...focusedTests], 'focused GeoSpy tests');

console.log('\nGeoSpy verify OK');
console.log('  smoke + overhead/markets/renewable focused tests passed');
console.log('  demo branch: cursor/geospy-working-demo-4151');
