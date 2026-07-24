import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('overhead last-location contract', () => {
  it('persists and re-runs last coordinates via Cmd+K', () => {
    const intel = readFileSync(new URL('../src/app/country-intel.ts', import.meta.url), 'utf8');
    assert.match(intel, /geospy-overhead-last-location/);
    assert.match(intel, /predictOverheadPassesAtLastLocation\(/);
    assert.match(intel, /rememberOverheadLocation\(/);

    const commands = readFileSync(new URL('../src/config/commands.ts', import.meta.url), 'utf8');
    assert.match(commands, /id: 'view:overhead-passes-last'/);

    const search = readFileSync(new URL('../src/app/search-manager.ts', import.meta.url), 'utf8');
    assert.match(search, /action === 'overhead-passes-last'/);

    const app = readFileSync(new URL('../src/App.ts', import.meta.url), 'utf8');
    assert.match(app, /predictOverheadPassesAtLastLocation:\s*\(\)\s*=>\s*this\.countryIntel\.predictOverheadPassesAtLastLocation\(\)/);
  });
});
