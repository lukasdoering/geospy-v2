#!/usr/bin/env node
/**
 * Local / desktop cleanup helper for GeoSpy (WorldMonitor fork).
 *
 * Usage:
 *   node scripts/uninstall-local.mjs --dry-run
 *   node scripts/uninstall-local.mjs --yes
 *   node scripts/uninstall-local.mjs --yes --app-data
 *
 * Does NOT delete system packages or AppImages you installed manually —
 * those must be removed with your OS package manager / file manager.
 * This script cleans repo build artifacts and optional desktop app data dirs.
 */

import { existsSync, rmSync, readdirSync, statSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const yes = args.has('--yes') || args.has('-y');
const includeAppData = args.has('--app-data');

function repoTargets() {
  return [
    'node_modules',
    'blog-site/node_modules',
    'pro-test/node_modules',
    'dist',
    'blog-site/dist',
    'src-tauri/target',
    '.vercel',
    'playwright-report',
    'test-results',
  ].map((rel) => path.join(repoRoot, rel));
}

function appDataTargets() {
  const home = homedir();
  const os = platform();
  if (os === 'darwin') {
    return [
      path.join(home, 'Library/Application Support/app.worldmonitor.desktop'),
      path.join(home, 'Library/Application Support/world-monitor'),
      path.join(home, 'Library/Caches/app.worldmonitor.desktop'),
      path.join(home, 'Library/Caches/world-monitor'),
      path.join(home, 'Library/Preferences/app.worldmonitor.desktop.plist'),
    ];
  }
  if (os === 'win32') {
    const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    const local = process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
    return [
      path.join(appData, 'app.worldmonitor.desktop'),
      path.join(appData, 'world-monitor'),
      path.join(local, 'app.worldmonitor.desktop'),
      path.join(local, 'world-monitor'),
    ];
  }
  const xdgConfig = process.env.XDG_CONFIG_HOME || path.join(home, '.config');
  const xdgData = process.env.XDG_DATA_HOME || path.join(home, '.local', 'share');
  const xdgCache = process.env.XDG_CACHE_HOME || path.join(home, '.cache');
  return [
    path.join(xdgConfig, 'app.worldmonitor.desktop'),
    path.join(xdgConfig, 'world-monitor'),
    path.join(xdgData, 'app.worldmonitor.desktop'),
    path.join(xdgData, 'world-monitor'),
    path.join(xdgCache, 'app.worldmonitor.desktop'),
    path.join(xdgCache, 'world-monitor'),
  ];
}

function pathExists(p) {
  try {
    return existsSync(p);
  } catch {
    return false;
  }
}

function describe(p) {
  if (!pathExists(p)) return null;
  try {
    const st = statSync(p);
    if (st.isDirectory()) {
      const kids = readdirSync(p).length;
      return `${p}  (dir, ${kids} entries)`;
    }
    return `${p}  (file, ${st.size} bytes)`;
  } catch {
    return p;
  }
}

function removePath(p) {
  if (dryRun) {
    console.log(`[dry-run] would remove ${p}`);
    return;
  }
  rmSync(p, { recursive: true, force: true });
  console.log(`removed ${p}`);
}

function main() {
  if (!yes && !dryRun) {
    console.error('Refusing to run without --dry-run or --yes.');
    console.error('Examples:');
    console.error('  node scripts/uninstall-local.mjs --dry-run');
    console.error('  node scripts/uninstall-local.mjs --yes');
    console.error('  node scripts/uninstall-local.mjs --yes --app-data');
    process.exit(2);
  }

  const targets = [
    ...repoTargets(),
    ...(includeAppData ? appDataTargets() : []),
  ];

  const present = targets.map(describe).filter(Boolean);
  if (present.length === 0) {
    console.log('Nothing to clean.');
    return;
  }

  console.log(dryRun ? 'Dry run — candidates:' : 'Removing:');
  for (const line of present) console.log(`  ${line}`);

  for (const p of targets) {
    if (pathExists(p)) removePath(p);
  }

  if (!includeAppData) {
    console.log('\nTip: pass --app-data to also clear desktop app config/cache dirs.');
  }
  console.log('Manual desktop binary cleanup (if you installed a package):');
  console.log('  macOS: drag GeoSpy/World Monitor out of Applications');
  console.log('  Windows: Settings → Apps → uninstall World Monitor / GeoSpy');
  console.log('  Linux: delete the .AppImage, or uninstall the distro package you used');
}

main();
