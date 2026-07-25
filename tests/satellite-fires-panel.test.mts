import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { regionMapFocus } from '../src/services/wildfires/region-focus.ts';

describe('satellite fires panel polish', () => {
  it('averages region detection coords for map focus', () => {
    assert.deepEqual(
      regionMapFocus({
        fires: [
          { location: { latitude: 10, longitude: 20 } },
          { location: { latitude: 12, longitude: 24 } },
        ],
      }),
      { lat: 11, lon: 22 },
    );
    assert.equal(regionMapFocus({ fires: [] }), null);
    assert.equal(regionMapFocus({ fires: [{ location: { latitude: 0, longitude: 0 } }] }), null);
  });

  it('wires row click and distinct empty state', () => {
    const panel = readFileSync(new URL('../src/components/SatelliteFiresPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /data-fire-focus/);
    assert.match(panel, /setRegionClickHandler/);
    assert.match(panel, /satellite-fires-empty/);
    assert.match(panel, /components\.satelliteFires\.empty/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /satellite-fires/);
    assert.match(layout, /setRegionClickHandler/);
  });
});
