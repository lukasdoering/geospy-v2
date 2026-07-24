import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('calm empty news + cascade', () => {
  it('NewsPanel empty feed uses panel-empty', () => {
    const src = readFileSync(new URL('../src/components/NewsPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /noNewsAvailable[\s\S]*?panel-empty|panel-empty[\s\S]*?noNewsAvailable/);
    assert.doesNotMatch(src, /showError\(t\('common\.noNewsAvailable'\)\)/);
  });

  it('CascadePanel dependency graph failure uses panel-empty', () => {
    const src = readFileSync(new URL('../src/components/CascadePanel.ts', import.meta.url), 'utf8');
    assert.match(src, /failedDependencyGraph[\s\S]*?panel-empty|panel-empty[\s\S]*?failedDependencyGraph/);
    assert.doesNotMatch(src, /showError\(t\('common\.failedDependencyGraph'\)\)/);
  });
});
