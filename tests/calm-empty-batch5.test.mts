import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const panels = [
  'DiseaseOutbreaksPanel',
  'MacroTilesPanel',
  'EconomicCalendarPanel',
  'SocialVelocityPanel',
  'StorageFacilityMapPanel',
  'EnergyDisruptionsPanel',
  'FuelShortagePanel',
  'PipelineStatusPanel',
];

describe('calm empty batch 5', () => {
  for (const name of panels) {
    it(`${name} error path uses panel-empty`, () => {
      const src = readFileSync(new URL(`../src/components/${name}.ts`, import.meta.url), 'utf8');
      assert.match(src, /panel-empty/);
    });
  }

  it('energy registry catch paths no longer use showError strings', () => {
    for (const name of ['StorageFacilityMapPanel', 'EnergyDisruptionsPanel', 'FuelShortagePanel', 'PipelineStatusPanel']) {
      const src = readFileSync(new URL(`../src/components/${name}.ts`, import.meta.url), 'utf8');
      assert.doesNotMatch(src, /showError\('(Storage registry error|Energy disruptions log error|Fuel shortage registry error|Pipeline registry error)'/);
    }
  });
});
