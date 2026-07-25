import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('route explorer country impact map focus', () => {
  it('wires exporter and chokepoint cells without stealing HS2 drill', () => {
    const tab = readFileSync(
      new URL('../src/components/RouteExplorer/tabs/CountryImpactTab.ts', import.meta.url),
      'utf8',
    );
    assert.match(tab, /onExporterSelect/);
    assert.match(tab, /onChokepointSelect/);
    assert.match(tab, /data-exporter/);
    assert.match(tab, /data-cp-id/);
    assert.match(tab, /re-impact__geo-cell/);
    assert.match(tab, /stopPropagation/);
    assert.match(tab, /closest\('\.re-impact__geo-cell'\)/);

    const explorer = readFileSync(
      new URL('../src/components/RouteExplorer/RouteExplorer.ts', import.meta.url),
      'utf8',
    );
    assert.match(explorer, /onExporterSelect/);
    assert.match(explorer, /resolveCountryMapFocus/);
    assert.match(explorer, /onChokepointSelect:\s*\(id\)\s*=>\s*this\.mapRef\?\.openChokepoint/);
    assert.match(explorer, /setCenter\?\(lat: number, lon: number/);
  });
});
