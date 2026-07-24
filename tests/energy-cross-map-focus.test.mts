import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveTheaterMapFocus } from '../src/utils/theater-map-focus.ts';

describe('energy risk + cross-source map focus', () => {
  it('resolves common theater labels', () => {
    const me = resolveTheaterMapFocus('Middle East');
    assert.ok(me);
    assert.ok(Number.isFinite(me.lat));
    assert.ok(Number.isFinite(me.lon));
    assert.ok(resolveTheaterMapFocus('Red Sea'));
    assert.ok(resolveTheaterMapFocus('South China Sea'));
    assert.equal(resolveTheaterMapFocus(''), null);
  });

  it('wires Energy Risk Hormuz tile to openChokepoint', () => {
    const panel = readFileSync(new URL('../src/components/EnergyRiskOverviewPanel.ts', import.meta.url), 'utf8');
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(panel, /setHormuzFocusHandler/);
    assert.match(panel, /ero-tile-hormuz/);
    assert.match(layout, /energy-risk-overview[\s\S]*?openChokepoint\?\.\('hormuz_strait'\)/);
  });

  it('wires Cross-Source signal cards to theater map focus', () => {
    const panel = readFileSync(new URL('../src/components/CrossSourceSignalsPanel.ts', import.meta.url), 'utf8');
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveTheaterMapFocus/);
    assert.match(panel, /css-theater-clickable/);
    assert.match(layout, /cross-source-signals[\s\S]*?setLocationClickHandler/);
  });
});
