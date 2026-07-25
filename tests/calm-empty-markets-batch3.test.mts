import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const panels = [
  ['BigMacPanel', 'src/components/BigMacPanel.ts'],
  ['GroceryBasketPanel', 'src/components/GroceryBasketPanel.ts'],
  ['FuelPricesPanel', 'src/components/FuelPricesPanel.ts'],
  ['FaoFoodPriceIndexPanel', 'src/components/FaoFoodPriceIndexPanel.ts'],
  ['FearGreedPanel', 'src/components/FearGreedPanel.ts'],
  ['FSIPanel', 'src/components/FSIPanel.ts'],
];

describe('calm empty markets batch 3', () => {
  for (const [name, rel] of panels) {
    it(`${name} load failure uses panel-empty`, () => {
      const src = readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8');
      assert.match(src, /panel-empty/);
      assert.doesNotMatch(src, /showError\(t\('common\.failedMarketData'\)/);
      assert.doesNotMatch(src, /showError\(e instanceof Error/);
    });
  }
});
