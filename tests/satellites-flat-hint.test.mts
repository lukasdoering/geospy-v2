import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('satellites flat-map coherence hint', () => {
  it('ships SatellitesFlatHint module with dismiss + switch-to-globe + predict controls', () => {
    const src = readFileSync(new URL('../src/components/SatellitesFlatHint.ts', import.meta.url), 'utf8');
    assert.match(src, /geospy-satellites-flat-hint/);
    assert.match(src, /Switch to 3D/);
    assert.match(src, /Predict passes/);
    assert.match(src, /onPredictPasses/);
    assert.match(src, /geospy-satellites-flat-hint-dismissed/);
    assert.match(src, /switchToGlobe/);
    assert.match(src, /Live orbits on 3D globe/);
    assert.match(src, /flatHintCopy/);
    assert.match(src, /textEl\.textContent = flatHintCopy/);
    assert.match(src, /document\.body\.appendChild/);
  });

  it('refreshes copy when satellitesEnabled flips on an existing hint', async () => {
    const { flatHintCopy } = await import('../src/components/SatellitesFlatHint.ts');
    assert.match(flatHintCopy(true), /Live orbits on 3D globe/);
    assert.match(flatHintCopy(false), /Switch to 3D for live orbits/);
  });

  it('wires hint sync into map layer + dimension handlers', () => {
    const handlers = readFileSync(new URL('../src/app/event-handlers.ts', import.meta.url), 'utf8');
    assert.match(handlers, /syncSatellitesFlatHint/);
    assert.match(handlers, /from '@\/components\/SatellitesFlatHint'/);
  });

  it('includes hint styles', () => {
    const css = readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');
    assert.match(css, /\.geospy-satellites-flat-hint\s*\{/);
    assert.match(css, /\.geospy-satellites-flat-hint-switch\s*\{/);
    assert.match(css, /\.geospy-satellites-flat-hint-predict/);
  });
});
