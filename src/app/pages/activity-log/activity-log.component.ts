import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { C, BadgeColor, BADGE_STYLES } from '../../shared/theme';
import { NavComponent, BackLinkComponent, BadgeComponent, TranslatePipe, SkeletonComponent, ApiService } from '../../shared';
import { I18nService } from '../../shared/i18n/i18n.service';

interface ActivityEvent {
  id: number;
  type: string;
  title: string;
  description: string;
  actor: string;
  time: string;
  badge: string;
  badgeLabel: string;
}

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule, NavComponent, BackLinkComponent, BadgeComponent, TranslatePipe, SkeletonComponent],
  template: `
    <div class="page">
      <app-nav></app-nav>

      <div class="container">
        <app-back-link to="/dashboard" [label]="('activity.back_to_dashboard' | t)"></app-back-link>

        <!-- Header -->
        <div class="header">
          <div class="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h1 class="title">{{ 'activity.title' | t }}</h1>
        </div>

        <!-- Context links -->
        <div class="context-card">
          <div class="ctx-row" (click)="go('/dashboard/company/1')">
            <div class="ctx-icon" [style.background]="C.blue50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
              </svg>
            </div>
            <div class="ctx-info">
              <div class="ctx-label">{{ 'activity.company' | t }}</div>
              <div class="ctx-value">Al Omran Real Estate Dev Co.</div>
            </div>
            <svg class="ctx-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div class="ctx-divider"></div>
          <div class="ctx-row" (click)="go('/dashboard/project/1')">
            <div class="ctx-icon" [style.background]="C.greenLt">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3h7l2 2h9v16H3z"/>
              </svg>
            </div>
            <div class="ctx-info">
              <div class="ctx-label">{{ 'activity.project' | t }}</div>
              <div class="ctx-value">Al Noor Residential</div>
            </div>
            <svg class="ctx-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div class="ctx-divider"></div>
          <div class="ctx-row" (click)="go('/application/' + appId + '/status')">
            <div class="ctx-icon" [style.background]="C.amber50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div class="ctx-info">
              <div class="ctx-label">{{ 'activity.financing_app' | t }}</div>
              <div class="ctx-value">Development &middot; ~21M SAR</div>
            </div>
            <svg class="ctx-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <!-- Skeleton loading -->
        <app-skeleton *ngIf="loading" type="timeline" [count]="6"></app-skeleton>

        <!-- Timeline -->
        <div class="timeline" *ngIf="!loading">
          <div *ngFor="let ev of events; let last = last" class="tl-item">
            <div class="tl-track">
              <div class="tl-dot" [style.background]="dotColor(ev.badge)"></div>
              <div *ngIf="!last" class="tl-line"></div>
            </div>
            <div class="tl-content">
              <div class="tl-header">
                <div class="tl-icon" [style.background]="iconBg(ev.badge)">
                  <!-- submit -->
                  <svg *ngIf="ev.type==='submit'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="dotColor(ev.badge)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                  </svg>
                  <!-- review -->
                  <svg *ngIf="ev.type==='review'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="dotColor(ev.badge)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <!-- document -->
                  <svg *ngIf="ev.type==='document'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="dotColor(ev.badge)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <!-- termsheet -->
                  <svg *ngIf="ev.type==='termsheet'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="dotColor(ev.badge)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <!-- team -->
                  <svg *ngIf="ev.type==='team'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="dotColor(ev.badge)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  <!-- declaration -->
                  <svg *ngIf="ev.type==='declaration'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="dotColor(ev.badge)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
                  </svg>
                  <!-- credit -->
                  <svg *ngIf="ev.type==='credit'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="dotColor(ev.badge)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <!-- system -->
                  <svg *ngIf="ev.type==='system'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="dotColor(ev.badge)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                  </svg>
                </div>
                <div class="tl-title-row">
                  <span class="tl-title">{{ ev.title }}</span>
                  <app-badge [color]="$any(ev.badge)">{{ ev.badgeLabel }}</app-badge>
                </div>
              </div>
              <p class="tl-desc">{{ ev.description }}</p>
              <div class="tl-meta">
                <span class="tl-actor">{{ ev.actor }}</span>
                <span class="tl-sep">&middot;</span>
                <span class="tl-time">{{ ev.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: ${C.bg}; min-height: 100vh; }
    .page { min-height: 100vh; }

    .container {
      max-width: 720px;
      margin: 0 auto;
      padding: 32px 32px 60px;
    }

    /* Header */
    .header {
      text-align: center;
      margin: 20px 0 36px;
    }
    .icon-circle {
      width: 56px; height: 56px; border-radius: 50%;
      background: ${C.blue50};
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
    }
    .title {
      font-size: 22px; font-weight: 900; color: ${C.g900};
      margin: 0 0 6px;
    }
    /* Context card */
    .context-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 14px;
      margin-bottom: 32px;
      overflow: hidden;
    }
    .ctx-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .ctx-row:hover { background: ${C.g50}; }
    .ctx-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .ctx-info { flex: 1; min-width: 0; }
    .ctx-label { font-size: 11px; font-weight: 700; color: ${C.g400}; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 1px; }
    .ctx-value { font-size: 13px; font-weight: 700; color: ${C.g800}; }
    .ctx-arrow { flex-shrink: 0; }
    .ctx-divider { height: 1px; background: ${C.g100}; margin: 0 18px; }

    /* Timeline */
    .timeline {
      position: relative;
    }
    .tl-item {
      display: flex;
      gap: 16px;
      position: relative;
    }
    .tl-track {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 12px;
      flex-shrink: 0;
      padding-top: 6px;
    }
    .tl-dot {
      width: 12px; height: 12px; min-height: 12px;
      border-radius: 50%;
      border: 2.5px solid #fff;
      box-shadow: 0 0 0 1px ${C.g200};
      z-index: 1;
    }
    .tl-line {
      width: 2px;
      flex: 1;
      background: ${C.g200};
      margin: 2px 0;
    }
    .tl-content {
      flex: 1;
      padding: 0 0 28px;
      min-width: 0;
    }
    .tl-header {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .tl-icon {
      width: 34px; height: 34px; min-width: 34px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .tl-title-row {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-height: 34px;
    }
    .tl-title {
      font-size: 14px; font-weight: 700; color: ${C.g800};
    }
    .tl-desc {
      font-size: 13px; color: ${C.g500}; margin: 6px 0 0 44px;
      line-height: 1.5;
    }
    .tl-meta {
      display: flex; align-items: center; gap: 6px;
      margin: 4px 0 0 44px;
      font-size: 12px; color: ${C.g400};
    }
    .tl-actor { font-weight: 600; }
    .tl-sep { color: ${C.g300}; }

    @media (max-width: 768px) {
      .container { padding: 20px 16px 40px; }
      .tl-desc { margin-left: 0; }
      .tl-meta { margin-left: 0; }
      .ctx-row { padding: 12px 14px; }
      .ctx-divider { margin: 0 14px; }
    }

    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .title { font-size: 20px; }
      .tl-item { gap: 10px; }
      .tl-header { gap: 8px; }
      .tl-icon { width: 28px; height: 28px; min-width: 28px; }
      .tl-title { font-size: 13px; }
      .tl-title-row { flex-direction: column; align-items: flex-start; gap: 4px; min-height: auto; }
      .tl-content { padding-bottom: 20px; }
      .ctx-row { padding: 10px 12px; }
    }
  `]
})
export class ActivityLogComponent implements OnInit {
  C = C;
  appId = '1';
  loading = true;
  events: ActivityEvent[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private i18n: I18nService, private api: ApiService) {
    this.appId = this.route.snapshot.paramMap.get('id') || '1';
  }

  go(path: string) { this.router.navigateByUrl(path); }

  ngOnInit(): void {
    this.api.getActivityEvents(parseInt(this.appId, 10)).subscribe(data => {
      this.events = data;
      this.loading = false;
    });
  }

  dotColor(badge: string): string {
    return BADGE_STYLES[badge as BadgeColor]?.c || BADGE_STYLES['gray'].c;
  }

  iconBg(badge: string): string {
    return BADGE_STYLES[badge as BadgeColor]?.bg || BADGE_STYLES['gray'].bg;
  }
}
