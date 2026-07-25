import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  outbreakLocationLabel,
  resolveOutbreakMapFocus,
} from '../src/utils/disease-outbreak-focus.ts';

describe('disease outbreaks panel polish', () => {
  it('falls back location label to countryCode', () => {
    assert.equal(outbreakLocationLabel({ location: 'Nigeria', countryCode: 'NG' }), 'Nigeria');
    assert.equal(outbreakLocationLabel({ location: '  ', countryCode: 'NG' }), 'NG');
    assert.equal(outbreakLocationLabel({ location: '', countryCode: '' }), '');
  });

  it('resolves map focus from lat/lng; treats 0,0 as missing', () => {
    assert.deepEqual(
      resolveOutbreakMapFocus({ lat: 9.0, lng: 8.0, countryCode: 'NG' }),
      { lat: 9.0, lon: 8.0 },
    );
    // Without hydrated country geometry (unit tests), centroid lookup is null.
    assert.equal(resolveOutbreakMapFocus({ lat: 0, lng: 0, countryCode: '' }), null);
  });

  it('wires search, row map focus, and panel-layout handler', () => {
    const panel = readFileSync(new URL('../src/components/DiseaseOutbreaksPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /data-role="search"/);
    assert.match(panel, /data-disease-focus/);
    assert.match(panel, /setCountryClickHandler/);
    assert.match(panel, /_severityFilter/);
    assert.match(panel, /disease-outbreak-focus/);

    const helpers = readFileSync(new URL('../src/utils/disease-outbreak-focus.ts', import.meta.url), 'utf8');
    assert.match(helpers, /getCountryCentroid/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /disease-outbreaks/);
    assert.match(layout, /setCountryClickHandler/);
    assert.match(layout, /diseaseOutbreaks/);
  });
});
