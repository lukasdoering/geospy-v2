import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('gold CB reserves map focus', () => {
  it('wires CB holder/mover rows to map focus with keyboard a11y', () => {
    const panel = readFileSync(new URL('../src/components/GoldIntelligencePanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /gold-cb-clickable/);
    assert.match(panel, /data-country=/);
    assert.match(panel, /h\.iso3/);
    assert.match(panel, /m\.iso3/);
    assert.match(panel, /keydown/);
    assert.match(panel, /panel-empty/);
  });

  it('panel-layout wires gold-intelligence location handler', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /gold-intelligence[\s\S]*?setLocationClickHandler/);
  });

  it('includes clickable gold-cb styles', () => {
    const css = readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');
    assert.match(css, /\.gold-cb-clickable/);
    assert.match(css, /\.gold-cb-clickable:focus-visible/);
  });
});
