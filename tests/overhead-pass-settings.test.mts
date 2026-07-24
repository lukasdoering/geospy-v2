import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  getOverheadPassSettings,
  setOverheadMinElevationDeg,
  setOverheadWindowMinutes,
} from '../src/services/overhead-pass-settings.ts';

describe('overhead pass settings', () => {
  beforeEach(() => {
    try {
      localStorage.removeItem('geospy-overhead-min-elevation');
      localStorage.removeItem('geospy-overhead-window-minutes');
    } catch {
      /* node without localStorage polyfill — settings helpers catch errors */
    }
  });

  it('defaults to 20° / 3h', () => {
    const prefs = getOverheadPassSettings();
    assert.equal(prefs.minElevationDeg, 20);
    assert.equal(prefs.windowMinutes, 180);
  });

  it('persists elevation and window when localStorage is available', () => {
    if (typeof localStorage === 'undefined') return;
    setOverheadMinElevationDeg(30);
    setOverheadWindowMinutes(720);
    const prefs = getOverheadPassSettings();
    assert.equal(prefs.minElevationDeg, 30);
    assert.equal(prefs.windowMinutes, 720);
  });

  it('wires Satellites prefs into Unified Settings + prediction path', () => {
    const prefsUi = readFileSync(new URL('../src/services/preferences-content.ts', import.meta.url), 'utf8');
    assert.match(prefsUi, /us-overhead-elevation/);
    assert.match(prefsUi, /us-overhead-window/);
    assert.match(prefsUi, /setOverheadMinElevationDeg/);

    const intel = readFileSync(new URL('../src/app/country-intel.ts', import.meta.url), 'utf8');
    assert.match(intel, /getOverheadPassSettings/);
    assert.match(intel, /prefs\.minElevationDeg/);
    assert.match(intel, /prefs\.windowMinutes/);
    // Cold-open Settings is async — must await/retry before focusing elevation.
    assert.match(intel, /openOverheadPassSettings/);
    assert.match(intel, /us-overhead-elevation/);
    assert.match(intel, /scheduleFocus|deadline/);
  });
});

