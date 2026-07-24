import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BRAND } from '../src/config/brand.ts';

describe('GeoSpy brand config', () => {
  it('exports a GeoSpy product identity with upstream attribution', () => {
    assert.equal(BRAND.name, 'GeoSpy');
    assert.equal(BRAND.nameUpper, 'GEOSPY');
    assert.equal(BRAND.shortLogo, 'GEOSPY');
    assert.match(BRAND.documentTitle, /GeoSpy/);
    assert.equal(BRAND.upstreamName, 'WorldMonitor');
    assert.match(BRAND.githubUrl, /lukasdoering\/geospy-v2/);
    assert.match(BRAND.upstreamUrl, /koala73\/worldmonitor/);
  });

  it('uses GeoSpy in footer chrome and offline page copy', () => {
    const footer = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(footer, /site-footer-copy[\s\S]*?\$\{BRAND\.name\}/);
    assert.doesNotMatch(footer, /site-footer-copy[\s\S]*?World Monitor</);

    const offline = readFileSync(new URL('../public/offline.html', import.meta.url), 'utf8');
    assert.match(offline, /<title>GeoSpy - Offline<\/title>/);
    assert.match(offline, /GeoSpy requires an internet connection/);
    assert.doesNotMatch(offline, /World Monitor/);
  });

  it('does not claim upstream WIRED/2M metrics as GeoSpy facts in index.html', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    assert.doesNotMatch(html, /GeoSpy[\s\S]{0,80}Used by 2M\+/);
    assert.match(html, /AGPL fork of WorldMonitor|AGPL fork of <a[^>]*>WorldMonitor/i);
    assert.match(html, /name="description" content="GeoSpy is a real-time global intelligence dashboard/);
  });
});
