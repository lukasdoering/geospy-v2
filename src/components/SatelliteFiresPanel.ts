import { Panel } from './Panel';
import type { FireRegionStats } from '@/services/wildfires';
import { regionMapFocus } from '@/services/wildfires/region-focus';
import { t } from '@/services/i18n';
import { unsafeRawHtml } from '@/utils/sanitize';

export class SatelliteFiresPanel extends Panel {
  private stats: FireRegionStats[] = [];
  private totalCount = 0;
  private lastUpdated: Date | null = null;
  private onRegionFocus?: (lat: number, lon: number) => void;

  constructor() {
    super({
      id: 'satellite-fires',
      title: t('panels.satelliteFires'),
      showCount: true,
      trackActivity: true,
      infoTooltip: t('components.satelliteFires.infoTooltip'),
    });
    this.showLoading(t('common.scanningThermalData'));
    this.content.addEventListener('click', (e) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>('[data-fire-focus]');
      if (!row) return;
      const lat = Number(row.dataset.lat);
      const lon = Number(row.dataset.lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        this.onRegionFocus?.(lat, lon);
      }
    });
    this.content.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const row = (e.target as HTMLElement).closest<HTMLElement>('[data-fire-focus]');
      if (!row) return;
      e.preventDefault();
      const lat = Number(row.dataset.lat);
      const lon = Number(row.dataset.lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        this.onRegionFocus?.(lat, lon);
      }
    });
  }

  public setRegionClickHandler(handler: (lat: number, lon: number) => void): void {
    this.onRegionFocus = handler;
  }

  public update(stats: FireRegionStats[], totalCount: number): void {
    const prevCount = this.totalCount;
    this.stats = stats;
    this.totalCount = totalCount;
    this.lastUpdated = new Date();
    this.setCount(totalCount);

    if (prevCount > 0 && totalCount > prevCount) {
      this.setNewBadge(totalCount - prevCount);
    }

    this.render();
  }

  private render(): void {
    if (this.stats.length === 0) {
      this.setSafeContent(unsafeRawHtml(
        `<div class="panel-empty" data-testid="satellite-fires-empty">${t('components.satelliteFires.empty')}</div>`,
        'legacy Panel.setContent() migration',
      ));
      return;
    }

    const rows = this.stats.map((s, idx) => {
      const frpStr = s.totalFrp >= 1000
        ? `${(s.totalFrp / 1000).toFixed(1)}k`
        : Math.round(s.totalFrp).toLocaleString();
      const highClass = s.highIntensityCount > 0 ? ' fires-high' : '';
      const explosionBadge = s.possibleExplosionCount > 0
        ? `<span class="fires-explosion-badge" title="${t('components.satelliteFires.explosionTooltip')}">${s.possibleExplosionCount}</span>`
        : '';
      const focus = regionMapFocus(s);
      const focusAttrs = focus
        ? ` data-fire-focus="1" data-lat="${focus.lat}" data-lon="${focus.lon}" data-region-idx="${idx}" role="button" tabindex="0" title="Show on map"`
        : '';
      return `<tr class="fire-row${highClass}${focus ? ' fire-row-clickable' : ''}"${focusAttrs}>
        <td class="fire-region">${escapeHtml(s.region)}${explosionBadge}</td>
        <td class="fire-count">${s.fireCount}</td>
        <td class="fire-hi">${s.highIntensityCount}</td>
        <td class="fire-frp">${frpStr}</td>
      </tr>`;
    }).join('');

    const totalFrp = this.stats.reduce((sum, s) => sum + s.totalFrp, 0);
    const totalHigh = this.stats.reduce((sum, s) => sum + s.highIntensityCount, 0);
    const totalExplosions = this.stats.reduce((sum, s) => sum + s.possibleExplosionCount, 0);
    const ago = this.lastUpdated ? timeSince(this.lastUpdated) : t('components.satelliteFires.never');

    this.setSafeContent(unsafeRawHtml(`
      <div class="fires-panel-content">
        <table class="fires-table">
          <thead>
            <tr>
              <th>${t('components.satelliteFires.region')}</th>
              <th>${t('components.satelliteFires.fires')}</th>
              <th>${t('components.satelliteFires.high')}</th>
              <th>FRP</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr class="fire-totals">
              <td>${t('components.satelliteFires.total')}</td>
              <td>${this.totalCount}</td>
              <td>${totalHigh}</td>
              <td>${totalFrp >= 1000 ? `${(totalFrp / 1000).toFixed(1)}k` : Math.round(totalFrp).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        ${totalExplosions > 0 ? `<div class="fires-explosion-alert">${t('components.satelliteFires.possibleExplosions', { count: String(totalExplosions) })}</div>` : ''}
        <div class="fires-footer">
          <span class="fires-source">NASA FIRMS (VIIRS SNPP)</span>
          <span class="fires-updated">${ago}</span>
        </div>
      </div>
    `, 'legacy Panel.setContent() migration'));
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function timeSince(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return t('components.satelliteFires.time.justNow');
  const mins = Math.floor(secs / 60);
  if (mins < 60) return t('components.satelliteFires.time.minutesAgo', { count: String(mins) });
  const hrs = Math.floor(mins / 60);
  return t('components.satelliteFires.time.hoursAgo', { count: String(hrs) });
}
