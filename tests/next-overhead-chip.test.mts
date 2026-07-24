import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildNextOverheadChipLabel } from '../src/components/NextOverheadChip.ts';
import type { OverheadPass } from '../src/services/satellites.ts';

describe('next overhead chip', () => {
  it('builds a typed next-pass label with ETA', () => {
    const now = Date.parse('2024-01-01T12:00:00Z');
    const pass: OverheadPass = {
      noradId: '39634',
      name: 'SENTINEL-1A',
      type: 'sar',
      country: 'EU',
      aosMs: now + 42 * 60_000,
      losMs: now + 45 * 60_000,
      maxElevationDeg: 40,
      maxElevationMs: now + 43 * 60_000,
    };
    assert.equal(buildNextOverheadChipLabel(pass, now), 'Next SAR: SENTINEL-1A in 42m');
  });

  it('wires chip sync into country-intel and ships styles', () => {
    const intel = readFileSync(new URL('../src/app/country-intel.ts', import.meta.url), 'utf8');
    assert.match(intel, /syncNextOverheadChip/);
    assert.match(intel, /maybeShowNextOverheadChip/);

    const chip = readFileSync(new URL('../src/components/NextOverheadChip.ts', import.meta.url), 'utf8');
    assert.match(chip, /geospy-next-overhead-chip/);
    assert.match(chip, /geospy-next-overhead-chip-dismissed/);
    assert.match(chip, /readLastOverheadLocation/);

    const css = readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');
    assert.match(css, /\.geospy-next-overhead-chip\s*\{/);
  });
});
