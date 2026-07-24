import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('insights focal points map focus', () => {
  it('wires country focal-point cards to map focus with keyboard a11y', () => {
    const panel = readFileSync(new URL('../src/components/InsightsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /focal-point-clickable/);
    assert.match(panel, /convergence-zone-clickable/);
    assert.match(panel, /data-country/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
  });

  it('panel-layout wires insights location handler', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /insights[\s\S]*?setLocationClickHandler/);
  });

  it('includes clickable focal-point styles', () => {
    const css = readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');
    assert.match(css, /\.focal-point-clickable/);
    assert.match(css, /\.focal-point-clickable:focus-visible/);
  });
});
