---
title: GeoSpy overhead-pass prediction — product surface and discoverability
date: 2026-07-24
category: best-practices
module: src/components/OrbitalPassesPopup.ts
problem_type: incomplete_feature
component: ui_component
severity: medium
symptoms:
  - "Satellite overhead prediction existed only as a buried right-click action."
  - "Flat-map users with satellites default-on saw no live orbits and no explanation."
  - "Empty/error/loading states read as unfinished prototype UI."
root_cause: incomplete_feature
resolution_type: feature_addition
tags: [geospy, satellites, overhead-passes, sgp4, command-palette, discoverability]
---

# GeoSpy overhead-pass prediction — product surface and discoverability

## Problem

GeoSpy’s differentiating orbital feature (client-side SGP4 overhead-pass prediction) shipped as a context-menu action only. Users on the default flat map with `satellites: true` saw imagery footprints rather than live orbits (orbits require 3D globe), with no hint that right-click prediction still worked. The popup itself lacked duration, retry, copy, and typed summary polish.

## Solution

1. **Prediction API** — `predictNextPasses` / `predictOverheadPassesAt` in `src/services/satellites.ts`.
2. **Context menu** — “Predict Overhead Passes” via `CountryIntelManager` (SVG + DeckGL + globe wired).
3. **Cmd+K** — `view:overhead-passes` runs prediction at map center.
4. **Popup polish** — skeleton loading, type badges, duration, copy summary, Retry, median revisit + SAR/optical counts.
5. **Prefs** — Settings → Satellites (min elevation 10/20/30°, look-ahead 3/6/12h).
6. **Discoverability** — first-run tip + fixed flat-map coherence hint with Switch to 3D.
7. **Integration** — all of the above on `cursor/geospy-working-demo-4151` (PR #6).

## Prevention

- New map-layer defaults that behave differently across renderers need an explicit user-facing coherence hint.
- Product-differentiating actions should appear in the command palette, not only in context menus.
