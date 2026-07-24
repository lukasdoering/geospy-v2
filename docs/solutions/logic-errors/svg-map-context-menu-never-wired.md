---
title: SVG map fallback never received map context-menu callbacks
date: 2026-07-24
category: logic-errors
module: src/components/MapContainer.ts
problem_type: logic_error
component: ui_component
severity: medium
symptoms:
  - "Right-click on the map showed only the browser context menu."
  - "Open Country Brief / Copy Coordinates / Predict Overhead Passes were unreachable on WebGL-fallback sessions."
root_cause: logic_error
resolution_type: code_fix
tags: [map, context-menu, svg-fallback, webgl, deckgl, geospy]
---

# SVG map fallback never received map context-menu callbacks

## Problem

`MapContainer.onMapContextMenu()` forwarded the callback to globe and DeckGL renderers only. Environments that fall back to the SVG `Map` renderer (missing WebGL2, mobile, DeckGL init failure) never registered a listener, so `preventDefault()` never ran and the browser menu won.

DeckGL also attached `contextmenu` only to the MapLibre canvas. Some automation and overlay stacks deliver the event to the wrapper container instead, which again fell through to the browser menu.

## Symptoms

- Custom dark menu with Open Country Brief / Copy Coordinates never appeared on SVG sessions.
- GeoSpy overhead-pass prediction (map context menu entry) looked unimplemented in manual QA on the cloud agent browser.
- Left-click country briefs still worked; only right-click was dead.

## Solution

1. Implement `setOnMapContextMenu` on SVG `Map.ts` using the same projection invert math as the country-click path.
2. Wire `this.svgMap?.setOnMapContextMenu(callback)` from `MapContainer.onMapContextMenu`.
3. Also listen on the DeckGL map **container**, and detach that listener on teardown.
4. Lock the contracts with `tests/map-context-menu-wiring.test.mts`.

## Prevention

- Any new map renderer must be included in `MapContainer` callback forwarding (country click, context menu, state change).
- Prefer container+canvas dual listeners for WebGL maps when the host page has chrome overlays.
- Keep a static wiring test that fails if SVG/DeckGL context-menu registration regresses.
