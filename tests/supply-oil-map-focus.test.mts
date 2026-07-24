import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('supply chain + oil inventories map focus', () => {
  it('wires Supply Chain Map button to openChokepoint', () => {
    const panel = readFileSync(new URL('../src/components/SupplyChainPanel.ts', import.meta.url), 'utf8');
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(panel, /setChokepointFocusHandler/);
    assert.match(panel, /sc-map-focus/);
    assert.match(panel, /data-chokepoint-map/);
    assert.match(layout, /supply-chain[\s\S]*?setChokepointFocusHandler[\s\S]*?openChokepoint/);
  });

  it('wires Oil Inventories IEA country chips to map focus', () => {
    const panel = readFileSync(new URL('../src/components/OilInventoriesPanel.ts', import.meta.url), 'utf8');
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /oil-iea-country/);
    assert.match(panel, /data-country=/);
    assert.match(layout, /oil-inventories[\s\S]*?setLocationClickHandler/);
  });
});
