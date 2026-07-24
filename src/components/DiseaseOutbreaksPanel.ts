import { Panel } from './Panel';
import { t } from '@/services/i18n';
import { escapeHtml, sanitizeUrl, unsafeRawHtml } from '@/utils/sanitize';
import { fetchDiseaseOutbreaks, type DiseaseOutbreakItem } from '@/services/disease-outbreaks';
import { renderFollowedOnlyChip, type FollowedOnlyChipHandle } from '@/utils/followed-only-chip';
import { isFollowed, subscribe as subscribeFollowed } from '@/services/followed-countries';
import { toIso2 } from '@/utils/country-codes';
import { setTrustedHtml, trustedHtml } from '@/utils/dom-utils';
import { outbreakLocationLabel, resolveOutbreakMapFocus } from '@/utils/disease-outbreak-focus';

function alertColor(level: string): string {
  if (level === 'alert') return '#e74c3c';
  if (level === 'warning') return '#e67e22';
  return '#f1c40f';
}

function alertLabel(level: string): string {
  if (level === 'alert') return t('components.diseaseOutbreaks.levels.alert');
  if (level === 'warning') return t('components.diseaseOutbreaks.levels.warning');
  return t('components.diseaseOutbreaks.levels.watch');
}

function relativeTime(ms: number): string {
  if (!ms) return '';
  const diff = Date.now() - ms;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return t('components.diseaseOutbreaks.time.justNow');
  if (h < 24) return t('components.diseaseOutbreaks.time.hoursAgo', { count: h });
  const d = Math.floor(h / 24);
  return t('components.diseaseOutbreaks.time.daysAgo', { count: d });
}

export class DiseaseOutbreaksPanel extends Panel {
  private _outbreaks: DiseaseOutbreakItem[] = [];
  private _hasData = false;
  private _severityFilter = '';
  private _search = '';
  private _followedOnlyChip: FollowedOnlyChipHandle | null = null;
  private _followedOnlyHost: HTMLElement | null = null;
  private _followedOnlyTeardown: (() => void) | null = null;
  private _followedUnsub: (() => void) | null = null;
  private onMapFocus?: (lat: number, lon: number) => void;

  constructor() {
    super({
      id: 'disease-outbreaks',
      title: t('components.diseaseOutbreaks.title'),
      showCount: false,
      infoTooltip: `${t('components.diseaseOutbreaks.infoTooltip')}<br><br><em>${t('components.diseaseOutbreaks.methodologyNote')}</em>`,
    });
    this.content.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('a')) return;
      const btn = target.closest<HTMLElement>('[data-filter]');
      if (btn) {
        const next = btn.dataset.filter ?? '';
        this._severityFilter = next === this._severityFilter ? '' : next;
        this._render();
        return;
      }
      const row = target.closest<HTMLElement>('[data-disease-focus]');
      if (!row) return;
      const lat = Number(row.dataset.lat);
      const lon = Number(row.dataset.lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        this.onMapFocus?.(lat, lon);
      }
    });
    this.content.addEventListener('input', (e) => {
      const inp = e.target as HTMLInputElement;
      if (inp.dataset.role === 'search') {
        this._search = inp.value;
        this._render({ restoreSearchFocus: true });
      }
    });
    this.content.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const row = (e.target as HTMLElement).closest<HTMLElement>('[data-disease-focus]');
      if (!row) return;
      e.preventDefault();
      const lat = Number(row.dataset.lat);
      const lon = Number(row.dataset.lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        this.onMapFocus?.(lat, lon);
      }
    });
    this._mountFollowedOnlyChip();
  }

  public setCountryClickHandler(handler: (lat: number, lon: number) => void): void {
    this.onMapFocus = handler;
  }

  /**
   * Mount the U7 "Followed only" chip into the panel header. The chip
   * persists per `panelId` so the user's choice survives reload but
   * doesn't bleed across unrelated panels. Re-render on toggle and on
   * watchlist change so the row filter follows the chip state.
   */
  private _mountFollowedOnlyChip(): void {
    const host = document.createElement('span');
    host.className = 'panel-header-followed-only-host';
    this._followedOnlyHost = host;
    this._followedOnlyChip = renderFollowedOnlyChip({
      panelId: 'disease-outbreaks',
      onChange: () => {
        if (this._hasData) this._render();
      },
    });
    if (this._followedOnlyChip.html === '') {
      // Feature flag off — don't even insert the host.
      return;
    }
    setTrustedHtml(host, trustedHtml(this._followedOnlyChip.html, 'legacy direct innerHTML migration'));
    // Insert BEFORE the close button so close stays rightmost. The Panel
    // base appends `.panel-close-btn` first; a plain `appendChild` would
    // land the chip after close and break the user expectation that X
    // is always the last header control.
    const closeBtn = this.header.querySelector('.panel-close-btn');
    if (closeBtn) {
      this.header.insertBefore(host, closeBtn);
    } else {
      this.header.appendChild(host);
    }
    this._followedOnlyTeardown = this._followedOnlyChip.attach(host);
    // Re-filter on external watchlist change too — the chip itself
    // already re-renders disabled state via its own subscription, but
    // the panel still needs to refresh its row pass.
    this._followedUnsub = subscribeFollowed(() => {
      if (this._hasData) this._render();
    });
  }

  public async fetchData(): Promise<boolean> {
    this.showLoading();
    try {
      const data = await fetchDiseaseOutbreaks();
      if (!data.outbreaks?.length) {
        if (!this._hasData) {
          this.setSafeContent(unsafeRawHtml(
            `<div class="panel-empty">${escapeHtml(t('components.diseaseOutbreaks.errors.noData'))}</div>`,
            'legacy Panel.setContent() migration',
          ));
        }
        return false;
      }
      this._outbreaks = [...data.outbreaks].sort((a, b) => {
        const levelOrder = { alert: 0, warning: 1, watch: 2 };
        const la = levelOrder[a.alertLevel as keyof typeof levelOrder] ?? 3;
        const lb = levelOrder[b.alertLevel as keyof typeof levelOrder] ?? 3;
        if (la !== lb) return la - lb;
        return (b.publishedAt ?? 0) - (a.publishedAt ?? 0);
      });
      this._hasData = true;
      this._render();
      return true;
    } catch (e) {
      if (!this._hasData) {
        const msg = e instanceof Error ? e.message : t('components.diseaseOutbreaks.errors.failedToLoad');
        this.setSafeContent(unsafeRawHtml(
          `<div class="panel-empty">${escapeHtml(msg)}</div>`,
          'legacy Panel.setContent() migration',
        ));
      }
      return false;
    }
  }

  public updateData(outbreaks: DiseaseOutbreakItem[]): void {
    this._outbreaks = [...outbreaks].sort((a, b) => {
      const levelOrder = { alert: 0, warning: 1, watch: 2 };
      const la = levelOrder[a.alertLevel as keyof typeof levelOrder] ?? 3;
      const lb = levelOrder[b.alertLevel as keyof typeof levelOrder] ?? 3;
      if (la !== lb) return la - lb;
      return (b.publishedAt ?? 0) - (a.publishedAt ?? 0);
    });
    this._hasData = this._outbreaks.length > 0;
    if (this._hasData) this._render();
  }

  private _render(opts: { restoreSearchFocus?: boolean } = {}): void {
    const counts = { alert: 0, warning: 0, watch: 0 };
    for (const o of this._outbreaks) {
      const k = o.alertLevel as keyof typeof counts;
      if (k in counts) counts[k]++;
    }

    let filtered = this._outbreaks;
    if (this._severityFilter) {
      filtered = filtered.filter((o) => o.alertLevel === this._severityFilter);
    }
    if (this._search.trim()) {
      const q = this._search.trim().toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.disease.toLowerCase().includes(q) ||
          (o.location || '').toLowerCase().includes(q) ||
          (o.countryCode || '').toLowerCase().includes(q),
      );
    }

    // U7 — "Followed only" filter chip. Hide rows whose `countryCode`
    // is not in the user's watchlist. Items without a country code are
    // always dropped when the chip is active (we can't prove they
    // belong to a followed country).
    const followedOnlyActive = this._followedOnlyChip?.isActive() === true;
    if (followedOnlyActive) {
      filtered = filtered.filter((o) => {
        const code = toIso2(o.countryCode ?? '');
        return code ? isFollowed(code) : false;
      });
    }

    const searchValue = escapeHtml(this._search);
    const filterBar = `<div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;align-items:center">
      <input data-role="search" data-testid="disease-outbreaks-search" type="search" placeholder="Search disease / location" value="${searchValue}" style="flex:1;min-width:120px;font-size:11px;padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--text)" />
      ${counts.alert > 0 ? `<button data-filter="alert" style="font-size:10px;padding:2px 8px;border-radius:10px;border:1px solid rgba(231,76,60,0.4);background:${this._severityFilter === 'alert' ? 'rgba(231,76,60,0.2)' : 'transparent'};color:#e74c3c;cursor:pointer">${escapeHtml(t('components.diseaseOutbreaks.filters.alert', { count: counts.alert }))}</button>` : ''}
      ${counts.warning > 0 ? `<button data-filter="warning" style="font-size:10px;padding:2px 8px;border-radius:10px;border:1px solid rgba(230,126,34,0.4);background:${this._severityFilter === 'warning' ? 'rgba(230,126,34,0.2)' : 'transparent'};color:#e67e22;cursor:pointer">${escapeHtml(t('components.diseaseOutbreaks.filters.warning', { count: counts.warning }))}</button>` : ''}
      ${counts.watch > 0 ? `<button data-filter="watch" style="font-size:10px;padding:2px 8px;border-radius:10px;border:1px solid rgba(241,196,15,0.4);background:${this._severityFilter === 'watch' ? 'rgba(241,196,15,0.2)' : 'transparent'};color:#f1c40f;cursor:pointer">${escapeHtml(t('components.diseaseOutbreaks.filters.watch', { count: counts.watch }))}</button>` : ''}
    </div>`;

    const rows = filtered.map((o) => {
      const color = alertColor(o.alertLevel);
      const label = alertLabel(o.alertLevel);
      const age = relativeTime(o.publishedAt);
      const location = outbreakLocationLabel(o);
      const focus = resolveOutbreakMapFocus(o);
      const sourceLink = o.sourceUrl
        ? `<a href="${escapeHtml(sanitizeUrl(o.sourceUrl))}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);text-decoration:none;font-size:9px">${escapeHtml(o.sourceName || t('components.diseaseOutbreaks.sourceFallback'))}</a>`
        : (o.sourceName ? `<span style="font-size:9px;color:var(--text-dim)">${escapeHtml(o.sourceName)}</span>` : '');

      const focusAttrs = focus
        ? ` data-disease-focus="1" data-lat="${focus.lat}" data-lon="${focus.lon}" role="button" tabindex="0" title="Show on map" style="border-bottom:1px solid var(--border);padding:8px 0;cursor:pointer"`
        : ' style="border-bottom:1px solid var(--border);padding:8px 0"';

      return `<div${focusAttrs}>
        <div style="display:flex;align-items:flex-start;gap:6px">
          <span style="flex-shrink:0;font-size:9px;font-weight:700;padding:2px 5px;border-radius:3px;background:${color}22;color:${color};margin-top:1px">${label}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;color:var(--text);line-height:1.3">${escapeHtml(o.disease)}</div>
            ${location ? `<div style="font-size:11px;color:var(--text-dim);margin-top:2px">${escapeHtml(location)}</div>` : ''}
            ${o.summary ? `<div style="font-size:10px;color:var(--text-dim);margin-top:3px;line-height:1.4">${escapeHtml(o.summary.slice(0, 120))}${o.summary.length > 120 ? '…' : ''}</div>` : ''}
            <div style="display:flex;gap:8px;margin-top:4px;align-items:center">
              ${sourceLink}
              ${age ? `<span style="font-size:9px;color:var(--text-dim)">${escapeHtml(age)}</span>` : ''}
            </div>
          </div>
        </div>
      </div>`;
    }).join('');

    const emptyMessage = followedOnlyActive
      ? 'No items in your followed countries. Add countries by tapping the star, or turn off this filter.'
      : t('components.diseaseOutbreaks.empty');
    const empty = filtered.length === 0
      ? `<div style="padding:16px;text-align:center;color:var(--text-dim);font-size:12px">${escapeHtml(emptyMessage)}</div>`
      : '';

    this.setSafeContent(unsafeRawHtml(`
      ${filterBar}
      <div style="overflow-y:auto;max-height:420px">
        ${rows || empty}
      </div>
      <div style="margin-top:6px;font-size:9px;color:var(--text-dim)">${escapeHtml(t('components.diseaseOutbreaks.attribution'))}</div>
    `, 'legacy Panel.setContent() migration'));

    if (opts.restoreSearchFocus) {
      const inp = this.content.querySelector<HTMLInputElement>('input[data-role="search"]');
      if (inp) {
        inp.focus();
        const len = inp.value.length;
        inp.setSelectionRange(len, len);
      }
    }
  }

  public override destroy(): void {
    if (this._followedOnlyTeardown) {
      try {
        this._followedOnlyTeardown();
      } catch {
        /* ignore */
      }
      this._followedOnlyTeardown = null;
    }
    if (this._followedUnsub) {
      try {
        this._followedUnsub();
      } catch {
        /* ignore */
      }
      this._followedUnsub = null;
    }
    this._followedOnlyHost?.remove();
    this._followedOnlyHost = null;
    this._followedOnlyChip = null;
    super.destroy();
  }
}
