import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('gulf economies map focus', () => {
  it('wires country quote rows to map focus with calm empty', () => {
    const panel = readFileSync(new URL('../src/components/GulfEconomiesPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /gulf-quote-clickable/);
    assert.match(panel, /toIso2/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /panel-empty/);
    assert.doesNotMatch(panel, /if \(!data\.quotes\?\.length\) \{\s*const msg/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /gulf-economies[\s\S]*?setLocationClickHandler/);
  });
});
