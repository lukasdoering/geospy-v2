import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('macro tiles map focus + market calm empties', () => {
  it('wires Macro Tiles Show on map to region focus', () => {
    const panel = readFileSync(new URL('../src/components/MacroTilesPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /data-macro-map/);
    assert.match(panel, /REGION_MAP_FOCUS/);
    assert.match(panel, /panel-empty/);
  });

  it('National Debt / Fear & Greed / FSI / Gold use calm empty for unavailable', () => {
    const debt = readFileSync(new URL('../src/components/NationalDebtPanel.ts', import.meta.url), 'utf8');
    const fg = readFileSync(new URL('../src/components/FearGreedPanel.ts', import.meta.url), 'utf8');
    const fsi = readFileSync(new URL('../src/components/FSIPanel.ts', import.meta.url), 'utf8');
    const gold = readFileSync(new URL('../src/components/GoldIntelligencePanel.ts', import.meta.url), 'utf8');
    assert.match(debt, /if \(this\.entries\.length === 0\) \{[\s\S]*?panel-empty/);
    assert.match(fg, /panel-empty/);
    assert.match(fsi, /panel-empty/);
    assert.match(gold, /panel-empty/);
  });

  it('panel-layout wires macro-tiles location handler', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /macro-tiles[\s\S]*?setLocationClickHandler/);
  });
});
