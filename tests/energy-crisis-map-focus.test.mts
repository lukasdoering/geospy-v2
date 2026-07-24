import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('energy crisis map focus', () => {
  it('wires policy rows to country map focus + panel-layout handler', () => {
    const panel = readFileSync(new URL('../src/components/EnergyCrisisPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveFuelShortageMapFocus/);
    assert.match(panel, /ecp-policy-row-clickable/);
    assert.match(panel, /data-country-code/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /energy-crisis[\s\S]*?setLocationClickHandler/);
  });
});
