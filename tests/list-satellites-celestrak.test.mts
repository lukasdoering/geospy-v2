import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseTleCatalog } from '../server/worldmonitor/intelligence/v1/list-satellites.ts';

const SAMPLE = `ISS (ZARYA)
1 25544U 98067A   26205.15303990  .00012066  00000+0  22566-3 0  9993
2 25544  51.6315 117.1603 0006931 331.5533  28.5077 15.49135191577483
TERRA
1 25994U 99068A   26205.27222531  .00000356  00000+0  81453-4 0  9998
2 25994  97.9435 253.3440 0003676 104.8827 319.5785 14.61129252415024
SENTINEL-1A
1 39634U 14016A   26204.71044689  .00000035  00000+0  17216-4 0  9998
2 39634  98.1701 211.7058 0001397  88.9672 271.1688 14.59174326655345
RADARSAT-2
1 32382U 07061A   26204.50000000  .00000000  00000+0  00000-0 0  9998
2 32382  98.5800 120.0000 0001000  90.0000 270.0000 14.30000000000000
TERRASAR-X
1 31698U 07026A   26204.50000000  .00000000  00000+0  00000-0 0  9998
2 31698  97.4400 200.0000 0002000  80.0000 280.0000 15.19000000000000
`;

describe('listSatellites CelesTrak TLE parse', () => {
  it('parses classic 3-line TLE blocks', () => {
    const sats = parseTleCatalog(SAMPLE, { type: 'optical', country: 'INT' });
    assert.equal(sats.length, 5);
    assert.equal(sats[0]!.id, '25544');
    assert.equal(sats[0]!.name, 'ISS (ZARYA)');
    assert.match(sats[0]!.line1, /^1 25544/);
    assert.match(sats[0]!.line2, /^2 25544/);
    assert.equal(sats[1]!.id, '25994');
    assert.equal(sats[1]!.type, 'optical');
  });

  it('classifies known SAR platforms by name', () => {
    const sats = parseTleCatalog(SAMPLE, { type: 'optical', country: 'INT' });
    assert.equal(sats.find((s) => s.id === '39634')?.type, 'sar'); // SENTINEL-1A
    assert.equal(sats.find((s) => s.id === '32382')?.type, 'sar'); // RADARSAT-2
    assert.equal(sats.find((s) => s.id === '31698')?.type, 'sar'); // TERRASAR-X
    assert.equal(sats.find((s) => s.id === '25544')?.type, 'optical'); // ISS stays optical
  });
});
