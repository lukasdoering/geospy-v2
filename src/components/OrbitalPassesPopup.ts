import type { OverheadPass } from '@/services/satellites';
import { BRAND } from '@/config/brand';
import {
  getOverheadPassSettings,
  type OverheadPassSettings,
} from '@/services/overhead-pass-settings';

let activePopup: HTMLElement | null = null;
let clickOutsideHandler: ((e: MouseEvent) => void) | null = null;
let previouslyFocused: HTMLElement | null = null;

function onEscape(e: KeyboardEvent): void {
  if (e.key === 'Escape') dismissOrbitalPassesPopup();
}

function clearClickOutsideListener(): void {
  if (!clickOutsideHandler) return;
  document.removeEventListener('click', clickOutsideHandler);
  clickOutsideHandler = null;
}

export function dismissOrbitalPassesPopup(): void {
  if (!activePopup) {
    clearClickOutsideListener();
    document.removeEventListener('keydown', onEscape);
    return;
  }
  activePopup.remove();
  activePopup = null;
  clearClickOutsideListener();
  document.removeEventListener('keydown', onEscape);
  const restore = previouslyFocused;
  previouslyFocused = null;
  if (restore && typeof restore.focus === 'function' && document.contains(restore)) {
    try {
      restore.focus();
    } catch {
      /* ignore */
    }
  }
}

export function formatEta(aosMs: number, nowMs: number): string {
  const deltaMin = Math.max(0, Math.round((aosMs - nowMs) / 60_000));
  if (deltaMin < 1) return 'now';
  if (deltaMin < 60) return `in ${deltaMin}m`;
  const h = Math.floor(deltaMin / 60);
  const m = deltaMin % 60;
  return m ? `in ${h}h ${m}m` : `in ${h}h`;
}

export function formatUtc(ms: number): string {
  return new Date(ms).toISOString().slice(11, 16) + 'Z';
}

/** Pass duration from AOS→LOS, e.g. "4m" or "1h 2m". */
export function formatPassDuration(aosMs: number, losMs: number): string {
  const sec = Math.max(0, Math.round((losMs - aosMs) / 1000));
  if (sec < 60) return `${sec}s`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** Median gap between consecutive AOS times, in minutes. Null if <2 passes. */
export function medianRevisitMinutes(aosTimesMs: number[]): number | null {
  if (aosTimesMs.length < 2) return null;
  const sorted = [...aosTimesMs].sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    gaps.push((sorted[i]! - sorted[i - 1]!) / 60_000);
  }
  gaps.sort((a, b) => a - b);
  const mid = Math.floor(gaps.length / 2);
  const median = gaps.length % 2 === 0
    ? (gaps[mid - 1]! + gaps[mid]!) / 2
    : gaps[mid]!;
  return Math.round(median);
}

export function countPassTypes(passes: OverheadPass[]): { sar: number; optical: number; other: number } {
  let sar = 0;
  let optical = 0;
  let other = 0;
  for (const p of passes) {
    const t = (p.type || '').toLowerCase();
    if (t === 'sar') sar++;
    else if (t === 'optical') optical++;
    else other++;
  }
  return { sar, optical, other };
}

export function buildOverheadPassesSummaryLine(
  passes: OverheadPass[],
  nowMs: number = Date.now(),
): string {
  const uniqueSats = new Set(passes.map((p) => p.noradId));
  const next = passes[0]!;
  const windowHours = Math.max(
    1,
    Math.round((Math.max(...passes.map((p) => p.aosMs)) - nowMs) / 3_600_000),
  );
  const parts = [
    `${passes.length} pass${passes.length === 1 ? '' : 'es'}`,
    `${uniqueSats.size} sat${uniqueSats.size === 1 ? '' : 's'}`,
    `next ${formatEta(next.aosMs, nowMs)}`,
    `~${windowHours}h window`,
  ];
  const median = medianRevisitMinutes(passes.map((p) => p.aosMs));
  if (median != null) parts.push(`median revisit ~${median}m`);
  const types = countPassTypes(passes);
  const typeBits: string[] = [];
  if (types.sar) typeBits.push(`${types.sar} SAR`);
  if (types.optical) typeBits.push(`${types.optical} optical`);
  if (typeBits.length) parts.push(typeBits.join(' · '));
  return parts.join(' · ');
}

export function formatOverheadSettingsSummary(
  settings: OverheadPassSettings = getOverheadPassSettings(),
): string {
  return `Threshold ${settings.minElevationDeg}° · window ${settings.windowMinutes / 60}h · Settings → Satellites`;
}

export function defaultOverheadEmptyDetail(
  settings: OverheadPassSettings = getOverheadPassSettings(),
): string {
  return `No LEO imaging passes above ${settings.minElevationDeg}° elevation in the next ${settings.windowMinutes / 60} hours.`;
}

export function buildOverheadShareUrl(
  lat: number,
  lng: number,
  href: string = typeof window !== 'undefined' ? window.location.href : 'https://localhost/',
): string {
  const url = new URL(href);
  url.searchParams.set('lat', lat.toFixed(4));
  url.searchParams.set('lon', lng.toFixed(4));
  url.searchParams.set('overhead', '1');
  return url.toString();
}

export function buildOverheadPassesClipboardText(
  lat: number,
  lng: number,
  passes: OverheadPass[],
  nowMs: number = Date.now(),
): string {
  const header = `${BRAND.name} overhead passes @ ${lat.toFixed(3)}°, ${lng.toFixed(3)}°`;
  if (passes.length === 0) return `${header}\n(no passes in window)`;
  const lines = passes.map((p) => {
    const dur = formatPassDuration(p.aosMs, p.losMs);
    return `- ${p.name} (${p.type || 'sat'}/${p.country || '—'}) ${formatEta(p.aosMs, nowMs)} AOS ${formatUtc(p.aosMs)} LOS ${formatUtc(p.losMs)} max ${Math.round(p.maxElevationDeg)}° · ${dur}`;
  });
  return [header, ...lines].join('\n');
}

function buildSinglePassClipboardLine(p: OverheadPass, nowMs: number): string {
  const dur = formatPassDuration(p.aosMs, p.losMs);
  return `${p.name} (${p.type || 'sat'}/${p.country || '—'}) ${formatEta(p.aosMs, nowMs)} AOS ${formatUtc(p.aosMs)} LOS ${formatUtc(p.losMs)} max ${Math.round(p.maxElevationDeg)}° · ${dur}`;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export interface OrbitalPassesPopupOptions {
  loading?: boolean;
  error?: string;
  /** Invoked when the user clicks Retry after an error. */
  onRetry?: () => void;
  /** Invoked when the user clicks Refresh on a finished result/empty state. */
  onRefresh?: () => void;
  /** Optional empty-state copy when there are zero passes. */
  emptyDetail?: string;
  /** Optional prefs footer (elevation / window). Defaults to current settings. */
  settingsSummary?: string | false;
}

export function showOrbitalPassesPopup(
  screenX: number,
  screenY: number,
  lat: number,
  lng: number,
  passes: OverheadPass[],
  options: OrbitalPassesPopupOptions = {},
): void {
  dismissOrbitalPassesPopup();
  previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const popup = el('div', 'orbital-passes-popup');
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-label', 'Overhead satellite passes');
  popup.setAttribute('data-testid', 'orbital-passes-popup');

  const clampedX = Math.min(Math.max(8, screenX), window.innerWidth - 320);
  const clampedY = Math.min(Math.max(8, screenY), window.innerHeight - 280);
  popup.style.left = `${clampedX}px`;
  popup.style.top = `${clampedY}px`;

  const header = el('div', 'orbital-passes-header');
  const headerText = el('div');
  const titleEl = el('div', 'orbital-passes-title', 'Overhead passes');
  titleEl.setAttribute('data-testid', 'orbital-passes-title');
  const coordsEl = el('div', 'orbital-passes-coords', `${lat.toFixed(3)}°, ${lng.toFixed(3)}°`);
  coordsEl.setAttribute('data-testid', 'orbital-passes-coords');
  headerText.append(titleEl, coordsEl);
  const headerActions = el('div', 'orbital-passes-header-actions');
  if (!options.loading && options.onRefresh) {
    const refreshBtn = el('button', 'orbital-passes-copy', 'Refresh');
    refreshBtn.type = 'button';
    refreshBtn.setAttribute('aria-label', 'Refresh overhead passes');
    refreshBtn.setAttribute('data-testid', 'orbital-passes-refresh');
    refreshBtn.title = 'Refresh';
    refreshBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      options.onRefresh?.();
    });
    headerActions.append(refreshBtn);
  }
  if (!options.loading && !options.error) {
    const shareBtn = el('button', 'orbital-passes-copy', 'Share');
    shareBtn.type = 'button';
    shareBtn.setAttribute('aria-label', 'Copy share link for these coordinates');
    shareBtn.setAttribute('data-testid', 'orbital-passes-share');
    shareBtn.title = 'Copy share link (?overhead=1)';
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = buildOverheadShareUrl(lat, lng);
      void navigator.clipboard.writeText(text).then(() => {
        shareBtn.textContent = 'Copied';
        setTimeout(() => {
          if (shareBtn.isConnected) shareBtn.textContent = 'Share';
        }, 1200);
      }).catch(() => {});
    });
    headerActions.append(shareBtn);
  }
  if (!options.loading && !options.error && passes.length > 0) {
    const copyBtn = el('button', 'orbital-passes-copy', 'Copy');
    copyBtn.type = 'button';
    copyBtn.setAttribute('aria-label', 'Copy pass summary');
    copyBtn.setAttribute('data-testid', 'orbital-passes-copy');
    copyBtn.title = 'Copy summary';
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = buildOverheadPassesClipboardText(lat, lng, passes);
      void navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'Copied';
        setTimeout(() => {
          if (copyBtn.isConnected) copyBtn.textContent = 'Copy';
        }, 1200);
      }).catch(() => {});
    });
    headerActions.append(copyBtn);
  }
  const closeBtn = el('button', 'orbital-passes-close', '×');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.setAttribute('data-testid', 'orbital-passes-close');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissOrbitalPassesPopup();
  });
  headerActions.append(closeBtn);
  header.append(headerText, headerActions);
  popup.append(header);

  if (options.loading) {
    const loading = el('div', 'orbital-passes-loading');
    loading.setAttribute('aria-busy', 'true');
    loading.append(
      el('div', 'orbital-passes-skeleton'),
      el('div', 'orbital-passes-skeleton'),
      el('div', 'orbital-passes-skeleton'),
      el('div', 'orbital-passes-empty', 'Computing overhead passes…'),
    );
    popup.append(loading);
  } else if (options.error) {
    const errBox = el('div', 'orbital-passes-empty');
    errBox.append(document.createTextNode(options.error));
    if (options.onRetry) {
      const retry = el('button', 'orbital-passes-retry', 'Retry');
      retry.type = 'button';
      retry.setAttribute('data-testid', 'orbital-passes-retry');
      retry.addEventListener('click', (e) => {
        e.stopPropagation();
        options.onRetry?.();
      });
      errBox.append(document.createElement('br'), retry);
    }
    popup.append(errBox);
  } else if (passes.length === 0) {
    popup.append(el(
      'div',
      'orbital-passes-empty',
      options.emptyDetail ?? defaultOverheadEmptyDetail(),
    ));
  } else {
    const list = el('ul', 'orbital-passes-list');
    const nowMs = Date.now();
    const summary = el(
      'div',
      'orbital-passes-summary',
      buildOverheadPassesSummaryLine(passes, nowMs),
    );
    popup.append(summary);
    for (const p of passes) {
      const row = el('li', 'orbital-passes-row');
      row.tabIndex = 0;
      row.setAttribute('role', 'button');
      row.setAttribute('aria-label', `Copy ${p.name} pass details`);
      row.title = 'Click to copy this pass';
      const nameRow = el('div', 'orbital-passes-name-row');
      nameRow.append(el('div', 'orbital-passes-name', p.name));
      const typeBadge = el('span', `orbital-passes-type orbital-passes-type--${(p.type || 'sat').toLowerCase()}`, p.type || 'sat');
      nameRow.append(typeBadge);
      row.append(nameRow);
      const meta = el('div', 'orbital-passes-meta');
      meta.append(
        el('span', undefined, p.country || '—'),
        el('span', undefined, formatEta(p.aosMs, nowMs)),
        el('span', undefined, `AOS ${formatUtc(p.aosMs)}`),
        el('span', undefined, `LOS ${formatUtc(p.losMs)}`),
        el('span', undefined, `max ${Math.round(p.maxElevationDeg)}°`),
        el('span', undefined, formatPassDuration(p.aosMs, p.losMs)),
      );
      row.append(meta);
      const copyRow = () => {
        const text = buildSinglePassClipboardLine(p, nowMs);
        void navigator.clipboard.writeText(text).catch(() => {});
      };
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        copyRow();
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          copyRow();
        }
      });
      list.append(row);
    }
    popup.append(list);
  }

  if (!options.loading && options.settingsSummary !== false) {
    const footer = el(
      'div',
      'orbital-passes-prefs',
      options.settingsSummary ?? formatOverheadSettingsSummary(),
    );
    footer.setAttribute('data-testid', 'orbital-passes-prefs');
    popup.append(footer);
  }

  clickOutsideHandler = () => dismissOrbitalPassesPopup();
  requestAnimationFrame(() => {
    if (clickOutsideHandler) {
      document.addEventListener('click', clickOutsideHandler, { once: true });
    }
  });
  popup.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('keydown', onEscape);
  document.body.appendChild(popup);
  activePopup = popup;
  // Focus the close control so Escape + screen readers have a clear entry point.
  requestAnimationFrame(() => {
    if (closeBtn.isConnected) closeBtn.focus();
  });
}
