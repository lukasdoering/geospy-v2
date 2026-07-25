import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BOARD_REGIONS } from '../src/components/regional-intelligence-board-utils.ts';
import { resolveTheaterMapFocus } from '../src/utils/theater-map-focus.ts';

describe('regional intelligence map focus', () => {
  it('resolves every board region label to a theater centroid', () => {
    for (const region of BOARD_REGIONS) {
      const focus = resolveTheaterMapFocus(region.label);
      assert.ok(focus, `missing theater focus for ${region.id} (${region.label})`);
      assert.ok(Number.isFinite(focus.lat));
      assert.ok(Number.isFinite(focus.lon));
    }
  });

  it('exposes a Map control and wires setLocationClickHandler in panel-layout', () => {
    const panel = readFileSync(new URL('../src/components/RegionalIntelligenceBoard.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveTheaterMapFocus/);
    assert.match(panel, /rib-map-btn/);
    assert.match(panel, /focusCurrentRegionOnMap/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    const block = layout.match(
      /lazyPanel\('regional-intelligence'[\s\S]*?return p;\s*\},\s*\),\s*\);/,
    )?.[0] ?? '';
    assert.match(block, /setLocationClickHandler/);
    assert.match(block, /setCenter\(lat, lon, 3\)/);
  });
});
