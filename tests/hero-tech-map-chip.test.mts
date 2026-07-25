import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('hero spotlight + tech events Map chip polish', () => {
  it('Hero Spotlight guards Null Island and uses Map aria label', () => {
    const panel = readFileSync(new URL('../src/components/HeroSpotlightPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /Number\.isFinite\(item\.lat\)/);
    assert.match(panel, /item\.lat === 0 && item\.lon === 0/);
    assert.match(panel, /aria-label="Show story location on map"/);
    assert.match(panel, />Map<\/button>/);
    assert.match(panel, /stopPropagation/);
  });

  it('Tech Events pin is a Map button with aria-label', () => {
    const panel = readFileSync(new URL('../src/components/TechEventsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /event-map-link/);
    assert.match(panel, /'aria-label': t\('components\.techEvents\.showOnMap'\)/);
    assert.match(panel, /\}, 'Map'\)/);
    assert.doesNotMatch(panel, /\}, '📍'\)/);
  });

  it('MapPopup Wingbits referral UTM uses geospy', () => {
    const popup = readFileSync(new URL('../src/components/MapPopup.ts', import.meta.url), 'utf8');
    assert.match(popup, /utm_source=geospy/);
    assert.match(popup, /utm_campaign=geospy/);
    assert.doesNotMatch(popup, /utm_source=worldmonitor/);
  });
});
