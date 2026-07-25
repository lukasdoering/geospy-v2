import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('sanctions pressure map focus', () => {
  it('wires country/entry rows to map focus + panel-layout handler', () => {
    const panel = readFileSync(new URL('../src/components/SanctionsPressurePanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /sanctions-row-clickable/);
    assert.match(panel, /sanctions-entry-clickable/);
    assert.match(panel, /data-country-code/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /sanctions-pressure[\s\S]*?setLocationClickHandler/);
  });
});
