import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('calm empty cot + liquidity', () => {
  for (const name of ['CotPositioningPanel', 'LiquidityShiftsPanel']) {
    it(`${name} load failure uses panel-empty`, () => {
      const src = readFileSync(new URL(`../src/components/${name}.ts`, import.meta.url), 'utf8');
      assert.match(src, /panel-empty/);
      assert.doesNotMatch(src, /showError\(e instanceof Error/);
    });
  }
});
