import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveTheaterMapFocus } from '../src/utils/theater-map-focus.ts';

describe('renewable + energy risk sibling map focus', () => {
  it('resolves renewable World Bank region names', () => {
    assert.ok(resolveTheaterMapFocus('Latin America & Caribbean'));
    assert.ok(resolveTheaterMapFocus('Sub-Saharan Africa'));
    assert.ok(resolveTheaterMapFocus('Europe & Central Asia'));
    assert.ok(resolveTheaterMapFocus('Middle East & N. Africa'));
    assert.ok(resolveTheaterMapFocus('East Asia & Pacific'));
    assert.ok(resolveTheaterMapFocus('North America'));
    assert.ok(resolveTheaterMapFocus('South Asia'));
  });

  it('wires Renewable region rows to map focus', () => {
    const panel = readFileSync(new URL('../src/components/RenewableEnergyPanel.ts', import.meta.url), 'utf8');
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveTheaterMapFocus/);
    assert.match(panel, /region-row-clickable/);
    assert.match(layout, /renewable[\s\S]*?setLocationClickHandler/);
  });

  it('wires Energy Risk EU Gas and disruptions tiles', () => {
    const panel = readFileSync(new URL('../src/components/EnergyRiskOverviewPanel.ts', import.meta.url), 'utf8');
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(panel, /setEuGasFocusHandler/);
    assert.match(panel, /setDisruptionsFocusHandler/);
    assert.match(panel, /data-ero-action="eu-gas"/);
    assert.match(panel, /data-ero-action="disruptions"/);
    assert.match(layout, /setEuGasFocusHandler/);
    assert.match(layout, /setDisruptionsFocusHandler/);
  });
});
