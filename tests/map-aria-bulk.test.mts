import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

describe('bulk map affordance aria-labels', () => {
  it('no title-only Show on map controls remain without aria-label', () => {
    const dir = new URL('../src/components/', import.meta.url);
    const root = dir.pathname;
    const files = readdirSync(root).filter((f) => f.endsWith('.ts'));
    const offenders: string[] = [];
    for (const file of files) {
      const src = readFileSync(join(root, file), 'utf8');
      for (const line of src.split('\n')) {
        if (!line.includes('title="Show on map"')) continue;
        if (line.includes('aria-label=')) continue;
        offenders.push(`${file}: ${line.trim().slice(0, 120)}`);
      }
    }
    assert.equal(offenders.length, 0, offenders.join('\n'));
  });

  it('spot-checks high-traffic panels include descriptive aria-labels', () => {
    const bigmac = readFileSync(new URL('../src/components/BigMacPanel.ts', import.meta.url), 'utf8');
    assert.match(bigmac, /aria-label="Show \$\{escapeHtml\(c\.code\)\} on map"/);
    const sanctions = readFileSync(new URL('../src/components/SanctionsPressurePanel.ts', import.meta.url), 'utf8');
    assert.match(sanctions, /aria-label="Show \$\{escapeHtml\(country\.countryCode\)\} on map"/);
    const airline = readFileSync(new URL('../src/components/AirlineIntelPanel.ts', import.meta.url), 'utf8');
    assert.match(airline, /aria-label="Show \$\{escapeHtml\(s\.iata\)\} on map"/);
  });
});
