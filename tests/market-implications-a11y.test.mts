import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('market implications chain-node a11y', () => {
  it('makes transmission chain nodes keyboard-activatable', () => {
    const panel = readFileSync(new URL('../src/components/MarketImplicationsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /chain-node/);
    assert.match(panel, /role="button"/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /e\.key !== 'Enter' && e\.key !== ' '/);
  });
});
