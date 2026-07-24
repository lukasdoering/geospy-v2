import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('world clock map focus', () => {
  it('ships CITY_COORDS for exchange cities and wires map focus without drag conflicts', () => {
    const panel = readFileSync(new URL('../src/components/WorldClockPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /CITY_COORDS/);
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /wc-row-clickable/);
    assert.match(panel, /wc-map-chip/);
    assert.match(panel, /suppressClickUntil/);
    assert.match(panel, /wc-drag-handle/);
    assert.match(panel, /'new-york':\s*\{\s*lat:\s*40\.71/);
    assert.match(panel, /tokyo:\s*\{\s*lat:\s*35\.68/);
    assert.match(panel, /dubai:\s*\{\s*lat:\s*25\.20/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    const block = layout.match(
      /lazyPanel\('world-clock'[\s\S]*?return p;\s*\}\),\s*\);/,
    )?.[0] ?? '';
    assert.match(block, /setLocationClickHandler/);
    assert.match(block, /setCenter\(lat, lon, 6\)/);
    assert.match(block, /flashLocation\(lat, lon, 3000\)/);
  });
});
