import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('calm empty strategic risk', () => {
  it('StrategicRiskPanel risk overview failures use panel-empty', () => {
    const src = readFileSync(new URL('../src/components/StrategicRiskPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /failedRiskOverview[\s\S]*?panel-empty|panel-empty[\s\S]*?failedRiskOverview/);
    assert.doesNotMatch(src, /showError\(t\('common\.failedRiskOverview'\)/);
  });
});
