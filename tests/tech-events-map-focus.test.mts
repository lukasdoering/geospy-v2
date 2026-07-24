import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('tech events map focus', () => {
  it('wires panel pin → setCenter + techEvents layer enable', () => {
    const panel = readFileSync(new URL('../src/components/TechEventsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /onMapFocus/);
    assert.doesNotMatch(panel, /tech-event-location/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /TechEventsPanel/);
    assert.match(layout, /setLocationClickHandler/);
    assert.match(layout, /applyMapLayerChange\?\.\('techEvents'/);

    const search = readFileSync(new URL('../src/app/search-manager.ts', import.meta.url), 'utf8');
    assert.match(search, /case 'techevent'/);
    assert.match(search, /setCenter\(lat, lng, 5\)/);
  });
});
