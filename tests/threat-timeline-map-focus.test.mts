import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('threat timeline map focus', () => {
  it('wires Map chips through countryCode/lat-lon and panel-layout', () => {
    const utils = readFileSync(new URL('../src/components/threat-timeline-utils.ts', import.meta.url), 'utf8');
    assert.match(utils, /countryCode\?:/);
    assert.match(utils, /lat\?:/);
    assert.match(utils, /lon\?:/);
    assert.match(utils, /story\.countryCode/);
    assert.match(utils, /cluster\.lat/);

    const panel = readFileSync(new URL('../src/components/ThreatTimelinePanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /threat-timeline-map/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /data-focus/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    const block = layout.match(
      /lazyPanel\('threat-timeline'[\s\S]*?return p;\s*\}\),\s*\);/,
    )?.[0] ?? '';
    assert.match(block, /setLocationClickHandler/);
    assert.match(block, /setCenter\(lat, lon, 4\)/);
  });
});
