import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('economic calendar map focus + calm empties', () => {
  it('wires Economic Calendar event rows to map focus with calm empty', () => {
    const panel = readFileSync(new URL('../src/components/EconomicCalendarPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /ec-row-clickable/);
    assert.match(panel, /data-country/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /panel-empty/);
  });

  it('Market Breadth / Social Velocity / Climate News use calm empty for no data', () => {
    const breadth = readFileSync(new URL('../src/components/MarketBreadthPanel.ts', import.meta.url), 'utf8');
    const social = readFileSync(new URL('../src/components/SocialVelocityPanel.ts', import.meta.url), 'utf8');
    const climate = readFileSync(new URL('../src/components/ClimateNewsPanel.ts', import.meta.url), 'utf8');
    assert.match(breadth, /panel-empty/);
    assert.match(social, /panel-empty/);
    assert.match(climate, /panel-empty/);
    assert.doesNotMatch(breadth, /if \(!this\.data\?\.history\?\.length\) \{[\s\S]*?showError/);
    assert.doesNotMatch(climate, /if \(!data\.items\?\.length\) \{[\s\S]*?showError/);
  });

  it('panel-layout wires economic-calendar location handler', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /economic-calendar[\s\S]*?setLocationClickHandler/);
  });
});
