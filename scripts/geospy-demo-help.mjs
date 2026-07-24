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

Try overhead (differentiator):
  • Tip → Try now / flat hint → Predict passes
  • Right-click map → Predict Overhead Passes
  • Share / live URL keeps ?overhead=1 while popup open
  • Cmd/Ctrl+K → "overhead" · Cmd/Ctrl+Shift+O
  • Settings → Satellites (or prefs footer on popup)
  • Next-pass chip after you close the popup

Try other polish:
  • Markets / Commodities / Crypto → click sparkline chart
  • Disease Outbreaks / Satellite Fires / Internet Disruptions → row click focuses map
  • Security Advisories → search country/title

Integration PR: https://github.com/lukasdoering/geospy-v2/pull/6
`);
