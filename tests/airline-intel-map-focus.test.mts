import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveAirportMapFocus } from '../src/utils/airport-map-focus.ts';

describe('airline intel map focus', () => {
  it('resolves monitored airport IATA codes', () => {
    const ist = resolveAirportMapFocus('IST');
    assert.ok(ist);
    assert.equal(ist.iata, 'IST');
    assert.ok(Number.isFinite(ist.lat));
    assert.ok(Number.isFinite(ist.lon));
    assert.equal(resolveAirportMapFocus('ZZZ'), null);
    assert.equal(resolveAirportMapFocus(''), null);
  });

  it('wires ops and tracking rows to map focus', () => {
    const panel = readFileSync(new URL('../src/components/AirlineIntelPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveAirportMapFocus/);
    assert.match(panel, /ops-row-clickable/);
    assert.match(panel, /track-row-clickable/);
    assert.match(panel, /data-lat=/);
    assert.match(panel, /data-lon=/);
    assert.match(panel, /data-iata=/);
    assert.match(panel, /keydown/);
  });

  it('panel-layout wires airline-intel location handler', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /airline-intel[\s\S]*?setLocationClickHandler/);
  });
});
