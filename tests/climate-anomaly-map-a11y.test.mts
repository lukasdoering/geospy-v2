import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('climate anomaly map a11y', () => {
  it('makes climate rows keyboard-activatable for map focus', () => {
    const panel = readFileSync(new URL('../src/components/ClimateAnomalyPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /climate-row-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /setZoneClickHandler/);
    assert.match(panel, /lat === 0 && lon === 0/);
  });
});
