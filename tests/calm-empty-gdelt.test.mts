import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('calm empty gdelt / tech events / defense patents', () => {
  it('GdeltIntelPanel load failure uses panel-empty', () => {
    const src = readFileSync(new URL('../src/components/GdeltIntelPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /Load error:[\s\S]*?panel-empty/);
    assert.doesNotMatch(src, /showError\(t\('common\.failedIntelFeed'\)/);
  });

  it('TechEventsPanel error state uses panel-empty', () => {
    const src = readFileSync(new URL('../src/components/TechEventsPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /if \(this\.error\)[\s\S]*?panel-empty/);
    assert.doesNotMatch(src, /showError\(this\.error/);
  });

  it('DefensePatentsPanel error state uses panel-empty', () => {
    const src = readFileSync(new URL('../src/components/DefensePatentsPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /if \(this\.error\)[\s\S]*?panel-empty/);
    assert.doesNotMatch(src, /showError\(this\.error/);
  });
});
