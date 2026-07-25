import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('live webcams map focus', () => {
  it('ships city-level FEED_COORDS and wires Map controls to panel-layout', () => {
    const panel = readFileSync(new URL('../src/components/LiveWebcamsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /FEED_COORDS/);
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveFeedFocus/);
    assert.match(panel, /webcam-map-btn/);
    assert.match(panel, /webcam-preview-map/);
    assert.match(panel, /jerusalem:\s*\{\s*lat:\s*31\.78/);
    assert.match(panel, /kyiv:\s*\{\s*lat:\s*50\.45/);
    assert.match(panel, /taipei:\s*\{\s*lat:\s*25\.03/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    const block = layout.match(
      /lazyPanel\('live-webcams'[\s\S]*?return p;\s*\}\),\s*\);/,
    )?.[0] ?? '';
    assert.match(block, /setLocationClickHandler/);
    assert.match(block, /setCenter\(lat, lon, 6\)/);
    assert.match(block, /flashLocation\(lat, lon, 3000\)/);
  });
});
