import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('calm empty prediction + daily brief', () => {
  it('PredictionPanel empty markets use panel-empty', () => {
    const src = readFileSync(new URL('../src/components/PredictionPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /data\.length === 0[\s\S]*?panel-empty/);
    assert.doesNotMatch(src, /showError\(t\('common\.failedPredictions'\)\)/);
  });

  it('DailyMarketBriefPanel showUnavailable uses panel-empty', () => {
    const src = readFileSync(new URL('../src/components/DailyMarketBriefPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /showUnavailable[\s\S]*?panel-empty/);
    assert.doesNotMatch(src, /showUnavailable[\s\S]*?showError\(message\)/);
  });
});
