import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('pinned webcams map focus', () => {
  it('wires title/row Map focus without stealing toggle/unpin clicks', () => {
    const panel = readFileSync(new URL('../src/components/PinnedWebcamsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /data-webcam-lat/);
    assert.match(panel, /data-webcam-lng/);
    assert.match(panel, /pinned-webcam-map-focus/);
    assert.match(panel, /pinned-webcam-map/);
    assert.match(panel, /closest\('button, a, iframe'\)/);
    assert.match(panel, /keydown/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    const block = layout.match(
      /lazyPanel\('windy-webcams'[\s\S]*?return p;\s*\}\),\s*\);/,
    )?.[0] ?? '';
    assert.match(block, /setLocationClickHandler/);
    assert.match(block, /setCenter\(lat, lon, 7\)/);
    assert.match(block, /flashLocation\(lat, lon, 3000\)/);

    const store = readFileSync(new URL('../src/services/webcams/pinned-store.ts', import.meta.url), 'utf8');
    assert.match(store, /lat: number/);
    assert.match(store, /lng: number/);
  });
});
