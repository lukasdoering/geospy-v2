# GeoSpy changelog (fork)

Notable product work on top of WorldMonitor. Prefer the integration branch
`cursor/geospy-working-demo-4151` (PR #6) for a single checkout that includes everything.

## Unreleased (overnight build)

### Product
- GeoSpy brand identity (header, footer, offline, Tauri productName, honest meta)
- Demo chrome copy: widget preview, Analyst tooltip, Keyword Monitors use GeoSpy (not WM)
- Overhead satellite pass prediction (SGP4) from map context menu
- Discoverability: Cmd+K, Cmd/Ctrl+Shift+O, last-location rerun, first-run tip (Try now CTA), flat-map coherence hint
- Popup polish: duration, type badges, copy, Retry/Refresh, revisit median + SAR/optical counts, testids, prefs footer, AOS/LOS, a11y, Share deep-link, SAR/Optical filters
- Clipboard feedback: Share/Copy/row click show Copied / Copy failed / Copy unavailable (shared helper for brief, map coords, route explorer)
- Prefs footer opens Settings → Satellites; tip auto-hide no longer permanently dismisses
- Flat-map hint **Predict passes** CTA; live URL keeps `?overhead=1` while popup is open
- Persistent **Next overhead** chip from last predicted location
- Disease Outbreaks: working search, location fallback, row click → map focus
- Satellite Fires: region row → map focus; clearer empty state
- Internet Disruptions: outage/anomaly row → map focus
- Security Advisories: country/title search + card click → country map focus
- Population Exposure: card click → map focus
- Radiation Watch: keyboard-accessible row → map focus
- Panel→map enables matching layers (UCDP, climate, displacement, radiation)
- Displacement: guard Null Island + keyboard map focus
- Overhead prefs footer: await/retry Settings cold-open before focusing Satellites elevation
- Thermal Escalation: region/status search + keyboard map focus
- UCDP Events: keyboard-accessible row → map focus
- Climate Anomalies: keyboard-accessible row → map focus
- Cmd+K: **Open Settings → Satellites** (overhead prefs)
- Strategic Risk / Posture: keyboard map focus + Null Island guards; drop posture debug logs
- Next overhead chip: empty-window CTA to tune elevation in Settings
- Chat Analyst panel title/export: GeoSpy Analyst (not WM)
- Geo Hubs / Tech Hubs: keyboard map focus + calm empty state (not error)
- Tech Events: fix dead map-pin CustomEvent — wire setCenter + enable techEvents layer; Cmd+K techevent flies to coords
- Locked-panel / runtime-config copy: GeoSpy license (not World Monitor)
- OREF Sirens: alert/history row click → map focus (Tel Aviv)
- Cmd+K: Panel: GeoSpy Analyst (not WM Analyst)
- GCC Investments: keyboard map focus
- Chokepoint Status strip: chip → openChokepoint + calm empty state
- Hormuz Tracker: Show on map → open Hormuz Strait chokepoint
- Strategic Posture: remove noisy vessel-augment console.log spam
- Infrastructure Cascade: wire select/analyze → map focus (chokepoint open / setCenter)
- Strategic Risk: wire dead `enable-panel` CustomEvent → enablePanelById
- Breaking news banner click: enable target panel (retry mount) then scroll/highlight
- Thermal Escalation map focus also enables the natural (FIRMS) layer
- Settings panel registry: GeoSpy Analyst (not WM Analyst)
- Energy Disruptions row click: enable pipeline/storage panel before open-detail
- Country Deep Dive energy atlas + map energy layer clicks: enable destination panels before open-detail (pipeline / storage / fuel shortages)
- Fix hubs panel CSS orphan brace (broke Vite PostCSS / app boot)
- Route Explorer empty/lazy states: GeoSpy brand (not WorldMonitor)
- Latest Brief cover/share/empty states + Settings API keys/MCP copy: GeoSpy brand
- Fuel Shortage Registry: row click/keyboard → country map focus + enable fuelShortages pins
- Pipeline Status / Storage Atlas: row click/keyboard → map focus + enable pipelines / storageFacilities layers
- Energy Disruptions: row click/keyboard → map focus from cached asset coords + enable energy layers (still opens asset drawer)
- Pro landing (`/pro`): hero/title/og chrome → GeoSpy Pro (FAQ/schema still describe upstream product facts)
- index.html marketing links point to local `/pro` (GeoSpy Pro)
- Energy Crisis Tracker: policy row click/keyboard → country map focus
- Gulf Economies: country quote click/keyboard → map focus + calm empty (not error)
- Sanctions Pressure: country/entry row click/keyboard → country map focus
- Trade Policy: restriction/barrier card click/keyboard → reporting country map focus
- Global Procurement: tender card click/keyboard → country map focus (ISO2)
- Big Mac Index / National Debt: country row click/keyboard → map focus
- Fuel Prices: country row click/keyboard → map focus + calm empty
- Grocery Basket: country header click/keyboard → map focus + calm empty
- FAO Food Price Index: calm empty when no chart points
- Consumer Prices World tab: inflation row click/keyboard → country map focus
- AI Regulation countries tab: country card click/keyboard → map focus
- Tech Readiness: ranking row click/keyboard → country map focus (ISO3)
- Economic Calendar: event row click/keyboard → country map focus + calm empty
- Market Breadth / Social Velocity / Climate News: calm empty when no data
- Macro Indicators: Show on map → US/EU/China focus + calm empty
- Fear & Greed / FSI / Gold / National Debt: calm empty when unavailable
- Pipeline / Fuel Shortage / Energy Disruptions: calm empty when registry unavailable
- Earnings / WSB / Oil Inventories / ETF Flows / Cross-Source Signals: calm empty when no data
- Storage Atlas / Disease Outbreaks / Global Procurement: calm empty when unavailable
- CII country click also focuses the map (then opens country brief); keyboard a11y + calm unavailable
- Insights: country focal-point cards + convergence zones click/keyboard → map focus
- Insights story cards with a country code focus the map (click/keyboard; links still win)
- Economic Indicators BIS country cards (policy rate / EER / credit-to-GDP) focus the map
- Gold Intelligence CB reserve holders/movers focus the map; load failure uses calm empty
- Calm empties: National Debt load failure, Gulf Economies catch/rate-limit, Climate News load failure
- Airline Intel ops airports + live tracking positions focus the map
- Expand country display-name aliases (China, Ukraine, etc.) for panel→map focus
- Hormuz / Yield Curve / AAII / Liquidity / COT / Macro Signals / Stablecoin / Chokepoint Strip / Energy Crisis: calm empty when unavailable
- settings.html / embed.html GeoSpy titles
- Deep link: `?overhead=1&lat=&lon=` or `?overhead=lat,lon` opens pass prediction on load
- Settings → Satellites: elevation threshold + look-ahead window + shortcuts help
- Satellites layer default-on (full variant)
- Markets expandable terminal price chart (dismissible in-panel hint; commodities + crypto parity)
- `npm run geospy:smoke` / `geospy:demo` / `geospy:verify` helpers
- Embed dialog preview title uses GeoSpy brand

### Reliability / trust / security (selected upstream ports)
- Fail-closed source provenance; news classify-cache validation
- ML worker load retry; sidecar fetch-semaphore + Authorization strip
- LLM model quarantine; tech-events cache scope; rss-proxy error preserve
- Entity-decode shared helper; consumer-prices implausible movers
- Settings a11y focus; Sign In visibility; AuthHeaderWidget cleanup
- sharp ≥0.35 (blog-site); tauri ≥2.11.1; humanitarian health wiring
- Renewable Energy panel discloses static fallback (parity with ProgressCharts)
- Satellite catalog: CelesTrak TLE fallback when Redis seed is empty (local/dev)
- SAR name classification (SENTINEL-1A etc.) on CelesTrak parse + Redis `toSatellite` + ais-relay seed

### Docs
- README GeoSpy highlights; CONTRIBUTING fork preamble; solutions note for overhead-pass surface
- [GEOSPY.md](GEOSPY.md) getting-started guide

## How to run
```bash
git checkout cursor/geospy-working-demo-4151
npm ci && npm run dev
```
