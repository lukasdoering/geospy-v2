import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('panel → map layer enable', () => {
  it('enables related layers when focusing from panels', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /applyMapLayerChange\?\.\('diseaseOutbreaks'/);
    assert.match(layout, /applyMapLayerChange\?\.\('outages'/);
    assert.match(layout, /applyMapLayerChange\?\.\('natural'/);
    assert.match(layout, /applyMapLayerChange\?\.\('ucdpEvents'/);
    assert.match(layout, /applyMapLayerChange\?\.\('climate'/);
    assert.match(layout, /applyMapLayerChange\?\.\('displacement'/);
    assert.match(layout, /applyMapLayerChange\?\.\('radiationWatch'/);
    assert.match(layout, /thermal-escalation[\s\S]*applyMapLayerChange\?\.\('natural'/);
  });
});
