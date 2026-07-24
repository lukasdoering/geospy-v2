import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('strategic risk / posture map a11y', () => {
  it('makes strategic risk rows keyboard-activatable', () => {
    const panel = readFileSync(new URL('../src/components/StrategicRiskPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /risk-item-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /lat === 0 && lon === 0/);
    assert.doesNotMatch(panel, /parseFloat\(\(item as HTMLElement\)\.dataset\.lat \|\| '0'\)/);
  });

  it('makes strategic posture theaters keyboard-activatable without debug logs', () => {
    const panel = readFileSync(new URL('../src/components/StrategicPosturePanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /posture-theater-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /lat === 0 && lon === 0/);
    assert.doesNotMatch(panel, /Theater clicked:/);
    assert.doesNotMatch(panel, /setLocationClickHandler called/);
    assert.doesNotMatch(panel, /Re-augmenting with vessels/);
    assert.doesNotMatch(panel, /Got \$\{vessels\.length\} total military vessels/);
  });
});
