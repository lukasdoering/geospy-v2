import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('internet disruptions row → map', () => {
  it('wires clickable outage/anomaly rows and panel-layout handler', () => {
    const panel = readFileSync(new URL('../src/components/InternetDisruptionsPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /data-id-focus|idFocus/);
    assert.match(panel, /setCountryClickHandler/);
    assert.match(panel, /id-row-clickable/);

    const layout = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(layout, /internet-disruptions/);
    assert.match(layout, /setCountryClickHandler/);
    assert.match(layout, /outages/);
  });
});
