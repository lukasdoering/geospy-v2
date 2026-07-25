import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('energy registry calm unavailable vs empty', () => {
  it('separates upstream unavailability from healthy empty registries', () => {
    const fuel = readFileSync(new URL('../src/components/FuelShortagePanel.ts', import.meta.url), 'utf8');
    const pipeline = readFileSync(new URL('../src/components/PipelineStatusPanel.ts', import.meta.url), 'utf8');
    const storage = readFileSync(new URL('../src/components/StorageFacilityMapPanel.ts', import.meta.url), 'utf8');
    const disruptions = readFileSync(new URL('../src/components/EnergyDisruptionsPanel.ts', import.meta.url), 'utf8');

    for (const src of [fuel, pipeline, storage, disruptions]) {
      assert.match(src, /temporarily unavailable/);
      assert.match(src, /panel-empty/);
    }

    assert.match(fuel, /upstreamUnavailable[\s\S]*?temporarily unavailable[\s\S]*?No active fuel shortages/);
    assert.match(pipeline, /upstreamUnavailable[\s\S]*?temporarily unavailable[\s\S]*?No pipelines currently tracked/);
    assert.match(storage, /upstreamUnavailable[\s\S]*?temporarily unavailable[\s\S]*?No storage facilities currently tracked/);
    assert.doesNotMatch(disruptions, /upstreamUnavailable \|\| !/);
  });

  it('settings billing toasts brand as GeoSpy while keeping upstream support mail', () => {
    const settings = readFileSync(new URL('../src/components/UnifiedSettings.ts', import.meta.url), 'utf8');
    assert.match(settings, /import \{ BRAND \} from '@\/config\/brand'/);
    assert.match(settings, /\$\{BRAND\.name\} billing is managed outside Dodo/);
    assert.match(settings, /support@worldmonitor\.app/);
    assert.doesNotMatch(settings, /Subscription is managed outside Dodo\. Email support@worldmonitor\.app for help\./);
  });
});
