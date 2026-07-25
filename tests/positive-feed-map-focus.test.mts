import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('positive news feed map focus', () => {
  it('adds Map chips for stories with lat/lon without stealing card links', () => {
    const panel = readFileSync(
      new URL('../src/components/PositiveNewsFeedPanel.ts', import.meta.url),
      'utf8',
    );
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /positive-card-map/);
    assert.match(panel, /data-lat/);
    assert.match(panel, /data-lon/);
    assert.match(panel, /stopPropagation/);
    assert.match(panel, /item\.lat !== undefined/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    const block = layout.match(
      /lazyImportedPanel\('positive-feed'[\s\S]*?return p;\s*\}\);/,
    )?.[0] ?? '';
    assert.match(block, /setLocationClickHandler/);
    assert.match(block, /setCenter\(lat, lon, 5\)/);
    assert.match(block, /flashLocation\(lat, lon, 3000\)/);
  });
});
