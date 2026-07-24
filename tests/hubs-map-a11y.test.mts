import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('geo/tech hubs map a11y', () => {
  it('makes geo hub rows keyboard-activatable with calm empty state', () => {
    const panel = readFileSync(new URL('../src/components/GeoHubsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /geo-hub-item-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /panel-empty/);
    assert.doesNotMatch(panel, /showError\(t\('common\.noActiveGeoHubs'\)\)/);
  });

  it('makes tech hub rows keyboard-activatable with calm empty state', () => {
    const panel = readFileSync(new URL('../src/components/TechHubsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /tech-hub-item-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /setupDelegatedListeners/);
    assert.match(panel, /panel-empty/);
    assert.doesNotMatch(panel, /showError\(t\('common\.noActiveTechHubs'\)\)/);
  });
});
