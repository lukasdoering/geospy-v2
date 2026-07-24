import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { OREF_MAP_FOCUS } from '../src/utils/oref-map-focus.ts';

describe('oref sirens map focus', () => {
  it('exports Tel Aviv focus coords', () => {
    assert.equal(OREF_MAP_FOCUS.lat, 32.0853);
    assert.equal(OREF_MAP_FOCUS.lon, 34.7818);
  });

  it('wires keyboard/clickable rows to panel-layout map focus', () => {
    const panel = readFileSync(new URL('../src/components/OrefSirensPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /data-oref-focus/);
    assert.match(panel, /oref-row-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /oref-map-focus/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /oref-sirens/);
    assert.match(layout, /setLocationClickHandler/);
  });
});
