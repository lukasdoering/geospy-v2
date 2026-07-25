import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('country deep dive map focus', () => {
  it('wires bases, ports, and infra rows to map focus with keyboard a11y', () => {
    const panel = readFileSync(
      new URL('../src/components/CountryDeepDivePanel.ts', import.meta.url),
      'utf8',
    );
    assert.match(panel, /makeMapFocusRow/);
    assert.match(panel, /cdp-base-item--map/);
    assert.match(panel, /focusBaseOnMap/);
    assert.match(panel, /focusCoordsOnMap/);
    assert.match(panel, /focusAssetOnMap/);
    assert.match(panel, /triggerBaseClick/);
    assert.match(panel, /flashLocation/);
    assert.match(panel, /role', 'button'/);
    assert.match(panel, /e\.key !== 'Enter' && e\.key !== ' '/);
    assert.match(panel, /nearbyPorts/);

    const css = readFileSync(new URL('../src/styles/country-deep-dive.css', import.meta.url), 'utf8');
    assert.match(css, /\.cdp-base-item--map/);
  });
});
