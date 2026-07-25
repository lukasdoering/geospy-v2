import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('energy disruptions enable destination panels', () => {
  it('enables pipeline/storage panels before open-detail events', () => {
    const panel = readFileSync(new URL('../src/components/EnergyDisruptionsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /CustomEvent\('enable-panel'/);
    assert.match(panel, /pipeline-status/);
    assert.match(panel, /storage-facility-map/);
    assert.match(panel, /energy:open-pipeline-detail/);
    assert.match(panel, /energy:open-storage-facility-detail/);
    assert.match(panel, /setTimeout/);
  });

  it('focuses the map from cached registries + wires layout layer enable', () => {
    const panel = readFileSync(new URL('../src/components/EnergyDisruptionsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /focusAssetOnMap/);
    assert.match(panel, /resolvePipelineMapFocus/);
    assert.match(panel, /resolveStorageFacilityMapFocus/);
    assert.match(panel, /ed-row-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /handleContentKeydown/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /energy-disruptions[\s\S]*?setLocationClickHandler/);
    assert.match(layout, /energy-disruptions[\s\S]*?applyMapLayerChange\?\.\('pipelines'/);
    assert.match(layout, /energy-disruptions[\s\S]*?applyMapLayerChange\?\.\('storageFacilities'/);
  });
});
