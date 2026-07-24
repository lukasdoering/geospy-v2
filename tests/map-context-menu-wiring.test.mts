import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readSrc = (rel: string) => readFileSync(resolve(root, rel), 'utf-8');

describe('map context menu wiring', () => {
  it('MapContainer forwards onMapContextMenu to SVG fallback, not only globe/deck', () => {
    const mapContainer = readSrc('src/components/MapContainer.ts');
    assert.match(
      mapContainer,
      /onMapContextMenu\(callback:[\s\S]*this\.svgMap\?\.setOnMapContextMenu\(callback\)/,
      'SVG fallback must receive the context-menu callback so right-click works without WebGL',
    );
  });

  it('SVG Map registers a contextmenu listener and exposes setOnMapContextMenu', () => {
    const map = readSrc('src/components/Map.ts');
    assert.match(map, /addEventListener\('contextmenu'/);
    assert.match(map, /public setOnMapContextMenu\(/);
  });

  it('DeckGL listens for contextmenu on both canvas and container', () => {
    const deck = readSrc('src/components/DeckGLMap.ts');
    assert.match(
      deck,
      /canvas\.addEventListener\('contextmenu', this\.handleContextMenu\)[\s\S]*this\.container\.addEventListener\('contextmenu', this\.handleContextMenu\)/,
    );
    assert.match(
      deck,
      /this\.container\.removeEventListener\('contextmenu', this\.handleContextMenu\)/,
    );
  });

  it('country-intel registers a map context menu via showMapContextMenu', () => {
    const countryIntel = readSrc('src/app/country-intel.ts');
    assert.match(countryIntel, /showMapContextMenu\(/);
    assert.match(countryIntel, /onMapContextMenu\(/);
  });
});
