import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C } from '../../theme';

/**
 * Shimmer skeleton loader — displays animated placeholder shapes
 * while data is being fetched from the API.
 *
 * Usage:
 *   <app-skeleton type="card" [count]="3"></app-skeleton>
 *   <app-skeleton type="list" [count]="4"></app-skeleton>
 *   <app-skeleton type="stat" [count]="4"></app-skeleton>
 *   <app-skeleton type="text" [lines]="3"></app-skeleton>
 *   <app-skeleton type="header"></app-skeleton>
 *   <app-skeleton type="grid" [count]="6"></app-skeleton>
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Header skeleton -->
    @if (type === 'header') {
      <div class="sk-header">
        <div class="sk-box sk-title shimmer"></div>
        <div class="sk-box sk-subtitle shimmer"></div>
      </div>
    }

    <!-- Stat cards row -->
    @if (type === 'stat') {
      <div class="sk-stat-row">
        @for (i of countArr; track i) {
          <div class="sk-stat-card">
            <div class="sk-box sk-stat-icon shimmer"></div>
            <div class="sk-stat-text">
              <div class="sk-box sk-stat-label shimmer"></div>
              <div class="sk-box sk-stat-value shimmer"></div>
            </div>
          </div>
        }
      </div>
    }

    <!-- List items -->
    @if (type === 'list') {
      @for (i of countArr; track i) {
        <div class="sk-list-item">
          <div class="sk-box sk-avatar shimmer"></div>
          <div class="sk-list-text">
            <div class="sk-box sk-line-long shimmer"></div>
            <div class="sk-box sk-line-medium shimmer"></div>
          </div>
          <div class="sk-box sk-badge shimmer"></div>
        </div>
      }
    }

    <!-- Card grid (projects) -->
    @if (type === 'grid') {
      <div class="sk-grid">
        @for (i of countArr; track i) {
          <div class="sk-grid-card">
            <div class="sk-box sk-grid-img shimmer"></div>
            <div class="sk-grid-body">
              <div class="sk-box sk-line-long shimmer"></div>
              <div class="sk-box sk-line-medium shimmer"></div>
              <div class="sk-grid-stats">
                <div class="sk-box sk-grid-stat shimmer"></div>
                <div class="sk-box sk-grid-stat shimmer"></div>
              </div>
            </div>
          </div>
        }
      </div>
    }

    <!-- Detail card -->
    @if (type === 'card') {
      @for (i of countArr; track i) {
        <div class="sk-card">
          <div class="sk-box sk-line-long shimmer" style="margin-bottom: 12px;"></div>
          <div class="sk-box sk-line-medium shimmer" style="margin-bottom: 8px;"></div>
          <div class="sk-box sk-line-short shimmer"></div>
          <div class="sk-card-grid" style="margin-top: 14px;">
            <div class="sk-box sk-cell shimmer"></div>
            <div class="sk-box sk-cell shimmer"></div>
            <div class="sk-box sk-cell shimmer"></div>
          </div>
        </div>
      }
    }

    <!-- Text lines -->
    @if (type === 'text') {
      <div class="sk-text-block">
        @for (i of linesArr; track i) {
          <div class="sk-box shimmer" [style.width.%]="i === linesArr.length - 1 ? 60 : 100" [style.height.px]="14" style="margin-bottom: 10px; border-radius: 6px;"></div>
        }
      </div>
    }

    <!-- Timeline -->
    @if (type === 'timeline') {
      @for (i of countArr; track i) {
        <div class="sk-timeline-item">
          <div class="sk-box sk-tl-dot shimmer"></div>
          <div class="sk-tl-content">
            <div class="sk-box sk-line-long shimmer"></div>
            <div class="sk-box sk-line-medium shimmer" style="margin-top: 6px;"></div>
          </div>
        </div>
      }
    }

    <!-- Notification cards -->
    @if (type === 'notification') {
      @for (i of countArr; track i) {
        <div class="sk-notif">
          <div class="sk-box sk-notif-icon shimmer"></div>
          <div class="sk-notif-text">
            <div class="sk-box sk-line-long shimmer"></div>
            <div class="sk-box sk-line-medium shimmer" style="margin-top: 6px;"></div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    :host { display: block; }

    /* ── Shimmer animation ── */
    .shimmer {
      background: linear-gradient(90deg, ${C.g100} 25%, ${C.g50} 50%, ${C.g100} 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* ── Base box ── */
    .sk-box { border-radius: 8px; }

    /* ── Header ── */
    .sk-header { margin-bottom: 24px; }
    .sk-title { width: 200px; height: 24px; margin-bottom: 8px; }
    .sk-subtitle { width: 140px; height: 14px; }

    /* ── Stat cards ── */
    .sk-stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
    .sk-stat-card {
      background: ${C.white};
      border: 1px solid ${C.g100};
      border-radius: 14px;
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .sk-stat-icon { width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; }
    .sk-stat-text { flex: 1; }
    .sk-stat-label { width: 80%; height: 10px; margin-bottom: 8px; border-radius: 4px; }
    .sk-stat-value { width: 50%; height: 18px; border-radius: 6px; }

    /* ── List ── */
    .sk-list-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: ${C.white};
      border: 1px solid ${C.g100};
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 8px;
    }
    .sk-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
    .sk-list-text { flex: 1; }
    .sk-line-long { width: 70%; height: 14px; border-radius: 6px; }
    .sk-line-medium { width: 45%; height: 10px; border-radius: 4px; margin-top: 6px; }
    .sk-line-short { width: 30%; height: 10px; border-radius: 4px; }
    .sk-badge { width: 60px; height: 22px; border-radius: 6px; flex-shrink: 0; }

    /* ── Grid (Projects) ── */
    .sk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .sk-grid-card {
      background: ${C.white};
      border: 1px solid ${C.g100};
      border-radius: 16px;
      overflow: hidden;
    }
    .sk-grid-img { width: 100%; height: 160px; border-radius: 0; }
    .sk-grid-body { padding: 14px 16px 16px; }
    .sk-grid-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
    .sk-grid-stat { height: 48px; border-radius: 8px; }

    /* ── Card ── */
    .sk-card {
      background: ${C.white};
      border: 1px solid ${C.g100};
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 10px;
    }
    .sk-card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .sk-cell { height: 48px; border-radius: 8px; }

    /* ── Timeline ── */
    .sk-timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 12px 0;
    }
    .sk-tl-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
    .sk-tl-content { flex: 1; }

    /* ── Notification ── */
    .sk-notif {
      display: flex;
      align-items: center;
      gap: 14px;
      background: ${C.white};
      border: 1px solid ${C.g100};
      border-radius: 14px;
      padding: 16px 18px;
      margin-bottom: 10px;
    }
    .sk-notif-icon { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; }
    .sk-notif-text { flex: 1; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .sk-stat-row { grid-template-columns: repeat(2, 1fr); }
      .sk-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .sk-card-grid { grid-template-columns: 1fr; }
      .sk-stat-row { grid-template-columns: 1fr; }
    }
  `]
})
export class SkeletonComponent {
  @Input() type: 'header' | 'stat' | 'list' | 'grid' | 'card' | 'text' | 'timeline' | 'notification' = 'text';
  @Input() count = 3;
  @Input() lines = 3;

  get countArr(): number[] { return Array.from({ length: this.count }, (_, i) => i); }
  get linesArr(): number[] { return Array.from({ length: this.lines }, (_, i) => i); }
}
