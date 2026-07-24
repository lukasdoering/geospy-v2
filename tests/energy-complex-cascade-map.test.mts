import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('energy complex + cascade map focus', () => {
  it('wires Energy Complex IEA/LNG country rows to map focus', () => {
    const panel = readFileSync(new URL('../src/components/EnergyComplexPanel.ts', import.meta.url), 'utf8');
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /oil-stocks-row-clickable/);
    assert.match(panel, /m\.iso2/);
    assert.match(panel, /e\.iso2/);
    assert.match(layout, /energy-complex[\s\S]*?setLocationClickHandler/);
  });

  it('wires Cascade affected countries to map focus', () => {
    const panel = readFileSync(new URL('../src/components/CascadePanel.ts', import.meta.url), 'utf8');
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /cascade-country-clickable/);
    assert.match(panel, /c\.country/);
    assert.match(layout, /cascade[\s\S]*?setLocationClickHandler/);
  });

  it('InsightsPanel catch uses panel-empty', () => {
    const panel = readFileSync(new URL('../src/components/InsightsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /InsightsPanel\] Error:[\s\S]*?panel-empty/);
    assert.doesNotMatch(panel, /showError\(\)/);
  });
});
