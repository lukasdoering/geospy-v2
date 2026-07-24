import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  isUsableMapCoord,
  resolvePipelineMapFocus,
  resolveStorageFacilityMapFocus,
} from '../src/utils/energy-asset-map-focus.ts';

describe('energy asset map focus', () => {
  it('guards Null Island and invalid coords', () => {
    assert.equal(isUsableMapCoord(0, 0), false);
    assert.equal(isUsableMapCoord(Number.NaN, 10), false);
    assert.equal(isUsableMapCoord(25.2, 55.3), true);
  });

  it('resolves pipeline midpoint / storage location', () => {
    assert.deepEqual(
      resolvePipelineMapFocus({ lat: 10, lon: 20 }, { lat: 30, lon: 40 }),
      { lat: 20, lon: 30 },
    );
    assert.deepEqual(
      resolvePipelineMapFocus({ lat: 0, lon: 0 }, { lat: 12, lon: 45 }),
      { lat: 12, lon: 45 },
    );
    assert.equal(resolvePipelineMapFocus({ lat: 0, lon: 0 }, { lat: 0, lon: 0 }), null);
    assert.deepEqual(
      resolveStorageFacilityMapFocus({ lat: 25.2, lon: 55.3 }),
      { lat: 25.2, lon: 55.3 },
    );
    assert.equal(resolveStorageFacilityMapFocus({ lat: 0, lon: 0 }), null);
  });

  it('wires pipeline/storage panels + layout layer enable', () => {
    const pipeline = readFileSync(new URL('../src/components/PipelineStatusPanel.ts', import.meta.url), 'utf8');
    assert.match(pipeline, /setLocationClickHandler/);
    assert.match(pipeline, /resolvePipelineMapFocus/);
    assert.match(pipeline, /pp-row-clickable/);
    assert.match(pipeline, /tabindex="0"/);
    assert.match(pipeline, /keydown/);

    const storage = readFileSync(new URL('../src/components/StorageFacilityMapPanel.ts', import.meta.url), 'utf8');
    assert.match(storage, /setLocationClickHandler/);
    assert.match(storage, /resolveStorageFacilityMapFocus/);
    assert.match(storage, /sf-row-clickable/);
    assert.match(storage, /tabindex="0"/);
    assert.match(storage, /keydown/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /pipeline-status[\s\S]*?applyMapLayerChange\?\.\('pipelines'/);
    assert.match(layout, /storage-facility-map[\s\S]*?applyMapLayerChange\?\.\('storageFacilities'/);
  });
});
