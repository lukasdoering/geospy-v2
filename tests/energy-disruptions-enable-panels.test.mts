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
});
