import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveFuelShortageMapFocus } from '../src/utils/fuel-shortage-map-focus.ts';

describe('fuel shortage map focus', () => {
  it('returns null without a resolvable country / hydrated geometry', () => {
    assert.equal(resolveFuelShortageMapFocus(''), null);
    assert.equal(resolveFuelShortageMapFocus(null), null);
    // Without hydrated country geometry (unit tests), centroid lookup is null.
    assert.equal(resolveFuelShortageMapFocus('NG'), null);
  });

  it('wires panel rows + layout map focus with fuelShortages layer enable', () => {
    const panel = readFileSync(new URL('../src/components/FuelShortagePanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveFuelShortageMapFocus/);
    assert.match(panel, /fs-row-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /data-country/);

    const helpers = readFileSync(new URL('../src/utils/fuel-shortage-map-focus.ts', import.meta.url), 'utf8');
    assert.match(helpers, /getCountryCentroid/);
    assert.match(helpers, /toIso2/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /fuel-shortages[\s\S]*?setLocationClickHandler/);
    assert.match(layout, /applyMapLayerChange\?\.\('fuelShortages'/);
  });
});
