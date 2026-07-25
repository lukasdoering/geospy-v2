import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('tech readiness map focus', () => {
  it('wires readiness rows to map focus via ISO3 country codes', () => {
    const panel = readFileSync(new URL('../src/components/TechReadinessPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /resolveCountryMapFocus/);
    assert.match(panel, /readiness-item-clickable/);
    assert.match(panel, /data-country/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
  });

  it('panel-layout wires tech-readiness location handler', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /tech-readiness[\s\S]*?setLocationClickHandler/);
  });
});
