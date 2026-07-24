#!/usr/bin/env node
console.log(`
GeoSpy working demo
===================

Checkout and run:
  git fetch origin
  git checkout cursor/geospy-working-demo-4151
  npm ci
  npm run dev
  # → http://localhost:3000

Validate:
  npm run geospy:smoke
  npm run geospy:verify

Try:
  • Tip → Try now (first visit)
  • Right-click map → Predict Overhead Passes
  • Share button on popup → ?overhead=1 deep link
  • Cmd/Ctrl+K → "overhead" or "last overhead"
  • Cmd/Ctrl+Shift+O → passes at map center
  • Settings → Satellites (elevation / window)
  • Cmd/Ctrl+K → Markets → click a sparkline

Integration PR: https://github.com/lukasdoering/geospy-v2/pull/6
`);
