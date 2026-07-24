import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('cascade panel map focus', () => {
  it('wires onSelect to openChokepoint / setCenter', () => {
    const panel = readFileSync(new URL('../src/components/CascadePanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /onSelect\(/);
    assert.match(panel, /onSelectCallback/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /cascade/);
    assert.match(layout, /\.onSelect\(/);
    assert.match(layout, /openChokepoint/);
    assert.match(layout, /buildDependencyGraph/);
    assert.match(layout, /setCenter\(lat, lon, 5\)/);
  });
});
