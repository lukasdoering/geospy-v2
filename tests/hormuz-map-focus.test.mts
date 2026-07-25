import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('hormuz tracker map focus', () => {
  it('wires Show on map to openChokepoint(hormuz_strait)', () => {
    const panel = readFileSync(new URL('../src/components/HormuzPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /data-role="hz-show-map"/);
    assert.match(panel, /hormuz-show-on-map/);
    assert.match(panel, /setMapFocusHandler/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /hormuz-tracker/);
    assert.match(layout, /setMapFocusHandler/);
    assert.match(layout, /openChokepoint\?\.\('hormuz_strait'\)/);
  });
});
