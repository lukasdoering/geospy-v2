import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('population exposure row → map', () => {
  it('wires clickable exposure cards and panel-layout handler', () => {
    const panel = readFileSync(new URL('../src/components/PopulationExposurePanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /data-popexp-focus/);
    assert.match(panel, /setLocationClickHandler/);
    assert.match(panel, /popexp-card-clickable/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /population-exposure/);
    assert.match(layout, /setLocationClickHandler/);
  });
});
