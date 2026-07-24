import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('economic BIS map focus', () => {
  it('wires BIS country cards to map focus with keyboard a11y', () => {
    const panel = readFileSync(new URL('../src/components/EconomicPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /economic-indicator-clickable/);
    assert.match(panel, /data-country=/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /r\.countryCode/);
  });

  it('panel-layout wires economic location handler', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /economic[\s\S]*?setLocationClickHandler/);
  });

  it('includes clickable economic-indicator styles', () => {
    const css = readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');
    assert.match(css, /\.economic-indicator-clickable/);
    assert.match(css, /\.economic-indicator-clickable:focus-visible/);
  });
});
