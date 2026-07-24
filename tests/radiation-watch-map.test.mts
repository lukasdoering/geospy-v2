import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('radiation watch map a11y', () => {
  it('makes radiation rows keyboard-activatable for map focus', () => {
    const panel = readFileSync(new URL('../src/components/RadiationWatchPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /radiation-row-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /setLocationClickHandler/);
  });
});
