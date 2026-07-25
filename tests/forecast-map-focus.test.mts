import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('forecast map focus', () => {
  it('wires Map chip for country-resolvable forecast regions', () => {
    const panel = readFileSync(new URL('../src/components/ForecastPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /toIso2\(f\.region/);
    assert.match(panel, /data-fc-map-country/);
    assert.match(panel, /fc-map-toggle/);
    assert.match(panel, /keydown/);
  });

  it('panel-layout wires forecast location handler', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /forecast[\s\S]*?setLocationClickHandler/);
  });
});
