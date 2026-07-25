import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('push brand, Pro footer, oil calm empty, energy aria', () => {
  it('brands push notification fallback title as GeoSpy', () => {
    const push = readFileSync(new URL('../public/push-handler.js', import.meta.url), 'utf8');
    assert.match(push, /title: 'GeoSpy'/);
    assert.match(push, /: 'GeoSpy'/);
    assert.match(push, /geospy-generic/);
    assert.doesNotMatch(push, /title: 'WorldMonitor'/);
    assert.doesNotMatch(push, /: 'WorldMonitor'/);
  });

  it('routes web Pro chrome/gates to local /pro (desktop keeps upstream)', () => {
    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /isDesktopApp \? 'https:\/\/worldmonitor\.app\/pro' : '\/pro'/);
    assert.match(layout, /FREE_TIER:[\s\S]*?isDesktopApp \? 'https:\/\/worldmonitor\.app\/pro' : '\/pro'/);
    assert.match(layout, /LAPSED:[\s\S]*?isDesktopApp \? 'https:\/\/worldmonitor\.app\/pro' : '\/pro'/);
    assert.doesNotMatch(layout, /www\.worldmonitor\.app\/pro/);
  });

  it('separates oil inventory unavailable vs healthy empty', () => {
    const oil = readFileSync(new URL('../src/components/OilInventoriesPanel.ts', import.meta.url), 'utf8');
    assert.match(oil, /temporarily unavailable/);
    assert.match(oil, /No oil inventory series currently available/);
    assert.doesNotMatch(oil, /parts\.length === 0[\s\S]*?Oil inventory data unavailable/);
  });

  it('adds aria-labels on energy registry / Hormuz / ERO map controls', () => {
    const files = [
      '../src/components/EnergyDisruptionsPanel.ts',
      '../src/components/FuelShortagePanel.ts',
      '../src/components/PipelineStatusPanel.ts',
      '../src/components/StorageFacilityMapPanel.ts',
      '../src/components/EnergyRiskOverviewPanel.ts',
      '../src/components/HormuzPanel.ts',
    ];
    for (const rel of files) {
      const src = readFileSync(new URL(rel, import.meta.url), 'utf8');
      assert.match(src, /aria-label=/);
    }
  });
});
