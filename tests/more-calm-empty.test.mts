import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('more calm empties for unavailable registries/markets', () => {
  it('energy registries use panel-empty when unavailable', () => {
    const pipeline = readFileSync(new URL('../src/components/PipelineStatusPanel.ts', import.meta.url), 'utf8');
    const fuel = readFileSync(new URL('../src/components/FuelShortagePanel.ts', import.meta.url), 'utf8');
    const disruptions = readFileSync(new URL('../src/components/EnergyDisruptionsPanel.ts', import.meta.url), 'utf8');
    assert.match(pipeline, /upstreamUnavailable[\s\S]*?panel-empty/);
    assert.match(fuel, /upstreamUnavailable[\s\S]*?panel-empty/);
    assert.match(disruptions, /upstreamUnavailable[\s\S]*?panel-empty/);
  });

  it('earnings / WSB / oil / ETF / cross-source use calm empty for no data', () => {
    const earnings = readFileSync(new URL('../src/components/EarningsCalendarPanel.ts', import.meta.url), 'utf8');
    const wsb = readFileSync(new URL('../src/components/WsbTickerScannerPanel.ts', import.meta.url), 'utf8');
    const oil = readFileSync(new URL('../src/components/OilInventoriesPanel.ts', import.meta.url), 'utf8');
    const etf = readFileSync(new URL('../src/components/ETFFlowsPanel.ts', import.meta.url), 'utf8');
    const css = readFileSync(new URL('../src/components/CrossSourceSignalsPanel.ts', import.meta.url), 'utf8');
    assert.match(earnings, /panel-empty/);
    assert.match(wsb, /panel-empty/);
    assert.match(oil, /parts\.length === 0[\s\S]*?panel-empty/);
    assert.match(oil, /!resp\.ok[\s\S]*?panel-empty/);
    const breadth = readFileSync(new URL('../src/components/MarketBreadthPanel.ts', import.meta.url), 'utf8');
    assert.match(breadth, /resp\.unavailable[\s\S]*?panel-empty/);
    assert.match(etf, /this\.error \|\| !this\.data[\s\S]*?panel-empty/);
    assert.match(css, /showFetchError[\s\S]*?panel-empty/);
    assert.match(css, /Signal aggregator is initializing[\s\S]*?panel-empty|panel-empty[\s\S]*?Signal aggregator is initializing/);
  });
});
