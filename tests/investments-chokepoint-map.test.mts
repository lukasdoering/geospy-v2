import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('investments + chokepoint map polish', () => {
  it('makes investment rows keyboard-activatable', () => {
    const panel = readFileSync(new URL('../src/components/InvestmentsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /fdi-row-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
  });

  it('wires chokepoint chips to openChokepoint with calm empty state', () => {
    const panel = readFileSync(new URL('../src/components/ChokepointStripPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /cp-chip-clickable/);
    assert.match(panel, /setChokepointClickHandler/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /panel-empty/);
    assert.doesNotMatch(panel, /showError\(t\('components\.chokepointStrip\.errors\.noData'/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /chokepoint-strip/);
    assert.match(layout, /setChokepointClickHandler/);
    assert.match(layout, /openChokepoint/);
  });
});
