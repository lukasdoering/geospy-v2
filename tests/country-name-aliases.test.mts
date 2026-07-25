import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toIso2 } from '../src/utils/country-codes.ts';

describe('country name aliases', () => {
  it('resolves common forecast/intel country display names', () => {
    assert.equal(toIso2('China'), 'CN');
    assert.equal(toIso2('Ukraine'), 'UA');
    assert.equal(toIso2('Algeria'), 'DZ');
    assert.equal(toIso2('Niger'), 'NE');
    assert.equal(toIso2('Turkey'), 'TR');
    assert.equal(toIso2('Türkiye'), 'TR');
    assert.equal(toIso2('United States'), 'US');
    assert.equal(toIso2('Russia'), 'RU');
    assert.equal(toIso2('Iran'), 'IR');
    assert.equal(toIso2('DRC'), 'CD');
    assert.equal(toIso2('Global'), null);
    assert.equal(toIso2('Middle East'), null);
  });
});
