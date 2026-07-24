import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('global procurement map focus', () => {
  it('wires tender cards with ISO2 country to map focus', () => {
    const panel = readFileSync(new URL('../src/components/GlobalProcurementPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveFuelShortageMapFocus/);
    assert.match(panel, /data-procurement-country/);
    assert.match(panel, /global-procurement-card-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /global-procurement[\s\S]*?setLocationClickHandler/);
  });
});
