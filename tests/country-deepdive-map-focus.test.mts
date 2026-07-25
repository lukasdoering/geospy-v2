import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('country deep dive map focus', () => {
  it('wires bases, ports, infra, suppliers, and chokepoints to map focus', () => {
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
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /openChokepoint/);
    assert.match(panel, /cdp-risk-chokepoint-chip/);
    assert.match(panel, /cdp-chokepoint-fallback-row/);
    assert.match(panel, /partnerIso2/);
    assert.match(panel, /makeNewsMapChip/);
    assert.match(panel, /cdp-news-map/);
    assert.match(panel, /cdp-atlas-row/);
    assert.match(panel, /stopPropagation/);

    const css = readFileSync(new URL('../src/styles/country-deep-dive.css', import.meta.url), 'utf8');
    assert.match(css, /\.cdp-base-item--map/);
    assert.match(css, /\.cdp-map-cell/);
    assert.match(css, /\.cdp-news-map/);
  });
});
