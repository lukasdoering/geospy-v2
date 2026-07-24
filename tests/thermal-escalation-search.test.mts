import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('thermal escalation search + map a11y', () => {
  it('ships region/status search and keyboard map focus', () => {
    const panel = readFileSync(new URL('../src/components/ThermalEscalationPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /data-role="te-search"/);
    assert.match(panel, /thermal-escalation-search/);
    assert.match(panel, /searchQuery/);
    assert.match(panel, /data-te-focus/);
    assert.match(panel, /te-card-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /restoreSearchFocus/);
    assert.match(panel, /No clusters match this search/);
    assert.match(panel, /Search region \/ status/);
  });
});
