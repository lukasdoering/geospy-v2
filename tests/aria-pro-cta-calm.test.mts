import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('aria polish + web Pro CTA fallbacks + stress calm empty', () => {
  it('adds aria-labels on cascade, strategic risk, economic, energy complex, pinned webcams', () => {
    const cascade = readFileSync(new URL('../src/components/CascadePanel.ts', import.meta.url), 'utf8');
    assert.match(cascade, /cascade-country-clickable[\s\S]*?aria-label="Show/);

    const strategic = readFileSync(new URL('../src/components/StrategicRiskPanel.ts', import.meta.url), 'utf8');
    assert.match(strategic, /risk-item-clickable[\s\S]*?aria-label="Show top risk on map"/);
    assert.match(strategic, /aria-label="Show \$\{escapeHtml\(alert\.title\)\} on map"/);

    const economic = readFileSync(new URL('../src/components/EconomicPanel.ts', import.meta.url), 'utf8');
    assert.match(economic, /economic-indicator-clickable[\s\S]*?aria-label="Show/);

    const complex = readFileSync(new URL('../src/components/EnergyComplexPanel.ts', import.meta.url), 'utf8');
    assert.match(complex, /oil-stocks-row-clickable[\s\S]*?aria-label="Show \$\{escapeHtml\(m\.iso2\)\} on map"/);
    assert.match(complex, /aria-label="Show \$\{escapeHtml\(e\.iso2\)\} on map"/);

    const pinned = readFileSync(new URL('../src/components/PinnedWebcamsPanel.ts', import.meta.url), 'utf8');
    assert.match(pinned, /setAttribute\('aria-label'/);
  });

  it('routes web checkout fallbacks to /pro while desktop keeps upstream', () => {
    const panel = readFileSync(new URL('../src/components/Panel.ts', import.meta.url), 'utf8');
    assert.match(panel, /isDesktopRuntime\(\)[\s\S]*?worldmonitor\.app\/pro[\s\S]*?window\.open\('\/pro'/);

    const settings = readFileSync(new URL('../src/components/UnifiedSettings.ts', import.meta.url), 'utf8');
    assert.match(settings, /isDesktopApp[\s\S]*?worldmonitor\.app\/pro/);
    assert.match(settings, /startCheckout[\s\S]*?window\.open\('\/pro'/);

    const resilience = readFileSync(new URL('../src/components/ResilienceWidget.ts', import.meta.url), 'utf8');
    assert.match(resilience, /window\.open\('\/pro'/);

    const route = readFileSync(new URL('../src/components/RouteExplorer/RouteExplorer.ts', import.meta.url), 'utf8');
    assert.match(route, /window\.open\('\/pro'/);
  });

  it('separates economic stress unavailable vs empty', () => {
    const economic = readFileSync(new URL('../src/components/EconomicPanel.ts', import.meta.url), 'utf8');
    assert.match(economic, /temporarily unavailable/);
    assert.match(economic, /No stress index currently available/);
    assert.doesNotMatch(economic, /Stress index data unavailable/);
  });
});
