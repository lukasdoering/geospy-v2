import type { OverheadPass } from '@/services/satellites';

let activePopup: HTMLElement | null = null;

function onEscape(e: KeyboardEvent): void {
  if (e.key === 'Escape') dismissOrbitalPassesPopup();
}

export function dismissOrbitalPassesPopup(): void {
  if (!activePopup) return;
  activePopup.remove();
  activePopup = null;
  document.removeEventListener('keydown', onEscape);
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

export function buildOverheadPassesClipboardText(
  lat: number,
  lng: number,
  passes: OverheadPass[],
  nowMs: number = Date.now(),
): string {
  const header = `GeoSpy overhead passes @ ${lat.toFixed(3)}°, ${lng.toFixed(3)}°`;
  if (passes.length === 0) return `${header}\n(no passes in window)`;
  const lines = passes.map((p) => {
    const dur = formatPassDuration(p.aosMs, p.losMs);
    return `- ${p.name} (${p.type || 'sat'}/${p.country || '—'}) ${formatEta(p.aosMs, nowMs)} ${formatUtc(p.aosMs)} max ${Math.round(p.maxElevationDeg)}° · ${dur}`;
  });
  return [header, ...lines].join('\n');
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
  /** Optional empty-state copy when there are zero passes. */
  emptyDetail?: string;
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
  const popup = el('div', 'orbital-passes-popup');
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-label', 'Overhead satellite passes');

  const clampedX = Math.min(Math.max(8, screenX), window.innerWidth - 320);
  const clampedY = Math.min(Math.max(8, screenY), window.innerHeight - 280);
  popup.style.left = `${clampedX}px`;
  popup.style.top = `${clampedY}px`;

  const header = el('div', 'orbital-passes-header');
  const headerText = el('div');
  headerText.append(
    el('div', 'orbital-passes-title', 'Overhead passes'),
    el('div', 'orbital-passes-coords', `${lat.toFixed(3)}°, ${lng.toFixed(3)}°`),
  );
  const headerActions = el('div', 'orbital-passes-header-actions');
  if (!options.loading && !options.error && passes.length > 0) {
    const copyBtn = el('button', 'orbital-passes-copy', 'Copy');
    copyBtn.type = 'button';
    copyBtn.setAttribute('aria-label', 'Copy pass summary');
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
      options.emptyDetail
        || 'No LEO imaging passes above 20° elevation in the next 3 hours.',
    ));
  } else {
    const list = el('ul', 'orbital-passes-list');
    const nowMs = Date.now();
    const uniqueSats = new Set(passes.map((p) => p.noradId));
    const next = passes[0]!;
    const windowHours = Math.max(
      1,
      Math.round((Math.max(...passes.map((p) => p.aosMs)) - nowMs) / 3_600_000),
    );
    const summary = el(
      'div',
      'orbital-passes-summary',
      `${passes.length} pass${passes.length === 1 ? '' : 'es'} · ${uniqueSats.size} sat${uniqueSats.size === 1 ? '' : 's'} · next ${formatEta(next.aosMs, nowMs)} · ~${windowHours}h window`,
    );
    popup.append(summary);
    for (const p of passes) {
      const row = el('li', 'orbital-passes-row');
      const nameRow = el('div', 'orbital-passes-name-row');
      nameRow.append(el('div', 'orbital-passes-name', p.name));
      const typeBadge = el('span', `orbital-passes-type orbital-passes-type--${(p.type || 'sat').toLowerCase()}`, p.type || 'sat');
      nameRow.append(typeBadge);
      row.append(nameRow);
      const meta = el('div', 'orbital-passes-meta');
      meta.append(
        el('span', undefined, p.country || '—'),
        el('span', undefined, formatEta(p.aosMs, nowMs)),
        el('span', undefined, formatUtc(p.aosMs)),
        el('span', undefined, `max ${Math.round(p.maxElevationDeg)}°`),
        el('span', undefined, formatPassDuration(p.aosMs, p.losMs)),
      );
      row.append(meta);
      list.append(row);
    }
    popup.append(list);
  }

  requestAnimationFrame(() => {
    document.addEventListener('click', dismissOrbitalPassesPopup, { once: true });
  });
  popup.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('keydown', onEscape);
  document.body.appendChild(popup);
  activePopup = popup;
}
