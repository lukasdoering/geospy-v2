import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('markets / commodities terminal chart polish', () => {
  it('dismisses market chart hint and opens charts from commodities rows', () => {
    const panel = readFileSync(new URL('../src/components/MarketPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /geospy-market-chart-hint-dismissed/);
    assert.match(panel, /data-market-chart-hint-dismiss/);
    assert.match(panel, /data-commodity-chart/);
    assert.match(panel, /commodity-item-clickable/);
    assert.match(panel, /openMarketChartModal/);

    const modal = readFileSync(new URL('../src/components/market-chart-modal.ts', import.meta.url), 'utf8');
    assert.match(modal, /export interface ChartableSeries/);
    assert.match(modal, /sparkline\?: number\[]/);

    const handlers = readFileSync(new URL('../src/app/event-handlers.ts', import.meta.url), 'utf8');
    assert.match(handlers, /BRAND\.name\} live map preview/);
  });
});
