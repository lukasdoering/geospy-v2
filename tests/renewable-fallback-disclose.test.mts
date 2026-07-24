import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('renewable fallback disclosure', () => {
  it('tags fetch results with hydrated/bootstrap/fallback source', () => {
    const service = readFileSync(new URL('../src/services/renewable-energy-data.ts', import.meta.url), 'utf8');
    assert.match(service, /export type RenewableEnergyDataSource/);
    assert.match(service, /source: 'fallback'/);
    assert.match(service, /shouldCache:\s*\(result\)\s*=>\s*result\.source !== 'fallback'/);
  });

  it('wires panel disclosure banner + data-loader result path', () => {
    const panel = readFileSync(new URL('../src/components/RenewableEnergyPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /renewable-fallback-banner/);
    assert.match(panel, /components\.renewable\.fallbackBadge/);
    assert.match(panel, /source === 'fallback'/);

    const loader = readFileSync(new URL('../src/app/data-loader.ts', import.meta.url), 'utf8');
    assert.match(loader, /callPanel\('renewable', 'setData', result\)/);
    assert.match(loader, /result\.data\?\.globalPercentage/);

    const en = readFileSync(new URL('../src/locales/en.json', import.meta.url), 'utf8');
    assert.match(en, /"fallbackBadge": "Showing static fallback data/);
  });
});
