import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseTleCatalog } from '../server/worldmonitor/intelligence/v1/list-satellites.ts';

const SAMPLE = `ISS (ZARYA)
1 25544U 98067A   26205.15303990  .00012066  00000+0  22566-3 0  9993
2 25544  51.6315 117.1603 0006931 331.5533  28.5077 15.49135191577483
TERRA
1 25994U 99068A   26205.27222531  .00000356  00000+0  81453-4 0  9998
2 25994  97.9435 253.3440 0003676 104.8827 319.5785 14.61129252415024
`;

describe('listSatellites CelesTrak TLE parse', () => {
  it('parses classic 3-line TLE blocks', () => {
    const sats = parseTleCatalog(SAMPLE, { type: 'optical', country: 'INT' });
    assert.equal(sats.length, 2);
    assert.equal(sats[0]!.id, '25544');
    assert.equal(sats[0]!.name, 'ISS (ZARYA)');
    assert.match(sats[0]!.line1, /^1 25544/);
    assert.match(sats[0]!.line2, /^2 25544/);
    assert.equal(sats[1]!.id, '25994');
    assert.equal(sats[1]!.type, 'optical');
  });
});
