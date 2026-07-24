import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('ucdp events map a11y', () => {
  it('makes UCDP rows keyboard-activatable for map focus', () => {
    const panel = readFileSync(new URL('../src/components/UcdpEventsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /ucdp-row-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /lat === 0 && lon === 0/);
    assert.match(panel, /setEventClickHandler/);
  });

  it('enables ucdpEvents layer from panel-layout on focus', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /applyMapLayerChange\?\.\('ucdpEvents'/);
  });
});
