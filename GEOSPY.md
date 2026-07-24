# GeoSpy — Getting Started

GeoSpy is an AGPL-3.0 fork of [WorldMonitor](https://github.com/koala73/worldmonitor).
API hosts stay on upstream WorldMonitor by default so local/dev has live data with zero env setup. User-facing chrome is GeoSpy.

## Recommended demo checkout

```bash
git fetch origin
git checkout cursor/geospy-working-demo-4151
npm ci
npm run dev
# → http://localhost:3000

npm run geospy:smoke    # brand + overhead surface strings
npm run geospy:verify   # smoke + focused product tests
npm run geospy:demo     # print try-this checklist
```

Integration PR: https://github.com/lukasdoering/geospy-v2/pull/6

## Try the GeoSpy differentiator (overhead passes)

1. Wait for the tip → click **Try now**, or press **Cmd/Ctrl+Shift+O**
2. Or use the flat-map hint **Predict passes** button
3. Or right-click the map → **Predict Overhead Passes**
4. Or Cmd/Ctrl+K → type `overhead`
5. Or open a deep link: `/?lat=40.7128&lon=-74.0060&overhead=1`
6. In the popup: Refresh / Share / Copy, SAR·Optical filters; click the prefs footer to open Settings → Satellites
7. Or Cmd/Ctrl+K → **Open Settings → Satellites** to jump straight to elevation / look-ahead
8. After you run a prediction once, a **Next SAR/optical…** chip stays in the corner (click to reopen; empty window → tune elevation)

## Markets / commodities / crypto charts

Cmd/Ctrl+K → **Panel: Markets** (or Commodities / Crypto), then click a ticker with a sparkline (dismissible in-panel hint).

## Panel → map polish

- **Disease Outbreaks** — search + click a row to focus the map
- **Satellite Fires** — click a region row to focus FIRMS detections
- **Internet Disruptions** — click an outage/anomaly row to focus the map
- **Population Exposure** — click a card to focus the event location
- **Security Advisories** — search by country / title; click a card to focus the country
- **Radiation Watch** — keyboard-accessible row → map focus (enables radiation layer)
- **UCDP / Climate / Displacement** — row click enables the matching map layer
- **Thermal Escalation** — search region/status; click/keyboard focuses the map (enables natural/FIRMS layer)
- **Geo / Tech Hubs** — keyboard-accessible row → map focus
- **Tech Events** — pin focuses the map and enables the techEvents layer
- **OREF Sirens** — alert/history row focuses Israel (Tel Aviv)
- **GCC Investments** — keyboard-accessible row → map focus
- **Chokepoint Status** — chip opens the chokepoint on the map
- **Hormuz Tracker** — Show on map opens Hormuz Strait
- **Infrastructure Cascade** — select/analyze focuses the asset on the map
- **Fuel Shortage Registry** — row click/keyboard focuses the country + enables shortage pins
- **Pipeline Status / Storage Atlas** — row click/keyboard focuses the asset + enables energy layers
- **Energy Disruptions** — row click/keyboard flies to the asset from cached coords, then opens the drawer
- **Country Deep Dive energy atlas / map energy layers** — enable destination panels before open-detail
- **Energy Crisis Tracker** — policy row click/keyboard focuses the country
- **Gulf Economies** — country quote click/keyboard focuses the map
- **Sanctions Pressure** — country/entry row click/keyboard focuses the country
- **Trade Policy** — restriction/barrier card click/keyboard focuses the reporting country
- **Global Procurement** — tender card click/keyboard focuses the country (ISO2)
- **Big Mac Index / National Debt** — country row click/keyboard focuses the map
- **Fuel Prices** — country row click/keyboard focuses the map (calm empty when no data)
- **Grocery Basket** — country header click/keyboard focuses the map (calm empty when no data)
- **Consumer Prices (World)** — inflation row click/keyboard focuses the country
- **AI Regulation** — countries tab card click/keyboard focuses the country
- **Tech Readiness** — ranking row click/keyboard focuses the country (ISO3)
- **Economic Calendar** — event row click/keyboard focuses the country (skips EU aggregates)
- **Macro Indicators** — “Show on map” focuses US / Euro Area (DE) / China for the active tab
- **FAO Food Price Index** — calm empty when no chart points (not a red error)
- **Market Breadth / Social Velocity / Climate News** — calm empty when no data
- **Fear & Greed / FSI / Gold / National Debt / Macro** — calm empty when unavailable
- **Pipeline / Fuel Shortage / Energy Disruptions / Earnings / WSB / Oil / ETF / Cross-Source** — calm empty when unavailable or empty
- **Storage Atlas / Disease Outbreaks / Global Procurement** — calm empty when unavailable
- **CII** — country click/keyboard focuses the map and opens the country brief
- **Insights** — country focal cards, convergence zones, and story cards (when a country code is present) click/keyboard focus the map
- **Economic (BIS)** — policy rate / real EER / credit-to-GDP country cards focus the map
- **Gold Intelligence** — central-bank reserve holders/buyers/sellers focus the map
- **Airline Intel** — ops airport rows and tracking positions focus the map

## Implementation note

Country panel→map focus uses `resolveCountryMapFocus` (`src/utils/country-map-focus.ts`), a Null Island–guarded centroid helper.

## Docs

- [CHANGELOG-GEOSPY.md](CHANGELOG-GEOSPY.md) — fork product changelog
- [README.md](README.md) — overview + highlights
- [CONTRIBUTING.md](CONTRIBUTING.md) — contribution mechanics
- [docs/solutions/best-practices/geospy-overhead-pass-product-surface.md](docs/solutions/best-practices/geospy-overhead-pass-product-surface.md) — overhead product surface notes
