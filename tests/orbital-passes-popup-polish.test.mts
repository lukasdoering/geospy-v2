import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  buildOverheadPassesClipboardText,
  formatEta,
  formatPassDuration,
} from '../src/components/OrbitalPassesPopup.ts';
import type { OverheadPass } from '../src/services/satellites.ts';

describe('OrbitalPassesPopup polish', () => {
  it('formats pass duration from AOS/LOS', () => {
    assert.equal(formatPassDuration(0, 45_000), '45s');
    assert.equal(formatPassDuration(0, 240_000), '4m');
    assert.equal(formatPassDuration(0, 3_720_000), '1h 2m');
  });

  it('formats ETA buckets', () => {
    const now = Date.parse('2024-01-01T12:00:00Z');
    assert.equal(formatEta(now, now), 'now');
    assert.equal(formatEta(now + 25 * 60_000, now), 'in 25m');
    assert.equal(formatEta(now + 90 * 60_000, now), 'in 1h 30m');
  });

  it('builds a clipboard summary with coords and rows', () => {
    const now = Date.parse('2024-01-01T12:00:00Z');
    const passes: OverheadPass[] = [
      {
        noradId: '1',
        name: 'SAT-A',
        type: 'optical',
        country: 'US',
        aosMs: now + 600_000,
        losMs: now + 840_000,
        maxElevationDeg: 42,
        maxElevationMs: now + 720_000,
      },
    ];
    const text = buildOverheadPassesClipboardText(40.712, -74.006, passes, now);
    assert.match(text, /GeoSpy overhead passes @ 40\.712°, -74\.006°/);
    assert.match(text, /SAT-A \(optical\/US\)/);
    assert.match(text, /AOS /);
    assert.match(text, /LOS /);
    assert.match(text, /max 42°/);
    assert.match(text, /4m/);
  });

  it('formats prefs-aware empty detail and settings summary', async () => {
    const {
      defaultOverheadEmptyDetail,
      formatOverheadSettingsSummary,
    } = await import('../src/components/OrbitalPassesPopup.ts');
    assert.equal(
      defaultOverheadEmptyDetail({ minElevationDeg: 30, windowMinutes: 360 }),
      'No LEO imaging passes above 30° elevation in the next 6 hours.',
    );
    assert.equal(
      formatOverheadSettingsSummary({ minElevationDeg: 10, windowMinutes: 720 }),
      'Threshold 10° · window 12h · Settings → Satellites',
    );
  });

  it('computes median revisit and typed summary line', async () => {
    const { medianRevisitMinutes, countPassTypes, buildOverheadPassesSummaryLine } = await import('../src/components/OrbitalPassesPopup.ts');
    assert.equal(medianRevisitMinutes([0, 10 * 60_000, 30 * 60_000]), 15);
    assert.equal(medianRevisitMinutes([0]), null);
    assert.deepEqual(countPassTypes([
      { noradId: '1', name: 'a', type: 'sar', country: 'X', aosMs: 0, losMs: 1, maxElevationDeg: 1, maxElevationMs: 0 },
      { noradId: '2', name: 'b', type: 'optical', country: 'Y', aosMs: 1, losMs: 2, maxElevationDeg: 1, maxElevationMs: 1 },
      { noradId: '3', name: 'c', type: 'military', country: 'Z', aosMs: 2, losMs: 3, maxElevationDeg: 1, maxElevationMs: 2 },
    ]), { sar: 1, optical: 1, other: 1 });

    const now = Date.parse('2024-01-01T12:00:00Z');
    const line = buildOverheadPassesSummaryLine([
      { noradId: '1', name: 'a', type: 'sar', country: 'X', aosMs: now + 600_000, losMs: now + 700_000, maxElevationDeg: 40, maxElevationMs: now + 650_000 },
      { noradId: '2', name: 'b', type: 'optical', country: 'Y', aosMs: now + 1_800_000, losMs: now + 1_900_000, maxElevationDeg: 35, maxElevationMs: now + 1_850_000 },
    ], now);
    assert.match(line, /2 passes/);
    assert.match(line, /median revisit/);
    assert.match(line, /1 SAR/);
    assert.match(line, /1 optical/);
  });

  it('wires Cmd+K overhead-passes command through search manager', () => {
    const commands = readFileSync(new URL('../src/config/commands.ts', import.meta.url), 'utf8');
    assert.match(commands, /id: 'view:overhead-passes'/);

    const search = readFileSync(new URL('../src/app/search-manager.ts', import.meta.url), 'utf8');
    assert.match(search, /action === 'overhead-passes'/);
    assert.match(search, /predictOverheadPassesAtMapCenter/);

    const app = readFileSync(new URL('../src/App.ts', import.meta.url), 'utf8');
    assert.match(app, /predictOverheadPassesAtMapCenter:\s*\(\)\s*=>\s*this\.countryIntel\.predictOverheadPassesAtMapCenter\(\)/);

    const handlers = readFileSync(new URL('../src/app/event-handlers.ts', import.meta.url), 'utf8');
    assert.match(handlers, /key\.toLowerCase\(\) === 'o'/);
    assert.match(handlers, /predictOverheadPassesAtMapCenter/);

    const intel = readFileSync(new URL('../src/app/country-intel.ts', import.meta.url), 'utf8');
    assert.match(intel, /predictOverheadPassesAtMapCenter\(/);
    assert.match(intel, /geospy-overhead-passes-tip-dismissed/);
    assert.match(intel, /onRetry:\s*retry/);
    assert.match(intel, /geospy-overhead-tip-try/);
    assert.match(intel, /Try now/);
  });
});
