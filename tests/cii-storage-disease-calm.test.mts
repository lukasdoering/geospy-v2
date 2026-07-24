import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('CII map focus + storage/disease/procurement calm empties', () => {
  it('CII country click also focuses the map before opening the brief', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /cii[\s\S]*?setCountryClickHandler[\s\S]*?resolveCountryMapFocus[\s\S]*?openCountryBrief/);
  });

  it('Storage / Disease / Procurement use calm empty when unavailable', () => {
    const storage = readFileSync(new URL('../src/components/StorageFacilityMapPanel.ts', import.meta.url), 'utf8');
    const disease = readFileSync(new URL('../src/components/DiseaseOutbreaksPanel.ts', import.meta.url), 'utf8');
    const procurement = readFileSync(new URL('../src/components/GlobalProcurementPanel.ts', import.meta.url), 'utf8');
    assert.match(storage, /upstreamUnavailable[\s\S]*?panel-empty/);
    assert.match(disease, /panel-empty/);
    assert.match(procurement, /showUnavailable[\s\S]*?panel-empty/);
  });
});
