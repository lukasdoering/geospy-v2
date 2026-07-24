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
  npm run geospy:verify   # smoke + focused product tests (~106)

Try overhead (differentiator):
  • Tip → Try now / flat hint → Predict passes
  • Right-click map → Predict Overhead Passes
  • Share / live URL keeps ?overhead=1 while popup open
  • Cmd/Ctrl+K → "overhead" · Cmd/Ctrl+Shift+O
  • Settings → Satellites (prefs footer, or Cmd/Ctrl+K → Settings → Satellites)
  • Next-pass chip after you close the popup (empty window → tune elevation)

Try other polish:
  • Markets / Commodities / Crypto → click sparkline chart
  • Disease / Fires / Internet / Population / Radiation → row/card → map
  • Security Advisories → search + click card to focus country
  • UCDP / Climate / Displacement / Radiation → click enables matching layer
  • Thermal Escalation → search region/status, then click/keyboard → map
  • Strategic Risk/Posture, Geo/Tech Hubs, GCC Investments → keyboard → map
  • Chokepoint Status chip / Hormuz Tracker “Show on map” → chokepoint
  • Tech Events 📍 pin → map + techEvents layer
  • Infrastructure Cascade select/analyze → map focus
  • OREF Sirens row → Tel Aviv focus
  • Energy/trade/finance panels → row/card → map (shortages, pipelines, storage, disruptions, crisis, gulf, sanctions, trade, procurement, Big Mac, national debt)
  • Cmd/Ctrl+K → “GeoSpy Analyst” / “Settings → Satellites”

Integration PR: https://github.com/lukasdoering/geospy-v2/pull/6
`);
