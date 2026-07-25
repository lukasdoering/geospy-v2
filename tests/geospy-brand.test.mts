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

  it('brands Pro FAQ and plans body copy as GeoSpy', () => {
    const pro = readFileSync(new URL('../public/pro/index.html', import.meta.url), 'utf8');
    assert.match(pro, /Is GeoSpy still free\?/);
    assert.match(pro, /GeoSpy is primarily a global intelligence platform/);
    assert.match(pro, /What is MCP in GeoSpy\?/);
    assert.match(pro, /plug GeoSpy into Claude/);
    assert.match(pro, /use GeoSpy as a tool/);
    assert.match(pro, /building on GeoSpy data/);
    assert.match(pro, /Keep using GeoSpy for free/);
    assert.match(pro, /GeoSpy Analyst/);
    assert.match(pro, /<h2>GeoSpy Pro — The Geopolitical AI Layer<\/h2>/);
    assert.match(pro, /"@type": "SoftwareApplication"[\s\S]*?"name": "GeoSpy"/);
    assert.doesNotMatch(pro, /Is World Monitor still free\?/);
    assert.doesNotMatch(pro, /WM Analyst/);
    assert.doesNotMatch(pro, /plug WorldMonitor into Claude/);
    assert.doesNotMatch(pro, /Keep using World Monitor for free/);
    assert.doesNotMatch(pro, /<h2>World Monitor Pro — The Geopolitical AI Layer<\/h2>/);
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
    assert.match(unified, /\$\{BRAND\.name\} API plan limit upgrade/);
    assert.match(unified, /\$\{BRAND\.name\} billing is managed outside Dodo/);
    assert.doesNotMatch(unified, /access WorldMonitor data programmatically/);
    assert.doesNotMatch(unified, /your WorldMonitor account/);
  });

  it('brands intelligence story share/download surfaces as GeoSpy', () => {
    const share = readFileSync(new URL('../src/services/story-share.ts', import.meta.url), 'utf8');
    assert.match(share, /Generated by \$\{BRAND\.name\}/);
    assert.match(share, /Data via \$\{BRAND\.name\}/);
    assert.match(share, /Intelligence Brief - \$\{BRAND\.name\}/);
    assert.doesNotMatch(share, /@WorldMonitorApp/);
    assert.doesNotMatch(share, /Data via World Monitor/);
    assert.doesNotMatch(share, /Intelligence Brief - World Monitor/);

    const modal = readFileSync(new URL('../src/components/StoryModal.ts', import.meta.url), 'utf8');
    assert.match(modal, /BRAND\.name\.toLowerCase\(\)/);
    assert.doesNotMatch(modal, /worldmonitor-\$\{/);
    assert.doesNotMatch(modal, /-worldmonitor\.png/);

    const renderer = readFileSync(new URL('../src/services/story-renderer.ts', import.meta.url), 'utf8');
    assert.match(renderer, /fillText\(BRAND\.nameUpper/);
    assert.match(renderer, /fillText\(BRAND\.tagline/);
    assert.doesNotMatch(renderer, /WORLDMONITOR\.APP/);
  });

  it('brands referral share, WebMCP search copy, and license-key label as GeoSpy', () => {
    const referral = readFileSync(new URL('../src/services/referral.ts', import.meta.url), 'utf8');
    assert.match(referral, /Join me on \$\{BRAND\.name\}:/);
    assert.match(referral, /title: BRAND\.name/);
    assert.doesNotMatch(referral, /Join me on WorldMonitor/);
    assert.doesNotMatch(referral, /title: 'WorldMonitor'/);

    const webmcp = readFileSync(new URL('../src/services/webmcp.ts', import.meta.url), 'utf8');
    assert.match(webmcp, /entities tracked by GeoSpy/);
    assert.doesNotMatch(webmcp, /entities tracked by World Monitor/);

    const settings = readFileSync(new URL('../src/services/settings-constants.ts', import.meta.url), 'utf8');
    assert.match(settings, /WORLDMONITOR_API_KEY: 'GeoSpy License Key'/);
    assert.doesNotMatch(settings, /World Monitor License Key/);
  });

  it('brands export headers and MCP grant consent copy as GeoSpy', () => {
    const exp = readFileSync(new URL('../src/utils/export.ts', import.meta.url), 'utf8');
    assert.match(exp, /# \$\{BRAND\.name\} Export/);
    assert.match(exp, /This \$\{BRAND\.name\} evidence bundle/);
    assert.match(exp, /# \$\{BRAND\.name\} Evidence Bundle/);
    assert.match(exp, /filename = 'geospy-export'/);
    assert.match(exp, /`geospy-\$\{timestamp\}`/);
    assert.doesNotMatch(exp, /# WorldMonitor Export/);
    assert.doesNotMatch(exp, /This WorldMonitor evidence bundle/);
    assert.doesNotMatch(exp, /# WorldMonitor Evidence Bundle/);
    assert.doesNotMatch(exp, /worldmonitor-export/);
    assert.doesNotMatch(exp, /`worldmonitor-\$\{timestamp\}`/);

    const grant = readFileSync(new URL('../src/mcp-grant-main.ts', import.meta.url), 'utf8');
    assert.match(grant, /A GeoSpy Pro subscription is required/);
    assert.doesNotMatch(grant, /A WorldMonitor Pro subscription is required/);
  });

  it('brands map-layer explanation source strings as GeoSpy', () => {
    const layers = readFileSync(new URL('../src/config/map-layer-definitions.ts', import.meta.url), 'utf8');
    assert.match(layers, /GeoSpy conflict-zone registry/);
    assert.match(layers, /GeoSpy CII scoring service/);
    assert.match(layers, /GeoSpy maritime service/);
    assert.match(layers, /GeoSpy strategic-waterways registry/);
    assert.match(layers, /GeoSpy trade-route registry/);
    assert.match(layers, /GeoSpy hotspot registry/);
    assert.doesNotMatch(layers, /WorldMonitor conflict-zone registry/);
    assert.doesNotMatch(layers, /WorldMonitor CII scoring service/);
    assert.doesNotMatch(layers, /WorldMonitor maritime service/);
    assert.doesNotMatch(layers, /WorldMonitor strategic-waterways registry/);
    assert.doesNotMatch(layers, /WorldMonitor trade-route registry/);
    assert.doesNotMatch(layers, /WorldMonitor hotspot registry/);
  });
});
