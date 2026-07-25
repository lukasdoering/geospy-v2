import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  advisoryCountryLabel,
  resolveAdvisoryMapFocus,
} from '../src/utils/security-advisory-focus.ts';

describe('security advisories map focus', () => {
  it('returns null without a resolvable country / hydrated geometry', () => {
    assert.equal(resolveAdvisoryMapFocus(''), null);
    assert.equal(resolveAdvisoryMapFocus(null), null);
    // Without hydrated country geometry (unit tests), centroid lookup is null.
    assert.equal(resolveAdvisoryMapFocus('UA'), null);
  });

  it('labels fall back to trimmed input when geometry is cold', () => {
    assert.equal(advisoryCountryLabel(''), '');
    assert.equal(advisoryCountryLabel('  TH  '), 'TH');
  });

  it('wires card click → map focus and panel-layout handler', () => {
    const panel = readFileSync(new URL('../src/components/SecurityAdvisoriesPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /data-sa-focus/);
    assert.match(panel, /sa-item-clickable/);
    assert.match(panel, /setCountryClickHandler/);
    assert.match(panel, /security-advisory-focus/);
    assert.match(panel, /closest\('a'\)/);
    assert.match(panel, /keydown/);

    const helpers = readFileSync(new URL('../src/utils/security-advisory-focus.ts', import.meta.url), 'utf8');
    assert.match(helpers, /getCountryCentroid/);
    assert.match(helpers, /toIso2/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /security-advisories/);
    assert.match(layout, /setCountryClickHandler/);
  });
});
