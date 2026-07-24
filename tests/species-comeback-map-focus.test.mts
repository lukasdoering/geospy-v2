import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('species comeback map focus', () => {
  it('makes recovery-zone cards clickable and wires map focus in panel-layout', () => {
    const panel = readFileSync(new URL('../src/components/SpeciesComebackPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /species-card-clickable/);
    assert.match(panel, /recoveryZone/);
    assert.match(panel, /data-lat/);
    assert.match(panel, /keydown/);
    assert.match(panel, /species-map-chip/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    const speciesBlock = layout.match(
      /lazyImportedPanel\('species'[\s\S]*?return p;\s*\}\);/,
    )?.[0] ?? '';
    assert.match(speciesBlock, /setLocationClickHandler/);
    assert.match(speciesBlock, /setCenter\(lat, lon, 5\)/);
    assert.match(speciesBlock, /flashLocation\(lat, lon, 3000\)/);

    const data = readFileSync(new URL('../src/data/conservation-wins.json', import.meta.url), 'utf8');
    assert.match(data, /"recoveryZone"/);
    const zones = data.match(/"recoveryZone"/g) ?? [];
    assert.ok(zones.length >= 10, `expected ≥10 recovery zones, got ${zones.length}`);
  });
});
