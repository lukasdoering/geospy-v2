import { Panel } from './Panel';
import { t } from '@/services/i18n';
import { escapeHtml, unsafeRawHtml } from '@/utils/sanitize';
import { getHydratedData } from '@/services/bootstrap';
import { createLazyClient, getRpcBaseUrl, rpcFetch } from '@/services/rpc-client';
import { resolveCountryMapFocus } from '@/utils/country-map-focus';

import type { ListGroceryBasketPricesResponse } from '@/generated/client/worldmonitor/economic/v1/service_client';
import { EconomicServiceClient } from '@/services/generated-rpc-clients';

const getEconomicClient = createLazyClient(() => new EconomicServiceClient(getRpcBaseUrl(), { fetch: rpcFetch }));

export class GroceryBasketPanel extends Panel {
  private onMapFocus: ((lat: number, lon: number) => void) | null = null;

  constructor() {
    super({ id: 'grocery-basket', title: t('panels.groceryBasket'), infoTooltip: t('components.groceryBasket.infoTooltip') });
  }

  public setLocationClickHandler(handler: (lat: number, lon: number) => void): void {
    this.onMapFocus = handler;
  }

  private focusCountry(code?: string): void {
    if (!this.onMapFocus || !code) return;
    const focus = resolveCountryMapFocus(code);
    if (!focus) return;
    this.onMapFocus(focus.lat, focus.lon);
  }

  public async fetchData(): Promise<void> {
    try {
      const hydrated = getHydratedData('groceryBasket') as ListGroceryBasketPricesResponse | undefined;
      if (hydrated?.countries?.length) {
        if (!this.element?.isConnected) return;
        this.renderBasket(hydrated);
        void getEconomicClient().listGroceryBasketPrices({}).then(data => {
          if (!this.element?.isConnected || !data.countries?.length) return;
          this.renderBasket(data);
        }).catch(() => {});
        return;
      }
      const data = await getEconomicClient().listGroceryBasketPrices({});
      if (!this.element?.isConnected) return;
      this.renderBasket(data);
    } catch (err) {
      if (this.isAbortError(err)) return;
      if (!this.element?.isConnected) return;
      this.setSafeContent(unsafeRawHtml(
        `<div class="panel-empty">${escapeHtml(t('common.failedMarketData'))}</div>`,
        'legacy Panel.setContent() migration',
      ));
    }
  }

  private renderBasket(data: ListGroceryBasketPricesResponse): void {
    if (!data.countries?.length) {
      this.setSafeContent(unsafeRawHtml(
        `<div class="panel-empty">${escapeHtml(t('common.noDataAvailable'))}</div>`,
        'legacy Panel.setContent() migration',
      ));
      return;
    }

    const countries = data.countries;
    const itemIds = countries[0]?.items?.map(i => i.itemId) ?? [];

    const headerCells = countries.map(c => {
      const code = (c.code || '').trim().toUpperCase();
      return `<th class="gb-country-header gb-country-clickable" data-country-code="${escapeHtml(code)}" role="button" tabindex="0" title="Show ${escapeHtml(c.name)} on map">${escapeHtml(c.flag)}<br><span class="gb-country-name">${escapeHtml(c.name)}</span></th>`;
    }).join('');

    const rows = itemIds.map(itemId => {
      const firstItem = countries[0]?.items?.find(i => i.itemId === itemId);
      // Per-item min/max USD: only countries with real data, type-safe filter
      const prices = countries
        .map(c => c.items?.find(i => i.itemId === itemId)?.usdPrice)
        .filter((p): p is number => p != null && p > 0);
      const rowMin = prices.length > 1 ? Math.min(...prices) : null;
      const rowMax = prices.length > 1 ? Math.max(...prices) : null;
      const eps = 0.001;

      const cells = countries.map(country => {
        const item = country.items?.find(i => i.itemId === itemId);
        if (!item?.available || !item.usdPrice || !item.localPrice) {
          return `<td class="gb-cell gb-na">—</td>`;
        }
        const isHigh = rowMax !== null && Math.abs(item.usdPrice - rowMax) < eps;
        const isLow = rowMin !== null && Math.abs(item.usdPrice - rowMin) < eps;
        const cls = isLow ? 'gb-cheapest' : isHigh ? 'gb-priciest' : '';
        return `<td class="gb-cell ${cls}">$${item.usdPrice.toFixed(2)}<span class="gb-local">${item.localPrice.toFixed(2)} ${escapeHtml(country.currency)}</span></td>`;
      }).join('');
      return `<tr><td class="gb-item-name">${escapeHtml(firstItem?.itemName ?? itemId)}<span class="gb-unit">${escapeHtml(firstItem?.unit ?? '')}</span></td>${cells}</tr>`;
    }).join('');

    const totalRow = `<tr class="gb-total-row"><td class="gb-item-name"><strong>Total</strong></td>${countries.map(c => {
      const isLow = c.code === data.cheapestCountry;
      const isHigh = c.code === data.mostExpensiveCountry;
      const cls = isLow ? 'gb-cheapest' : isHigh ? 'gb-priciest' : '';
      let wowBadge = '';
      if (c.wowPct != null) {
        const sign = c.wowPct >= 0 ? '▲' : '▼';
        const wowCls = c.wowPct >= 0 ? 'bm-wow-up' : 'bm-wow-down';
        wowBadge = `<span class="gb-wow ${wowCls}">${sign}${Math.abs(c.wowPct).toFixed(1)}%</span>`;
      }
      return `<td class="gb-cell gb-total ${cls}"><strong>$${c.totalUsd.toFixed(2)}</strong>${wowBadge}</td>`;
    }).join('')}</tr>`;

    let wowSummary = '';
    if (data.wowAvailable && data.wowAvgPct !== undefined) {
      const avg = data.wowAvgPct;
      const sign = avg >= 0 ? '▲' : '▼';
      const cls = avg >= 0 ? 'bm-wow-up' : 'bm-wow-down';
      wowSummary = `<div class="bm-wow-summary">Basket avg: <span class="${cls}">${sign}${Math.abs(avg).toFixed(1)}% WoW</span></div>`;
    }

    const updatedAt = data.fetchedAt ? new Date(data.fetchedAt).toLocaleDateString() : '';

    const html = `
      <div class="gb-wrapper">
        ${wowSummary}
        <div class="gb-scroll">
          <table class="gb-table">
            <thead><tr><th class="gb-item-col">${t('panels.groceryItem')}</th>${headerCells}</tr></thead>
            <tbody>${rows}${totalRow}</tbody>
          </table>
        </div>
        ${updatedAt ? `<div class="gb-updated">${t('components.status.updatedAt', { time: updatedAt })}</div>` : ''}
      </div>
      <style>
        .gb-country-clickable { cursor: pointer; }
        .gb-country-clickable:hover { background: color-mix(in srgb, var(--text-dim) 8%, transparent); }
        .gb-country-clickable:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
      </style>
    `;

    this.setSafeContent(unsafeRawHtml(html, 'legacy Panel.setContent() migration'));

    const activate = (el: HTMLElement): void => {
      this.focusCountry(el.dataset.countryCode);
    };
    this.content?.querySelectorAll<HTMLElement>('.gb-country-clickable').forEach(el => {
      el.addEventListener('click', () => activate(el));
      el.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        activate(el);
      });
    });
  }
}
