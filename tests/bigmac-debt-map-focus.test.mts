import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('bigmac + national debt map focus', () => {
  it('wires Big Mac country rows to map focus with calm empty', () => {
    const panel = readFileSync(new URL('../src/components/BigMacPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /bm-row-clickable/);
    assert.match(panel, /data-country-code/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /panel-empty/);
  });

  it('wires National Debt rows to map focus via ISO3', () => {
    const panel = readFileSync(new URL('../src/components/NationalDebtPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /debt-row-clickable/);
    assert.match(panel, /data-iso3/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
  });

  it('panel-layout wires both handlers', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /bigmac[\s\S]*?setLocationClickHandler/);
    assert.match(layout, /national-debt[\s\S]*?setLocationClickHandler/);
  });
});
