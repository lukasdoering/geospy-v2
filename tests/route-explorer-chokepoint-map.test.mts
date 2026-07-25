import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('route explorer current-route chokepoint map focus', () => {
  it('wires CurrentRouteTab chokepoint rows to openChokepoint', () => {
    const tab = readFileSync(
      new URL('../src/components/RouteExplorer/tabs/CurrentRouteTab.ts', import.meta.url),
      'utf8',
    );
    assert.match(tab, /onChokepointSelect/);
    assert.match(tab, /data-cp-id/);
    assert.match(tab, /role="button"/);
    assert.match(tab, /e\.key === ' '/);

    const explorer = readFileSync(
      new URL('../src/components/RouteExplorer/RouteExplorer.ts', import.meta.url),
      'utf8',
    );
    assert.match(explorer, /new CurrentRouteTab\(\{/);
    assert.match(explorer, /onChokepointSelect:\s*\(id\)\s*=>\s*this\.mapRef\?\.openChokepoint\?\.\(id\)/);
    assert.match(explorer, /openChokepoint\?\(id: string\): void/);
  });
});
