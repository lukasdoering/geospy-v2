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

function formatEta(aosMs: number, nowMs: number): string {
  const deltaMin = Math.max(0, Math.round((aosMs - nowMs) / 60_000));
  if (deltaMin < 1) return 'now';
  if (deltaMin < 60) return `in ${deltaMin}m`;
  const h = Math.floor(deltaMin / 60);
  const m = deltaMin % 60;
  return m ? `in ${h}h ${m}m` : `in ${h}h`;
}

function formatUtc(ms: number): string {
  return new Date(ms).toISOString().slice(11, 16) + 'Z';
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

export function showOrbitalPassesPopup(
  screenX: number,
  screenY: number,
  lat: number,
  lng: number,
  passes: OverheadPass[],
  options: { loading?: boolean; error?: string } = {},
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
  const closeBtn = el('button', 'orbital-passes-close', '×');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissOrbitalPassesPopup();
  });
  header.append(headerText, closeBtn);
  popup.append(header);

  if (options.loading) {
    popup.append(el('div', 'orbital-passes-empty', 'Computing overhead passes…'));
  } else if (options.error) {
    popup.append(el('div', 'orbital-passes-empty', options.error));
  } else if (passes.length === 0) {
    popup.append(el('div', 'orbital-passes-empty', 'No LEO imaging passes above 20° elevation in the next 3 hours.'));
  } else {
    const list = el('ul', 'orbital-passes-list');
    const nowMs = Date.now();
    const uniqueSats = new Set(passes.map((p) => p.noradId));
    const windowHours = Math.max(
      1,
      Math.round((Math.max(...passes.map((p) => p.aosMs)) - nowMs) / 3_600_000),
    );
    const summary = el(
      'div',
      'orbital-passes-summary',
      `${passes.length} pass${passes.length === 1 ? '' : 'es'} · ${uniqueSats.size} sat${uniqueSats.size === 1 ? '' : 's'} · next ~${windowHours}h`,
    );
    popup.append(summary);
    for (const p of passes) {
      const row = el('li', 'orbital-passes-row');
      row.append(el('div', 'orbital-passes-name', p.name));
      const meta = el('div', 'orbital-passes-meta');
      meta.append(
        el('span', undefined, p.type || 'sat'),
        el('span', undefined, p.country || '—'),
        el('span', undefined, formatEta(p.aosMs, nowMs)),
        el('span', undefined, formatUtc(p.aosMs)),
        el('span', undefined, `max ${Math.round(p.maxElevationDeg)}°`),
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
