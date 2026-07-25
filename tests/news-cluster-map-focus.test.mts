import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('news panel cluster map focus', () => {
  it('wires Map chips for geocoded clusters/items through panel-layout', () => {
    const panel = readFileSync(new URL('../src/components/NewsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /news-item-map/);
    assert.match(panel, /data-lat/);
    assert.match(panel, /data-lon/);
    assert.match(panel, /cluster\.lat/);
    assert.match(panel, /assetContext\?\.origin\.lat/);
    assert.match(panel, /stopPropagation/);
    assert.match(panel, /renderMapChip\(item\.lat, item\.lon\)/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    const block = layout.match(
      /private attachRelatedAssetHandlers\(panel: NewsPanel\): void \{[\s\S]*?\n  \}/,
    )?.[0] ?? '';
    assert.match(block, /setLocationClickHandler/);
    assert.match(block, /setCenter\(lat, lon, 4\)/);
    assert.match(block, /flashLocation\(lat, lon, 3000\)/);
  });
});
