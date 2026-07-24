import { Panel } from './Panel';
import { createLazyClient, getRpcBaseUrl, rpcFetch } from '@/services/rpc-client';
import { t } from '@/services/i18n';
import { escapeHtml, unsafeRawHtml } from '@/utils/sanitize';
import { formatPrice, formatChange, getChangeClass } from '@/utils';
import { miniSparkline } from '@/utils/sparkline';
import { resolveCountryMapFocus } from '@/utils/country-map-focus';
import { toIso2 } from '@/utils/country-codes';

import type { ListGulfQuotesResponse, GulfQuote } from '@/generated/client/worldmonitor/market/v1/service_client';
import { getHydratedData } from '@/services/bootstrap';
import { MarketServiceClient } from '@/services/generated-rpc-clients';

const getMarketClient = createLazyClient(() => new MarketServiceClient(getRpcBaseUrl(), { fetch: rpcFetch }));

export class GulfEconomiesPanel extends Panel {
  private onMapFocus: ((lat: number, lon: number) => void) | null = null;

  constructor() {
    super({ id: 'gulf-economies', title: t('panels.gulfEconomies'), infoTooltip: t('components.gulfEconomies.infoTooltip') });
  }

  public setLocationClickHandler(handler: (lat: number, lon: number) => void): void {
    this.onMapFocus = handler;
  }

  public async fetchData(): Promise<void> {
    try {
      const hydrated = getHydratedData('gulfQuotes') as ListGulfQuotesResponse | undefined;
      if (hydrated?.quotes?.length) {
        if (!this.element?.isConnected) return;
        this.renderGulf(hydrated);
        void getMarketClient().listGulfQuotes({}).then(data => {
          if (!this.element?.isConnected || !data.quotes?.length) return;
          this.renderGulf(data);
        }).catch(() => {});
        return;
      }
      const data = await getMarketClient().listGulfQuotes({});
      if (!this.element?.isConnected) return;
      this.renderGulf(data);
    } catch (err) {
      if (this.isAbortError(err)) return;
      if (!this.element?.isConnected) return;
      this.showError(t('common.failedMarketData'), () => void this.fetchData());
    }
  }

  private focusCountry(code?: string): void {
    if (!this.onMapFocus || !code) return;
    const focus = resolveCountryMapFocus(code);
    if (!focus) return;
    this.onMapFocus(focus.lat, focus.lon);
  }

  private renderSection(title: string, quotes: GulfQuote[]): string {
    if (quotes.length === 0) return '';
    const rows = quotes.map(q => {
      // Clickable when we have a resolvable ISO2 — map focus needs hydrated
      // geometry at click time (same contract as other country-focus panels).
      const clickable = Boolean(toIso2(q.country));
      const attrs = clickable
        ? ` class="market-item gulf-quote-clickable" data-country="${escapeHtml(q.country)}" role="button" tabindex="0" title="Show on map"`
        : ' class="market-item"';
      return `
    <div${attrs}>
      <div class="market-info">
        <span class="market-name">${q.flag} ${escapeHtml(q.name)}</span>
        <span class="market-symbol">${escapeHtml(q.country || q.symbol)}</span>
      </div>
      <div class="market-data">
        ${miniSparkline(q.sparkline, q.change)}
        <span class="market-price">${formatPrice(q.price)}</span>
        <span class="market-change ${getChangeClass(q.change)}">${formatChange(q.change)}</span>
      </div>
    </div>
  `;
    }).join('');
    return `<div class="gulf-section"><div class="gulf-section-title">${escapeHtml(title)}</div>${rows}</div>`;
  }

  private renderGulf(data: ListGulfQuotesResponse): void {
    if (!data.quotes?.length) {
      if (data.rateLimited) {
        this.showError(t('common.rateLimitedMarket'), () => void this.fetchData());
        return;
      }
      this.setSafeContent(unsafeRawHtml(
        `<div class="panel-empty">${escapeHtml(t('common.failedMarketData'))}</div>`,
        'legacy Panel.setContent() migration',
      ));
      return;
    }

    const indices = data.quotes.filter(q => q.type === 'index');
    const currencies = data.quotes.filter(q => q.type === 'currency');
    const oil = data.quotes.filter(q => q.type === 'oil');

    const html =
      this.renderSection(t('panels.gulfIndices'), indices) +
      this.renderSection(t('panels.gulfCurrencies'), currencies) +
      this.renderSection(t('panels.gulfOil'), oil);

    this.setSafeContent(unsafeRawHtml(`${html}
      <style>
        .gulf-quote-clickable { cursor: pointer; border-radius: 4px; }
        .gulf-quote-clickable:hover { background: color-mix(in srgb, var(--text-dim) 6%, transparent); }
        .gulf-quote-clickable:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
      </style>
    `, 'legacy Panel.setContent() migration'));

    const activate = (el: HTMLElement): void => {
      this.focusCountry(el.dataset.country);
    };
    this.content?.querySelectorAll<HTMLElement>('.gulf-quote-clickable').forEach(el => {
      el.addEventListener('click', () => activate(el));
      el.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        activate(el);
      });
    });
  }
}
