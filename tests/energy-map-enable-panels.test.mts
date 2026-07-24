import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('energy map / country deep-dive enable destination panels', () => {
  it('fixes hubs CSS so clickable rows keep transition without orphan braces', () => {
    const css = readFileSync(new URL('../src/styles/panels.css', import.meta.url), 'utf8');
    assert.match(css, /\.geo-hub-item-clickable,\s*\n\.tech-hub-item-clickable \{[\s\S]*?transition:\s*background/);
    assert.doesNotMatch(css, /\}\s*\n\s*transition:\s*background/);
  });

  it('CountryDeepDive energy atlas rows enable panels before open-detail', () => {
    const panel = readFileSync(new URL('../src/components/CountryDeepDivePanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /function panelIdForEnergyDetailEvent/);
    assert.match(panel, /CustomEvent\('enable-panel'/);
    assert.match(panel, /pipeline-status/);
    assert.match(panel, /storage-facility-map/);
    assert.match(panel, /fuel-shortages/);
    assert.match(panel, /setTimeout/);
  });

  it('DeckGLMap energy layer clicks enable destination panels', () => {
    const map = readFileSync(new URL('../src/components/DeckGLMap.ts', import.meta.url), 'utf8');
    assert.match(map, /panelId: 'pipeline-status'/);
    assert.match(map, /panelId: 'storage-facility-map'/);
    assert.match(map, /panelId: 'fuel-shortages'/);
    assert.match(map, /energy:open-pipeline-detail/);
    assert.match(map, /energy:open-storage-facility-detail/);
    assert.match(map, /energy:open-fuel-shortage-detail/);
  });

  it('Route Explorer empty states use GeoSpy brand', () => {
    const impact = readFileSync(
      new URL('../src/components/RouteExplorer/tabs/CountryImpactTab.ts', import.meta.url),
      'utf8',
    );
    const route = readFileSync(
      new URL('../src/components/RouteExplorer/tabs/CurrentRouteTab.ts', import.meta.url),
      'utf8',
    );
    assert.match(impact, /GeoSpy does not have bilateral trade data/);
    assert.match(impact, /GeoSpy is fetching trade data/);
    assert.match(impact, /GeoSpy\\'s strategic-products dataset/);
    assert.doesNotMatch(impact, /WorldMonitor/);
    assert.match(route, /GeoSpy does not have a modeled maritime route/);
    assert.doesNotMatch(route, /WorldMonitor/);
  });
});
