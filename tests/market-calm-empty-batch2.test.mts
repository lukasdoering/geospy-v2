import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('market / energy calm empties batch 2', () => {
  it('Hormuz / Yield / AAII / Liquidity / COT / MacroSignals / Stablecoin / Chokepoint / EnergyCrisis use panel-empty', () => {
    const files = [
      'HormuzPanel.ts',
      'YieldCurvePanel.ts',
      'AAIISentimentPanel.ts',
      'LiquidityShiftsPanel.ts',
      'CotPositioningPanel.ts',
      'MacroSignalsPanel.ts',
      'StablecoinPanel.ts',
      'ChokepointStripPanel.ts',
      'EnergyCrisisPanel.ts',
    ];
    for (const name of files) {
      const src = readFileSync(new URL(`../src/components/${name}`, import.meta.url), 'utf8');
      assert.match(src, /panel-empty/, `${name} should use panel-empty`);
    }
  });
});
