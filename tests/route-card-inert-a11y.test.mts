import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('route card inert a11y', () => {
  it('unavailable/proposed corridor cards are removed from tab order', () => {
    const src = readFileSync(
      new URL('../src/components/RouteExplorer/components/RouteCard.ts', import.meta.url),
      'utf8',
    );
    assert.match(src, /tabindex.*isDisabled \? '-1' : '0'|isDisabled \? '-1' : '0'/);
    assert.match(src, /aria-disabled/);
    assert.match(src, /if \(!isDisabled\)/);
  });
});
