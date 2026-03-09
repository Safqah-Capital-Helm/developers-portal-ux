import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { C, BadgeColor, BADGE_STYLES } from '../../shared/theme';
import { NavComponent, BackLinkComponent, BadgeComponent } from '../../shared';

interface ActivityEvent {
  id: number;
  type: 'submit' | 'review' | 'document' | 'termsheet' | 'team' | 'declaration' | 'credit' | 'system';
  title: string;
  description: string;
  actor: string;
  time: string;
  badge: BadgeColor;
  badgeLabel: string;
}

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule, NavComponent, BackLinkComponent, BadgeComponent],
  template: `
    <div class="page">
      <app-nav></app-nav>

      <div class="container">
        <app-back-link [to]="'/application/' + appId + '/status'" label="Back to Application"></app-back-link>

        <!-- Header -->
        <div class="header">
          <div class="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h1 class="title">Activity Log</h1>
          <p class="subtitle">Al Noor Residential &middot; Al Omran Real Estate Dev Co.</p>
        </div>

        <!-- Timeline -->
        <div class="timeline">
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
                  <app-badge [color]="ev.badge">{{ ev.badgeLabel }}</app-badge>
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
      padding: 28px 32px 60px;
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
    .subtitle {
      font-size: 14px; color: ${C.g500}; margin: 0;
    }

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
  `]
})
export class ActivityLogComponent {
  C = C;
  appId = '1';

  constructor(private route: ActivatedRoute) {
    this.appId = this.route.snapshot.paramMap.get('id') || '1';
  }

  events: ActivityEvent[] = [
    { id: 1,  type: 'termsheet',   title: 'Term Sheet Accepted',         description: 'Ahmed Al-Salem accepted the financing term sheet for Al Noor Residential.',                    actor: 'Ahmed Al-Salem',  time: 'Mar 8, 2026 at 2:15 PM',   badge: 'green', badgeLabel: 'Accepted' },
    { id: 2,  type: 'termsheet',   title: 'Term Sheet Viewed',           description: 'The financing term sheet was opened and reviewed.',                                            actor: 'Ahmed Al-Salem',  time: 'Mar 7, 2026 at 11:30 AM',  badge: 'blue',  badgeLabel: 'Info' },
    { id: 3,  type: 'termsheet',   title: 'Term Sheet Issued',           description: 'A financing term sheet has been prepared and is ready for review.',                             actor: 'Safqah Team',     time: 'Mar 6, 2026 at 9:00 AM',   badge: 'blue',  badgeLabel: 'Info' },
    { id: 4,  type: 'review',      title: 'Company Review Approved',     description: 'Company details and credit check have been approved.',                                          actor: 'Safqah Team',     time: 'Mar 5, 2026 at 4:20 PM',   badge: 'green', badgeLabel: 'Approved' },
    { id: 5,  type: 'review',      title: 'Project Review Approved',     description: 'Project details have been reviewed and approved.',                                              actor: 'Safqah Team',     time: 'Mar 4, 2026 at 3:45 PM',   badge: 'green', badgeLabel: 'Approved' },
    { id: 6,  type: 'declaration', title: 'Declaration Signed',          description: 'Declaration of no legal proceedings was digitally signed.',                                     actor: 'Ahmed Al-Salem',  time: 'Mar 3, 2026 at 10:00 AM',  badge: 'green', badgeLabel: 'Completed' },
    { id: 7,  type: 'document',    title: 'Documents Uploaded',          description: 'Land Title Deed and Owner ID uploaded successfully.',                                           actor: 'Ahmed Al-Salem',  time: 'Mar 2, 2026 at 2:30 PM',   badge: 'blue',  badgeLabel: 'Info' },
    { id: 8,  type: 'team',        title: 'Team Member Joined',          description: 'sara@alnoor.com accepted the team invitation.',                                                 actor: 'Sara Al-Noor',    time: 'Mar 2, 2026 at 11:15 AM',  badge: 'blue',  badgeLabel: 'Info' },
    { id: 9,  type: 'team',        title: 'Team Invitation Sent',        description: 'An invitation was sent to sara@alnoor.com to join the team.',                                   actor: 'Ahmed Al-Salem',  time: 'Mar 1, 2026 at 4:00 PM',   badge: 'gray',  badgeLabel: 'Sent' },
    { id: 10, type: 'credit',      title: 'Credit Check Authorized',     description: 'Credit bureau check authorized for Al Omran Real Estate Dev Co.',                              actor: 'Ahmed Al-Salem',  time: 'Feb 28, 2026 at 1:45 PM',  badge: 'amber', badgeLabel: 'Authorized' },
    { id: 11, type: 'submit',      title: 'Application Submitted',       description: 'Financing application submitted for review.',                                                   actor: 'Ahmed Al-Salem',  time: 'Feb 28, 2026 at 1:30 PM',  badge: 'green', badgeLabel: 'Submitted' },
    { id: 12, type: 'system',      title: 'Application Created',         description: 'New financing application created for Al Noor Residential.',                                    actor: 'System',          time: 'Feb 27, 2026 at 9:00 AM',  badge: 'gray',  badgeLabel: 'Created' },
  ];

  dotColor(badge: BadgeColor): string {
    return BADGE_STYLES[badge].c;
  }

  iconBg(badge: BadgeColor): string {
    return BADGE_STYLES[badge].bg;
  }
}
