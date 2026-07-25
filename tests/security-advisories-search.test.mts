import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('security advisories search', () => {
  it('ships country/title search alongside severity filters', () => {
    const panel = readFileSync(new URL('../src/components/SecurityAdvisoriesPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /data-role="sa-search"/);
    assert.match(panel, /security-advisories-search/);
    assert.match(panel, /searchQuery/);
    assert.match(panel, /a\.country/);
    assert.match(panel, /restoreSearchFocus/);
  });
});
