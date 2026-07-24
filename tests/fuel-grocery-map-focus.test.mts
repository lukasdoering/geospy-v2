import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('fuel prices + grocery basket map focus', () => {
  it('wires Fuel Prices country rows to map focus with calm empty', () => {
    const panel = readFileSync(new URL('../src/components/FuelPricesPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /fp-row-clickable/);
    assert.match(panel, /data-country-code/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /panel-empty/);
  });

  it('wires Grocery Basket country headers to map focus with calm empty', () => {
    const panel = readFileSync(new URL('../src/components/GroceryBasketPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /gb-country-clickable/);
    assert.match(panel, /data-country-code/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /panel-empty/);
  });

  it('FAO Food Price Index uses calm empty instead of error for no points', () => {
    const panel = readFileSync(new URL('../src/components/FaoFoodPriceIndexPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /if \(!data\.points\?\.length\) \{[\s\S]*?panel-empty[\s\S]*?common\.noDataAvailable/);
    assert.doesNotMatch(panel, /if \(!data\.points\?\.length\) \{[\s\S]*?showError/);
  });

  it('panel-layout wires fuel-prices and grocery-basket handlers', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /fuel-prices[\s\S]*?setLocationClickHandler/);
    assert.match(layout, /grocery-basket[\s\S]*?setLocationClickHandler/);
  });
});
