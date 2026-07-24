import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BRAND } from '../src/config/brand.ts';

describe('GeoSpy brand config', () => {
  it('exports a GeoSpy product identity with upstream attribution', () => {
    assert.equal(BRAND.name, 'GeoSpy');
    assert.equal(BRAND.nameUpper, 'GEOSPY');
    assert.equal(BRAND.shortLogo, 'GEOSPY');
    assert.match(BRAND.documentTitle, /GeoSpy/);
    assert.equal(BRAND.upstreamName, 'WorldMonitor');
    assert.match(BRAND.githubUrl, /lukasdoering\/geospy-v2/);
    assert.match(BRAND.upstreamUrl, /koala73\/worldmonitor/);
  });

  it('uses GeoSpy in footer chrome and offline page copy', () => {
    const footer = readFileSync(new URL('../src/app/panel-layout.ts', import.meta.url), 'utf8');
    assert.match(footer, /site-footer-copy[\s\S]*?\$\{BRAND\.name\}/);
    assert.doesNotMatch(footer, /site-footer-copy[\s\S]*?World Monitor</);

    const offline = readFileSync(new URL('../public/offline.html', import.meta.url), 'utf8');
    assert.match(offline, /<title>GeoSpy - Offline<\/title>/);
    assert.match(offline, /GeoSpy requires an internet connection/);
    assert.doesNotMatch(offline, /World Monitor/);
  });

  it('does not claim upstream WIRED/2M metrics as GeoSpy facts in index.html', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    assert.doesNotMatch(html, /GeoSpy[\s\S]{0,80}Used by 2M\+/);
    assert.match(html, /AGPL fork of WorldMonitor|AGPL fork of <a[^>]*>WorldMonitor/i);
    assert.match(html, /name="description" content="GeoSpy is a real-time global intelligence dashboard/);
  });

  it('uses GeoSpy in demo-facing panel/widget chrome copy', () => {
    const en = readFileSync(new URL('../src/locales/en.json', import.meta.url), 'utf8');
    assert.match(en, /Fetching live GeoSpy data/);
    assert.match(en, /approved GeoSpy endpoints/);
    assert.match(en, /<strong>GeoSpy Analyst<\/strong>/);
    assert.match(en, /across all GeoSpy sources/);
    assert.doesNotMatch(en, /Fetching live WorldMonitor data/);
    assert.doesNotMatch(en, /<strong>WM Analyst<\/strong>/);

    const shell = readFileSync(new URL('../src/locales/en.shell.json', import.meta.url), 'utf8');
    assert.match(shell, /Fetching live GeoSpy data/);
    assert.match(shell, /<strong>GeoSpy Analyst<\/strong>/);

    const analyst = readFileSync(new URL('../src/components/ChatAnalystPanel.ts', import.meta.url), 'utf8');
    assert.match(analyst, /title: 'GeoSpy Analyst'/);
    assert.match(analyst, /# GeoSpy Analyst Session/);
    assert.doesNotMatch(analyst, /WM Analyst/);

    assert.match(en, /Requires a GeoSpy license key/);
    assert.match(en, /a single GeoSpy license unlocks everything/);
    assert.doesNotMatch(en, /Requires a World Monitor license key/);
    assert.match(shell, /Requires a GeoSpy license key/);

    const commands = readFileSync(new URL('../src/config/commands.ts', import.meta.url), 'utf8');
    assert.match(commands, /Panel: GeoSpy Analyst/);
    assert.doesNotMatch(commands, /Panel: WM Analyst/);

    const panels = readFileSync(new URL('../src/config/panels.ts', import.meta.url), 'utf8');
    assert.match(panels, /'chat-analyst': \{ name: 'GeoSpy Analyst'/);
    assert.doesNotMatch(panels, /name: 'WM Analyst'/);
  });

  it('brands settings and embed entry HTML as GeoSpy', () => {
    const settings = readFileSync(new URL('../settings.html', import.meta.url), 'utf8');
    assert.match(settings, /<title>GeoSpy Settings<\/title>/);
    assert.match(settings, /GeoSpy Settings/);
    assert.doesNotMatch(settings, /World Monitor Settings/);

    const embed = readFileSync(new URL('../embed.html', import.meta.url), 'utf8');
    assert.match(embed, /<title>GeoSpy Live Map Embed<\/title>/);
    assert.doesNotMatch(embed, /World Monitor Live Map Embed/);
  });

  it('brands Pro landing page hero chrome as GeoSpy', () => {
    const pro = readFileSync(new URL('../public/pro/index.html', import.meta.url), 'utf8');
    assert.match(pro, /<title>GeoSpy Pro/);
    assert.match(pro, /og:site_name" content="GeoSpy"/);
    assert.match(pro, /<h1>GeoSpy Pro — From Noise to Signal<\/h1>/);
    assert.match(pro, /<h3>GeoSpy Pro<\/h3>/);
    assert.match(pro, /<h2>What GeoSpy Tracks<\/h2>/);
    assert.doesNotMatch(pro, /<title>World Monitor Pro/);
    assert.doesNotMatch(pro, /<h1>World Monitor Pro — From Noise to Signal<\/h1>/);

    const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    assert.match(index, /href="\/pro">GeoSpy Pro</);
    assert.doesNotMatch(index, /href="https:\/\/www\.worldmonitor\.app\/pro">World Monitor Pro</);
  });

  it('brands Latest Brief and Settings API/MCP chrome as GeoSpy', () => {
    const brief = readFileSync(new URL('../src/components/LatestBriefPanel.ts', import.meta.url), 'utf8');
    assert.match(brief, /latest-brief-cover-title' \}, 'GeoSpy'/);
    assert.match(brief, /Share GeoSpy/);
    assert.match(brief, /GeoSpy account/);
    assert.match(brief, /GeoSpy Brief is included/);
    assert.doesNotMatch(brief, /Share WorldMonitor/);
    assert.doesNotMatch(brief, /WorldMonitor Brief is included/);

    const unified = readFileSync(new URL('../src/components/UnifiedSettings.ts', import.meta.url), 'utf8');
    assert.match(unified, /access GeoSpy data programmatically/);
    assert.match(unified, /your GeoSpy account/);
    assert.match(unified, /GeoSpy Pro account/);
    assert.match(unified, /GeoSpy API plan limit upgrade/);
    assert.doesNotMatch(unified, /access WorldMonitor data programmatically/);
    assert.doesNotMatch(unified, /your WorldMonitor account/);
  });
});
