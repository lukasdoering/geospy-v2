import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('strategic risk enable-panel wiring', () => {
  it('dispatches enable-panel and event-handlers listen', () => {
    const panel = readFileSync(new URL('../src/components/StrategicRiskPanel.ts', import.meta.url), 'utf8');
    assert.match(panel, /CustomEvent\('enable-panel'/);
    assert.match(panel, /emitEnablePanel/);
    assert.match(panel, /enable-core/);

    const handlers = readFileSync(new URL('../src/app/event-handlers.ts', import.meta.url), 'utf8');
    assert.match(handlers, /enable-panel/);
    assert.match(handlers, /boundEnablePanelHandler/);
    assert.match(handlers, /enablePanelById\(panelId\)/);
  });
});
