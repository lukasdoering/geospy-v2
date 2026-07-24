import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { initSatRecs, predictNextPasses, type SatelliteTLE } from '../src/services/satellites.ts';

// ISS-class LEO TLE (epoch 2024-01-01). Mean motion ~15.5 rev/day → LEO.
const ISS_TLE: SatelliteTLE = {
  noradId: '25544',
  name: 'ISS (ZARYA)',
  line1: '1 25544U 98067A   24001.00000000  .00016717  00000-0  10270-3 0  9994',
  line2: '2 25544  51.6400 208.9163 0006703  67.0000  40.0000 15.50000000000000',
  type: 'optical',
  country: 'INT',
};

// GEO-like object (mean motion ~1 rev/day) should be skipped by the LEO filter.
const GEO_TLE: SatelliteTLE = {
  noradId: '99999',
  name: 'FAKE GEO',
  line1: '1 99999U 00000A   24001.00000000  .00000000  00000-0  00000-0 0  9990',
  line2: '2 99999   0.0500  90.0000 0001000   0.0000   0.0000  1.00270000000000',
  type: 'military',
  country: 'XX',
};

describe('predictNextPasses', () => {
  it('returns finite AOS/LOS/maxElevation for a LEO sat over a mid-latitude observer', async () => {
    const satRecs = await initSatRecs([ISS_TLE]);
    assert.equal(satRecs.length, 1);

    // Epoch day of the TLE is 2024-01-01; search a day around then so SGP4 stays valid.
    const nowMs = Date.parse('2024-01-01T12:00:00Z');
    const passes = predictNextPasses(40.0, -74.0, satRecs, {
      nowMs,
      windowMinutes: 24 * 60,
      stepSeconds: 30,
      minElevationDeg: 10,
      limit: 20,
    });

    assert.ok(passes.length >= 1, `expected at least one ISS pass, got ${passes.length}`);
    for (const pass of passes) {
      assert.equal(pass.noradId, '25544');
      assert.ok(pass.aosMs >= nowMs);
      assert.ok(pass.losMs >= pass.aosMs);
      assert.ok(pass.maxElevationMs >= pass.aosMs && pass.maxElevationMs <= pass.losMs);
      assert.ok(pass.maxElevationDeg >= 10);
      assert.ok(pass.maxElevationDeg <= 90);
    }
  });

  it('skips GEO mean-motion objects', async () => {
    const satRecs = await initSatRecs([GEO_TLE]);
    assert.equal(satRecs.length, 1);
    const passes = predictNextPasses(0, 0, satRecs, {
      nowMs: Date.parse('2024-01-01T12:00:00Z'),
      windowMinutes: 180,
      stepSeconds: 60,
      minElevationDeg: 5,
      limit: 10,
    });
    assert.equal(passes.length, 0);
  });

  it('returns empty for invalid coordinates', async () => {
    const satRecs = await initSatRecs([ISS_TLE]);
    assert.deepEqual(predictNextPasses(Number.NaN, 10, satRecs), []);
  });
});
