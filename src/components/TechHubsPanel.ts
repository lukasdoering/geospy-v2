import { Panel } from './Panel';
import { t } from '@/services/i18n';
import type { TechHubActivity } from '@/services/tech-activity';
import { escapeHtml, sanitizeUrl, unsafeRawHtml } from '@/utils/sanitize';
import { getCSSColor } from '@/utils';

const COUNTRY_FLAGS: Record<string, string> = {
  'USA': '🇺🇸', 'United States': '🇺🇸',
  'UK': '🇬🇧', 'United Kingdom': '🇬🇧',
  'China': '🇨🇳',
  'India': '🇮🇳',
  'Israel': '🇮🇱',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Canada': '🇨🇦',
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'Singapore': '🇸🇬',
  'Australia': '🇦🇺',
  'Netherlands': '🇳🇱',
  'Sweden': '🇸🇪',
  'Switzerland': '🇨🇭',
  'Brazil': '🇧🇷',
  'Indonesia': '🇮🇩',
  'UAE': '🇦🇪',
  'Estonia': '🇪🇪',
  'Ireland': '🇮🇪',
  'Finland': '🇫🇮',
  'Spain': '🇪🇸',
  'Italy': '🇮🇹',
  'Poland': '🇵🇱',
  'Mexico': '🇲🇽',
  'Argentina': '🇦🇷',
  'Chile': '🇨🇱',
  'Colombia': '🇨🇴',
  'Nigeria': '🇳🇬',
  'Kenya': '🇰🇪',
  'South Africa': '🇿🇦',
  'Egypt': '🇪🇬',
  'Taiwan': '🇹🇼',
  'Vietnam': '🇻🇳',
  'Thailand': '🇹🇭',
  'Malaysia': '🇲🇾',
  'Philippines': '🇵🇭',
  'New Zealand': '🇳🇿',
  'Austria': '🇦🇹',
  'Belgium': '🇧🇪',
  'Denmark': '🇩🇰',
  'Norway': '🇳🇴',
  'Portugal': '🇵🇹',
  'Czech Republic': '🇨🇿',
  'Romania': '🇷🇴',
  'Ukraine': '🇺🇦',
  'Russia': '🇷🇺',
  'Turkey': '🇹🇷',
  'Saudi Arabia': '🇸🇦',
  'Qatar': '🇶🇦',
  'Pakistan': '🇵🇰',
  'Bangladesh': '🇧🇩',
};

export class TechHubsPanel extends Panel {
  private activities: TechHubActivity[] = [];
  private onHubClick?: (hub: TechHubActivity) => void;

  constructor() {
    super({
      id: 'tech-hubs',
      title: t('panels.techHubs'),
      showCount: true,
      infoTooltip: t('components.techHubs.infoTooltip', {
        highColor: getCSSColor('--semantic-normal'),
        elevatedColor: getCSSColor('--semantic-elevated'),
        lowColor: getCSSColor('--text-dim'),
      }),
    });
    this.setupDelegatedListeners();
  }

  public setOnHubClick(handler: (hub: TechHubActivity) => void): void {
    this.onHubClick = handler;
  }

  public setActivities(activities: TechHubActivity[]): void {
    this.activities = activities.slice(0, 10);
    this.setCount(this.activities.length);
    this.render();
  }

  private getFlag(country: string): string {
    return COUNTRY_FLAGS[country] || '🌐';
  }

  private render(): void {
    if (this.activities.length === 0) {
      this.setSafeContent(unsafeRawHtml(
        `<div class="panel-empty">${escapeHtml(t('common.noActiveTechHubs'))}</div>`,
        'legacy Panel.setContent() migration',
      ));
      return;
    }

    const html = this.activities.map((hub, index) => {
      const trendIcon = hub.trend === 'rising' ? '↑' : hub.trend === 'falling' ? '↓' : '';
      const breakingTag = hub.hasBreaking ? '<span class="hub-breaking">ALERT</span>' : '';
      const topStory = hub.topStories[0];

      return `
        <div class="tech-hub-item tech-hub-item-clickable ${hub.activityLevel}" data-hub-id="${escapeHtml(hub.hubId)}" data-index="${index}" role="button" tabindex="0" title="Show on map">
          <div class="hub-rank">${index + 1}</div>
          <span class="hub-indicator ${hub.activityLevel}"></span>
          <div class="hub-info">
            <div class="hub-header">
              <span class="hub-name">${escapeHtml(hub.city)}</span>
              <span class="hub-flag">${this.getFlag(hub.country)}</span>
              ${breakingTag}
            </div>
            <div class="hub-meta">
              <span class="hub-news-count">${hub.newsCount} ${hub.newsCount === 1 ? 'story' : 'stories'}</span>
              ${trendIcon ? `<span class="hub-trend ${hub.trend}">${trendIcon}</span>` : ''}
              <span class="hub-tier">${hub.tier}</span>
            </div>
          </div>
          <div class="hub-score">${Math.round(hub.score)}</div>
        </div>
        ${topStory ? `
          <a class="hub-top-story" href="${sanitizeUrl(topStory.link)}" target="_blank" rel="noopener" data-hub-id="${escapeHtml(hub.hubId)}">
            ${escapeHtml(topStory.title.length > 80 ? topStory.title.slice(0, 77) + '...' : topStory.title)}
          </a>
        ` : ''}
      `;
    }).join('');

    this.setSafeContent(unsafeRawHtml(html, 'legacy Panel.setContent() migration'));
  }

  private setupDelegatedListeners(): void {
    const activate = (item: HTMLElement | null): void => {
      if (!item) return;
      const hubId = item.dataset.hubId;
      const hub = this.activities.find(a => a.hubId === hubId);
      if (hub) this.onHubClick?.(hub);
    };
    this.content.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a')) return;
      activate(target.closest<HTMLDivElement>('.tech-hub-item'));
    });
    this.content.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const item = (e.target as HTMLElement).closest<HTMLDivElement>('.tech-hub-item');
      if (!item) return;
      e.preventDefault();
      activate(item);
    });
  }
}
