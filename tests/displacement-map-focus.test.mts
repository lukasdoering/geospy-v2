import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('displacement map focus', () => {
  it('avoids Null Island and supports keyboard map focus', () => {
    const panel = readFileSync(new URL('../src/components/DisplacementPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /disp-row-clickable/);
    assert.match(panel, /tabindex="0"/);
    assert.match(panel, /keydown/);
    assert.match(panel, /lat === 0 && lon === 0/);
    assert.doesNotMatch(panel, /data-lat="\$\{c\.lat \|\| ''\}"/);
  });
});
