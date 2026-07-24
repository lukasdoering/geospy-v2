# GeoSpy v2

**Real-time global intelligence dashboard** — geopolitics, military, markets, climate, cyber, maritime, and aviation on one live map.

GeoSpy is an [AGPL-3.0](LICENSE) fork of [WorldMonitor](https://github.com/koala73/worldmonitor). Upstream product, docs, and live API hosts remain at [worldmonitor.app](https://www.worldmonitor.app). This repository develops the GeoSpy product identity and fork-specific features on top of that codebase.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Quick Start

```bash
git clone https://github.com/lukasdoering/geospy-v2.git
cd geospy-v2
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000) (override with `DEV_PORT` in `.env.local`). The app runs with no environment variables; live data is fetched from the upstream WorldMonitor edge by default.

**Recommended checkout for the fullest GeoSpy demo surface** (brand + satellites + overnight fixes):

```bash
git fetch origin
git checkout cursor/geospy-working-demo-4151
npm ci
npm run dev
# http://localhost:3000
npm run geospy:smoke
npm run geospy:verify   # smoke + focused overhead/renewable tests
npm run geospy:demo     # print try-this checklist
```

Variant-specific development:

```bash
npm run dev:tech
npm run dev:finance
npm run dev:commodity
npm run dev:happy
npm run dev:energy
```

## GeoSpy Highlights (this fork)

- **Overhead pass prediction** — right-click the map, tip **Try now**, Cmd/Ctrl+Shift+O, or Cmd/Ctrl+K → “overhead passes”
- **Orbital polish** — duration, type badges, AOS/LOS, prefs footer, copy/retry/refresh, revisit stats, a11y, flat-map coherence hint
- **GeoSpy product chrome** — header/footer/offline branding with explicit WorldMonitor attribution; API hosts stay upstream for zero-env data
- **Markets chart** — Cmd/Ctrl+K → “Markets” / “Panel: Markets”, then click a ticker sparkline (in-panel hint)
- **Integration branch** — [`cursor/geospy-working-demo-4151`](https://github.com/lukasdoering/geospy-v2/tree/cursor/geospy-working-demo-4151) / [PR #6](https://github.com/lukasdoering/geospy-v2/pull/6)
- **Changelog** — [CHANGELOG-GEOSPY.md](CHANGELOG-GEOSPY.md)

## What It Does

- **500+ curated news feeds** across 15 categories, AI-synthesized into briefs
- **Dual map engine** — 3D globe (globe.gl) and WebGL flat map (deck.gl) with 56 map layer types
- **Cross-stream correlation** — military, economic, disaster, and escalation signal convergence
- **Country Instability Index (CII)** — server-authoritative CII v8 stress scoring for 31 Tier-1 countries
- **Country Resilience Index (CRI)** — broader 196-country resilience ranking universe
- **Finance radar** — exchanges, commodities, crypto, and market composites
- **Local AI** — run with Ollama when you want offline inference
- **6 site variants** from a single codebase (world, tech, finance, commodity, happy, energy)
- **Native desktop app** (Tauri 2) for macOS, Windows, and Linux
- **25 languages** with native-language feeds and RTL support

## Attribution

Copyright for the WorldMonitor codebase belongs to its upstream authors. GeoSpy retains the AGPL-3.0 license and credits [koala73/worldmonitor](https://github.com/koala73/worldmonitor). See [CONTRIBUTING.md](CONTRIBUTING.md) and [ARCHITECTURE.md](ARCHITECTURE.md) for how the system fits together.

## Support Status

| Surface | Status | Notes |
|---------|--------|-------|
| Local `npm run dev` SPA | Working | Zero-env; uses upstream API hosts for live feeds |
| Upstream `worldmonitor.app` variants | Upstream | Stable public deployments of the parent project |
| GeoSpy desktop branding | In progress | Tauri `productName` / window title use GeoSpy; binary id still `world-monitor` for compatibility |

## Documentation

- [GeoSpy changelog](CHANGELOG-GEOSPY.md)
- [Architecture](ARCHITECTURE.md)
- [Agent entry point](AGENTS.md)
- [Upstream docs](https://www.worldmonitor.app/docs/documentation)
