import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('map affordance aria-label polish', () => {
  it('adds aria-labels to oil / supply-chain / forecast map controls', () => {
    const oil = readFileSync(new URL('../src/components/OilInventoriesPanel.ts', import.meta.url), 'utf8');
    assert.match(oil, /oil-iea-country[\s\S]*?aria-label="Show \$\{escapeHtml\(m\.iso2\)\} on map"/);

    const supply = readFileSync(new URL('../src/components/SupplyChainPanel.ts', import.meta.url), 'utf8');
    assert.match(supply, /sc-map-focus[\s\S]*?aria-label="Show \$\{escapeHtml\(cp\.name \|\| cp\.id\)\} on map"/);
    assert.match(supply, /sc-mineral-producer[\s\S]*?aria-label="Show \$\{escapeHtml\(code\)\} on map"/);

    const forecast = readFileSync(new URL('../src/components/ForecastPanel.ts', import.meta.url), 'utf8');
    assert.match(forecast, /fc-map-toggle[\s\S]*?aria-label="Show \$\{escapeHtml\(code\)\} on map"/);
  });
});
