import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('calm empty mcp data panel', () => {
  it('McpDataPanel failures use panel-empty', () => {
    const src = readFileSync(new URL('../src/components/McpDataPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /panel-empty/);
    assert.doesNotMatch(src, /this\.showError\(/);
  });
});
