import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('breaking news enable + scroll panel', () => {
  it('enables the target panel before scrolling/highlighting', () => {
    const banner = readFileSync(new URL('../src/components/BreakingNewsBanner.ts', import.meta.url), 'utf8');
    assert.match(banner, /CustomEvent\('enable-panel'/);
    assert.match(banner, /wm:reveal-panel/);
    assert.match(banner, /deadline/);
    assert.match(banner, /search-highlight/);
  });
});
