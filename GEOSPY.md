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

## Markets terminal chart

Cmd/Ctrl+K → **Panel: Markets**, then click a ticker with a sparkline (in-panel hint).

## Docs

- [CHANGELOG-GEOSPY.md](CHANGELOG-GEOSPY.md) — fork product changelog
- [README.md](README.md) — overview + highlights
- [CONTRIBUTING.md](CONTRIBUTING.md) — contribution mechanics
- [docs/solutions/best-practices/geospy-overhead-pass-product-surface.md](docs/solutions/best-practices/geospy-overhead-pass-product-surface.md) — overhead product surface notes
