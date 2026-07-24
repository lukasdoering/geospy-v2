import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

describe('settings → satellites command', () => {
  it('registers Cmd+K command and wires search-manager + focus helper', () => {
    const commands = readFileSync(new URL('../src/config/commands.ts', import.meta.url), 'utf8');
    assert.match(commands, /view:settings-satellites/);
    assert.match(commands, /Open Settings/);

    const search = readFileSync(new URL('../src/app/search-manager.ts', import.meta.url), 'utf8');
    assert.match(search, /settings-satellites/);
    assert.match(search, /openOverheadPassSettings/);

    const helper = readFileSync(new URL('../src/utils/overhead-settings-focus.ts', import.meta.url), 'utf8');
    assert.match(helper, /us-overhead-elevation/);
    assert.match(helper, /timeoutMs/);

    const intel = readFileSync(new URL('../src/app/country-intel.ts', import.meta.url), 'utf8');
    assert.match(intel, /overhead-settings-focus/);
  });
});
