import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
});
