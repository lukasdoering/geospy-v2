import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('trade policy map focus', () => {
  it('wires restriction/barrier cards to map focus + panel-layout handler', () => {
    const panel = readFileSync(new URL('../src/components/TradePolicyPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveFuelShortageMapFocus/);
    assert.match(panel, /data-trade-country/);
    assert.match(panel, /trade-card-clickable/);
    assert.match(panel, /handleContentKeydown/);
    assert.match(panel, /tabindex="0"/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /trade-policy[\s\S]*?setLocationClickHandler/);
  });
});
