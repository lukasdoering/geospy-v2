import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('calm empty debt / gulf / climate', () => {
  it('NationalDebt load failure uses panel-empty', () => {
    const src = readFileSync(new URL('../src/components/NationalDebtPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /Error fetching data:[\s\S]*?panel-empty/);
    assert.doesNotMatch(src, /showError\('Failed to load national debt data'\)/);
  });

  it('GulfEconomies catch and rateLimited use panel-empty', () => {
    const src = readFileSync(new URL('../src/components/GulfEconomiesPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /catch \(err\)[\s\S]*?panel-empty/);
    assert.match(src, /rateLimited[\s\S]*?panel-empty/);
    assert.doesNotMatch(src, /showError\(t\('common\.failedMarketData'\)/);
    assert.doesNotMatch(src, /showError\(t\('common\.rateLimitedMarket'\)/);
  });

  it('ClimateNews load failure uses panel-empty', () => {
    const src = readFileSync(new URL('../src/components/ClimateNewsPanel.ts', import.meta.url), 'utf8');
    assert.match(src, /catch \(err\)[\s\S]*?panel-empty/);
    assert.doesNotMatch(src, /showError\(t\('components\.climateNews\.loadError'\)/);
  });
});
