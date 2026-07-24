#!/usr/bin/env node
console.log(`
GeoSpy working demo
===================

Checkout and run:
  git fetch origin
  git checkout cursor/geospy-working-demo-4151
  npm ci
  npm run dev
  # → http://localhost:3000  (use localhost, not 127.0.0.1)

Validate:
  npm run geospy:smoke
  npm run geospy:verify   # smoke + focused product tests

Try overhead (differentiator):
  • Tip → Try now / flat hint → Predict passes
  • Right-click map → Predict Overhead Passes
  • Share / live URL keeps ?overhead=1 while popup open
  • Cmd/Ctrl+K → "overhead" · Cmd/Ctrl+Shift+O
  • Settings → Satellites (prefs footer, or Cmd/Ctrl+K → Settings → Satellites)
  • Next-pass chip after you close the popup (empty window → tune elevation)

Try panel → map polish:
  • Insights stories / focal / convergence → map
  • Economic BIS · Gold CB reserves · Macro tiles · CII
  • Airline Intel ops airports + tracking positions
  • AI Forecasts Map chip · Renewable regions
  • Energy Risk Hormuz / EU Gas / disruptions tiles
  • Cross-Source theater cards · Supply Chain Map + mineral producers
  • Oil Inventories IEA chips · Energy Complex IEA/LNG rows
  • Cascade affected countries · Fuel/Grocery/Debt/Trade/Sanctions/…
  • Cmd/Ctrl+K → “GeoSpy Analyst” / “Settings → Satellites”

Integration PR: https://github.com/lukasdoering/geospy-v2/pull/6
`);
