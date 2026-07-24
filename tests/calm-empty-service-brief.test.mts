import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('calm empty service status + latest brief', () => {
  it('ServiceStatusPanel error uses panel-empty', () => {
    const src = readFileSync(new URL('../src/components/ServiceStatusPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /if \(this\.error\)[\s\S]*?panel-empty/);
    assert.doesNotMatch(src, /showError\(this\.error/);
  });

  it('LatestBriefPanel catch uses panel-empty when present', () => {
    const src = readFileSync(new URL('../src/components/LatestBriefPanel.ts', import.meta.url), 'utf8');
    if (src.includes("Brief unavailable")) {
      assert.match(src, /Brief unavailable[\s\S]*?panel-empty|panel-empty[\s\S]*?Brief unavailable/);
      assert.doesNotMatch(src, /showError\(message/);
    }
  });
});
