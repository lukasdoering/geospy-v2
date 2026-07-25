import { Panel } from './Panel';
import { t } from '@/services/i18n';
import type { ThermalEscalationCluster, ThermalEscalationWatch } from '@/services/thermal-escalation';
import { escapeHtml, unsafeRawHtml } from '@/utils/sanitize';

// P1: allowlists prevent unescaped API values from injecting into class attribute context
const STATUS_CLASS: Record<string, string> = {
  spike: 'spike', persistent: 'persistent', elevated: 'elevated', normal: 'normal',
};

export class ThermalEscalationPanel extends Panel {
  private clusters: ThermalEscalationCluster[] = [];
  private fetchedAt: Date | null = null;
  private searchQuery = '';
  private summary: ThermalEscalationWatch['summary'] = {
    clusterCount: 0,
    elevatedCount: 0,
    spikeCount: 0,
    persistentCount: 0,
    conflictAdjacentCount: 0,
    highRelevanceCount: 0,
  };
  private onLocationClick?: (lat: number, lon: number) => void;

  constructor() {
    super({
      id: 'thermal-escalation',
      title: t('components.thermalEscalation.title'),
      showCount: true,
      trackActivity: true,
      infoTooltip: t('components.thermalEscalation.infoTooltip'),
    });
    this.showLoading(t('components.thermalEscalation.loading'));

    const focusCard = (row: HTMLElement | null): void => {
      if (!row) return;
      const lat = Number(row.dataset.lat);
      const lon = Number(row.dataset.lon);
      if (Number.isFinite(lat) && Number.isFinite(lon) && !(lat === 0 && lon === 0)) {
        this.onLocationClick?.(lat, lon);
      }
    };
    this.content.addEventListener('click', (e) => {
      focusCard((e.target as HTMLElement).closest<HTMLElement>('.te-card[data-te-focus]'));
    });
    this.content.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const row = (e.target as HTMLElement).closest<HTMLElement>('.te-card[data-te-focus]');
      if (!row) return;
      e.preventDefault();
      focusCard(row);
    });
    this.content.addEventListener('input', (e) => {
      const inp = e.target as HTMLInputElement;
      if (inp.dataset.role !== 'te-search') return;
      this.searchQuery = inp.value;
      this.render({ restoreSearchFocus: true });
    });
  }

  public setLocationClickHandler(handler: (lat: number, lon: number) => void): void {
    this.onLocationClick = handler;
  }

  public setData(data: ThermalEscalationWatch): void {
    this.clusters = data.clusters;
    this.fetchedAt = data.fetchedAt;
    this.summary = data.summary;
    this.setCount(data.clusters.length);
    this.render();
  }

  private getFiltered(): ThermalEscalationCluster[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.clusters;
    return this.clusters.filter((c) =>
      c.regionLabel.toLowerCase().includes(q)
      || c.status.toLowerCase().includes(q)
      || c.context.toLowerCase().includes(q)
      || c.strategicRelevance.toLowerCase().includes(q),
    );
  }

  private render(opts: { restoreSearchFocus?: boolean } = {}): void {
    if (this.clusters.length === 0) {
      this.setSafeContent(unsafeRawHtml(`<div class="panel-empty">${escapeHtml(t('components.thermalEscalation.empty'))}</div>`, 'legacy Panel.setContent() migration'));
      return;
    }

    const filtered = this.getFiltered();
    const footer = this.fetchedAt && this.fetchedAt.getTime() > 0
      ? t('components.thermalEscalation.footer.updated', { time: this.fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
      : '';
    const listHtml = filtered.length === 0
      ? `<div class="panel-empty">No clusters match this search</div>`
      : filtered.map(c => this.renderCard(c)).join('');

    this.setSafeContent(unsafeRawHtml(`
      <div class="te-panel">
        ${this.renderSummary()}
        <div class="te-filters">
          <input data-role="te-search" data-testid="thermal-escalation-search" type="search" class="te-search" placeholder="Search region / status" value="${escapeHtml(this.searchQuery)}" />
        </div>
        <div class="te-list">
          ${listHtml}
        </div>
        ${footer ? `<div class="te-footer">${escapeHtml(footer)}</div>` : ''}
      </div>
    `, 'legacy Panel.setContent() migration'));

    if (opts.restoreSearchFocus) {
      const inp = this.content.querySelector<HTMLInputElement>('input[data-role="te-search"]');
      if (inp) {
        inp.focus();
        const len = inp.value.length;
        inp.setSelectionRange(len, len);
      }
    }
  }

  private renderSummary(): string {
    const { clusterCount, elevatedCount, spikeCount, persistentCount, conflictAdjacentCount, highRelevanceCount } = this.summary;
    // Only show non-zero sub-stats to reduce visual noise
    const stats = [
      { val: elevatedCount, label: t('components.thermalEscalation.summary.elevated'), cls: 'te-stat-elevated' },
      { val: spikeCount, label: t('components.thermalEscalation.summary.spikes'), cls: 'te-stat-spike' },
      { val: persistentCount, label: t('components.thermalEscalation.summary.persist'), cls: 'te-stat-persistent' },
      { val: conflictAdjacentCount, label: t('components.thermalEscalation.summary.conflict'), cls: 'te-stat-conflict' },
      { val: highRelevanceCount, label: t('components.thermalEscalation.summary.strategic'), cls: 'te-stat-strategic' },
    ].filter(s => s.val > 0);
    return `
      <div class="te-summary">
        <div class="te-stat">
          <span class="te-stat-val">${clusterCount}</span>
          <span class="te-stat-label">${escapeHtml(t('components.thermalEscalation.summary.total'))}</span>
        </div>
        ${stats.map(s => `
        <div class="te-stat ${s.cls}">
          <span class="te-stat-val">${s.val}</span>
          <span class="te-stat-label">${escapeHtml(s.label)}</span>
        </div>`).join('')}
      </div>
    `;
  }

  private renderCard(c: ThermalEscalationCluster): string {
    // P1: use allowlisted class names, never raw API strings in attributes
    const statusClass = STATUS_CLASS[c.status] ?? 'normal';

    const persistence = c.persistenceHours >= 24
      ? `${Math.round(c.persistenceHours / 24)}d`
      : `${Math.round(c.persistenceHours)}h`;
    const frpDisplay = c.totalFrp >= 1000 ? `${(c.totalFrp / 1000).toFixed(1)}k` : c.totalFrp.toFixed(0);
    const deltaSign = c.countDelta > 0 ? '+' : '';
    const deltaClass = c.countDelta > 0 ? 'pos' : c.countDelta < 0 ? 'neg' : '';

    // Status badge + at most one context badge (conflict > energy > industrial) + strategic if high
    const contextBadge =
      c.context === 'conflict_adjacent' ? `<span class="te-badge te-badge-conflict">${escapeHtml(t('components.thermalEscalation.badges.conflictAdjacent'))}</span>` :
      c.context === 'energy_adjacent' ? `<span class="te-badge te-badge-energy">${escapeHtml(t('components.thermalEscalation.badges.energyAdjacent'))}</span>` :
      c.context === 'industrial' ? `<span class="te-badge te-badge-industrial">${escapeHtml(t('components.thermalEscalation.badges.industrial'))}</span>` : '';
    const badges = [
      `<span class="te-badge te-badge-${statusClass}">${escapeHtml(c.status)}</span>`,
      contextBadge,
      c.strategicRelevance === 'high' ? `<span class="te-badge te-badge-strategic">${escapeHtml(t('components.thermalEscalation.badges.strategic'))}</span>` : '',
    ].filter(Boolean).join('');

    const age = formatAge(c.lastDetectedAt);

    const focusable = Number.isFinite(c.lat) && Number.isFinite(c.lon) && !(c.lat === 0 && c.lon === 0);
    const focusAttrs = focusable
      ? ` data-te-focus="1" data-lat="${c.lat}" data-lon="${c.lon}" role="button" tabindex="0" title="Show on map" aria-label="Show thermal cluster on map"`
      : '';
    const clickableCls = focusable ? ' te-card-clickable' : '';

    return `
      <div class="te-card te-card-${statusClass}${clickableCls}"${focusAttrs}>
        <div class="te-card-accent"></div>
        <div class="te-card-body">
          <div class="te-region">${escapeHtml(c.regionLabel)}</div>
          <div class="te-meta">${escapeHtml(t('components.thermalEscalation.observations', { count: c.observationCount }))} · ${escapeHtml(t('components.thermalEscalation.sources', { count: c.uniqueSourceCount }))}</div>
          <div class="te-badges">${badges}</div>
        </div>
        <div class="te-metrics">
          <div class="te-frp">${escapeHtml(frpDisplay)} <span class="te-frp-unit">MW</span></div>
          <div class="te-delta ${deltaClass}">${escapeHtml(`${deltaSign}${Math.round(c.countDelta)}`)} · z${c.zScore.toFixed(1)}</div>
          <div class="te-persist">${escapeHtml(persistence)}</div>
          <div class="te-last">${escapeHtml(age)}</div>
        </div>
      </div>
    `;
  }
}

function formatAge(date: Date): string {
  const ageMs = Date.now() - date.getTime();
  if (ageMs < 60 * 60 * 1000) {
    const mins = Math.max(1, Math.floor(ageMs / (60 * 1000)));
    return t('components.thermalEscalation.age.minutesAgo', { count: mins });
  }
  if (ageMs < 24 * 60 * 60 * 1000) {
    const hours = Math.max(1, Math.floor(ageMs / (60 * 60 * 1000)));
    return t('components.thermalEscalation.age.hoursAgo', { count: hours });
  }
  const days = Math.floor(ageMs / (24 * 60 * 60 * 1000));
  if (days < 30) return t('components.thermalEscalation.age.daysAgo', { count: days });
  return date.toISOString().slice(0, 10);
}
