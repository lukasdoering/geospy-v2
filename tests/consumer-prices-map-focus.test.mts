import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('consumer prices world tab map focus', () => {
  it('wires World inflation rows to map focus + panel-layout handler', () => {
    const panel = readFileSync(new URL('../src/components/ConsumerPricesPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /data-cp-country/);
    assert.match(panel, /cp-global-row-clickable/);
    assert.match(panel, /handleKeydown/);
    assert.match(panel, /tabindex="0"/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /consumer-prices[\s\S]*?setLocationClickHandler/);
  });
});
