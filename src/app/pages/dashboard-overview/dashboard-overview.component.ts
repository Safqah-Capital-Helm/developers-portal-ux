import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { C } from '../../shared/theme';
import { ButtonComponent, BadgeComponent, InputComponent, StatCardComponent, ListCardComponent, PageHeaderComponent } from '../../shared';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent, InputComponent, StatCardComponent, ListCardComponent, PageHeaderComponent],
  template: `
    <div class="container">
      <!-- Demo toggles -->
      <div class="demo-bar">
        <button class="demo-toggle" [class.active]="demoMode === 'full'" (click)="setDemo('full')">With Actions</button>
        <button class="demo-toggle" [class.active]="demoMode === 'clear'" (click)="setDemo('clear')">All Clear</button>
        <button class="demo-toggle" [class.active]="demoMode === 'single'" (click)="setDemo('single')">Single Company</button>
        <button class="demo-toggle" [class.active]="demoMode === 'new'" (click)="setDemo('new')">New User</button>
      </div>

      <app-page-header [title]="greeting" [subtitle]="subtitle"></app-page-header>

      <!-- ===== Stats row (not new user) ===== -->
      <div *ngIf="demoMode !== 'new'" class="stats-row">
        <app-stat-card *ngFor="let s of activeStats" [label]="s.label" [value]="s.value" [iconBg]="s.iconBg" [icon]="s.icon"></app-stat-card>
      </div>

      <!-- ===== Recent Applications ===== -->
      <div *ngIf="demoMode !== 'new' && activeApplications.length > 0" class="section">
        <div class="section-header">
          <div class="section-icon" [style.background]="'#eff8ff'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <span class="section-title">Recent Applications</span>
          <span class="view-all" (click)="go('/dashboard/applications')">View all &rarr;</span>
        </div>

        <app-list-card *ngFor="let app of activeApplications" [statusColor]="app.sc" (click)="onAppClick(app)">
          <div class="recent-info">
            <span class="recent-name">{{ app.projectName }}</span>
            <span class="recent-sub">{{ app.company }} &middot; {{ app.product }}</span>
          </div>
          <div class="recent-right">
            <span class="recent-amount">{{ app.amount }}</span>
            <app-badge [color]="$any(app.sc)">{{ app.status }}</app-badge>
          </div>
        </app-list-card>
      </div>

      <!-- ===== NEW USER: Onboarding Steps ===== -->
      <div *ngIf="demoMode === 'new'" class="section">
        <div class="onboarding-card">
          <div class="onboarding-header">
            <div class="onboarding-header-top">
              <div>
                <div class="onboarding-title">Get started with Safqah</div>
                <div class="onboarding-desc">Complete these steps to submit your first financing application.</div>
              </div>
              <div class="progress-pct" [style.color]="C.green">{{ getProgress(newUserSteps) }}%</div>
            </div>
            <div class="progress-track">
              <div class="progress-fill" [style.width.%]="getProgress(newUserSteps)"></div>
            </div>
          </div>
          <div class="onboarding-steps">
            <div *ngFor="let s of newUserSteps; let i = index" class="step-card" [class.done]="s.done" [class.locked]="!s.done && !isStepUnlocked(newUserSteps, i)">
              <div class="step-number" [style.background]="s.done ? C.green : C.g200" [style.color]="s.done ? '#fff' : C.g500">
                <svg *ngIf="s.done" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <svg *ngIf="!s.done && !isStepUnlocked(newUserSteps, i)" width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <span *ngIf="!s.done && isStepUnlocked(newUserSteps, i)">{{ i + 1 }}</span>
              </div>
              <div class="step-info">
                <div class="step-name">{{ s.title }}</div>
                <div class="step-desc">{{ !s.done && !isStepUnlocked(newUserSteps, i) ? 'Complete the steps above first.' : s.desc }}</div>
              </div>
              <div class="step-actions">
                <app-btn *ngIf="!s.done && isStepUnlocked(newUserSteps, i)" variant="primary" size="sm" (clicked)="go(s.route)">{{ s.action }}</app-btn>
                <app-badge *ngIf="s.done" color="green">Done</app-badge>
                <button *ngIf="i < newUserSteps.length - 1 && !s.done && isStepUnlocked(newUserSteps, i)" class="demo-advance" (click)="toggleStep(newUserSteps, i)">Demo: Mark done</button>
                <button *ngIf="i < newUserSteps.length - 1 && s.done" class="demo-advance" (click)="toggleStep(newUserSteps, i)">Demo: Undo</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== SINGLE: Onboarding Steps ===== -->
      <div *ngIf="demoMode === 'single'" class="section">
        <div class="onboarding-card">
          <div class="onboarding-header">
            <div class="onboarding-header-top">
              <div>
                <div class="onboarding-title">Get started with Safqah</div>
                <div class="onboarding-desc">Complete these steps to submit your first financing application.</div>
              </div>
              <div class="progress-pct" [style.color]="C.green">{{ getProgress(singleUserSteps) }}%</div>
            </div>
            <div class="progress-track">
              <div class="progress-fill" [style.width.%]="getProgress(singleUserSteps)"></div>
            </div>
          </div>
          <div class="onboarding-steps">
            <div *ngFor="let s of singleUserSteps; let i = index" class="step-card" [class.done]="s.done" [class.locked]="!s.done && !isStepUnlocked(singleUserSteps, i)">
              <div class="step-number" [style.background]="s.done ? C.green : C.g200" [style.color]="s.done ? '#fff' : C.g500">
                <svg *ngIf="s.done" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <svg *ngIf="!s.done && !isStepUnlocked(singleUserSteps, i)" width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <span *ngIf="!s.done && isStepUnlocked(singleUserSteps, i)">{{ i + 1 }}</span>
              </div>
              <div class="step-info">
                <div class="step-name">{{ s.title }}</div>
                <div class="step-desc">{{ !s.done && !isStepUnlocked(singleUserSteps, i) ? 'Complete the steps above first.' : s.desc }}</div>
              </div>
              <div class="step-actions">
                <app-btn *ngIf="!s.done && isStepUnlocked(singleUserSteps, i)" variant="primary" size="sm" (clicked)="go(s.route)">{{ s.action }}</app-btn>
                <app-badge *ngIf="s.done" color="green">Done</app-badge>
                <button *ngIf="i < singleUserSteps.length - 1 && !s.done && isStepUnlocked(singleUserSteps, i)" class="demo-advance" (click)="toggleStep(singleUserSteps, i)">Demo: Mark done</button>
                <button *ngIf="i < singleUserSteps.length - 1 && s.done" class="demo-advance" (click)="toggleStep(singleUserSteps, i)">Demo: Undo</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Important Notifications (only when there are active ones) ===== -->
      <div *ngIf="activeNotifications.length > 0" class="section">
        <div class="section-header">
          <div class="section-icon" [style.background]="'#fff2ee'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </div>
          <span class="section-title">Action Required</span>
          <span class="notif-count" [style.background]="C.red500">{{ activeNotifications.length }}</span>
        </div>

        <div
          *ngFor="let n of activeNotifications"
          class="notif-card"
          [style.borderLeftColor]="n.borderColor"
          (click)="go(n.route)"
        >
          <div class="notif-icon-wrap" [style.background]="n.iconBg">
            <div [innerHTML]="safe(n.icon)"></div>
          </div>
          <div class="notif-info">
            <div class="notif-title">{{ n.title }}</div>
            <div class="notif-desc">{{ n.desc }}</div>
          </div>
          <div class="notif-time">{{ n.time }}</div>
          <div class="notif-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </div>

      <!-- ===== Quick Actions (not new user) ===== -->
      <div *ngIf="demoMode !== 'new'" class="section">
        <div class="section-header">
          <span class="section-title">Quick Actions</span>
        </div>
        <div class="actions-row">
          <div class="action-card" (click)="go('/application/new')">
            <div class="action-icon" [style.background]="C.greenLt">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div class="action-title">New Application</div>
            <div class="action-sub">Submit a financing request</div>
          </div>
          <div class="action-card" (click)="go('/project/new')">
            <div class="action-icon" [style.background]="C.blue50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
            </div>
            <div class="action-title">Add Project</div>
            <div class="action-sub">Create a new project</div>
          </div>
          <div class="action-card" (click)="go('/dashboard/teams')">
            <div class="action-icon" [style.background]="C.amber50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            </div>
            <div class="action-title">Invite Member</div>
            <div class="action-sub">Add someone to your team</div>
          </div>
        </div>
      </div>

      <!-- Referral card (new user only) -->
      <div *ngIf="demoMode === 'new' && showReferral" class="referral-card">
        <div class="referral-top">
          <div class="referral-icon" [style.background]="C.greenLt">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <div class="referral-text">
            <div class="referral-title">How did you find Safqah?</div>
            <div class="referral-desc">Help us improve by letting us know how you heard about us.</div>
          </div>
          <button class="referral-dismiss" (click)="showReferral = false">&times;</button>
        </div>
        <div class="referral-chips">
          <div *ngFor="let r of referralOptions" class="referral-chip"
            [style.background]="referralSource === r ? C.greenLt : '#fff'"
            [style.borderColor]="referralSource === r ? C.green : C.g200"
            [style.color]="referralSource === r ? C.green : C.g600"
            (click)="referralSource = r">{{ r }}</div>
        </div>
        <div *ngIf="referralSource === 'A friend' || referralSource === 'Other'" style="margin-top: 12px;">
          <app-input [label]="referralSource === 'A friend' ? 'Friend\\'s name' : 'Please specify'" placeholder="Enter details" [value]="referralExtra" (valueChange)="referralExtra = $event"></app-input>
        </div>
        <div *ngIf="referralSource" class="referral-save">
          <app-btn variant="primary" size="sm" (clicked)="showReferral = false">Submit</app-btn>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .container { max-width: 1200px; margin: 0 auto; padding: 28px 40px 60px; }

    /* Demo controls */
    .demo-bar {
      display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;
    }
    .demo-toggle {
      background: ${C.g50}; border: 1px dashed ${C.g300}; border-radius: 8px;
      padding: 8px 16px; font-size: 12px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit; transition: all 0.15s;
    }
    .demo-toggle:hover { background: ${C.g100}; color: ${C.g700}; }
    .demo-toggle.active { background: ${C.g200}; color: ${C.g700}; border-color: ${C.g400}; }

    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }

    .section { margin-bottom: 28px; }
    .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
    .section-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .section-title { font-size: 15px; font-weight: 800; color: ${C.g900}; }
    .view-all { margin-left: auto; font-size: 13px; font-weight: 700; color: ${C.green}; cursor: pointer; transition: opacity 0.15s; }
    .view-all:hover { opacity: 0.7; }

    .recent-info { display: flex; flex-direction: column; gap: 2px; }
    .recent-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }
    .recent-sub { font-size: 12px; color: ${C.g500}; }
    .recent-right { display: flex; align-items: center; gap: 12px; }
    .recent-amount { font-size: 13px; font-weight: 700; color: ${C.g600}; }

    .onboarding-card { background: #fff; border: 1px solid ${C.g200}; border-radius: 16px; padding: 24px; }
    .onboarding-header { margin-bottom: 20px; }
    .onboarding-header-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
    .onboarding-title { font-size: 16px; font-weight: 800; color: ${C.g900}; margin-bottom: 4px; }
    .onboarding-desc { font-size: 13px; color: ${C.g500}; line-height: 1.5; }
    .progress-pct { font-size: 14px; font-weight: 800; white-space: nowrap; padding-top: 2px; }
    .progress-track { width: 100%; height: 8px; background: ${C.g100}; border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: ${C.green}; border-radius: 4px; transition: width 0.4s ease; }
    .onboarding-steps { display: flex; flex-direction: column; gap: 12px; }
    .step-card { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1.5px solid ${C.g200}; border-radius: 12px; transition: all 0.15s ease; }
    .step-card.done { background: ${C.g50}; border-color: ${C.g100}; }
    .step-number { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
    .step-info { flex: 1; min-width: 0; }
    .step-name { font-size: 14px; font-weight: 700; color: ${C.g800}; margin-bottom: 2px; }
    .step-card.done .step-name { color: ${C.g500}; text-decoration: line-through; }
    .step-card.locked { opacity: 0.55; border-style: dashed; }
    .step-desc { font-size: 12px; color: ${C.g400}; line-height: 1.4; }
    .step-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .demo-advance {
      background: ${C.g50}; border: 1px dashed ${C.g300}; border-radius: 6px;
      padding: 4px 10px; font-size: 11px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap;
    }
    .demo-advance:hover { background: ${C.g100}; color: ${C.g700}; }

    .actions-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .action-card { border: 2px dashed ${C.g300}; border-radius: 14px; padding: 20px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
    .action-card:hover { border-color: ${C.green}; background: ${C.greenLt}; }
    .action-card:hover .action-title { color: ${C.green}; }
    .action-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .action-title { font-size: 14px; font-weight: 700; color: ${C.g700}; margin-bottom: 2px; transition: color 0.15s; }
    .action-sub { font-size: 12px; color: ${C.g400}; font-weight: 500; }

    .referral-card { background: #fff; border: 1px solid ${C.g200}; border-radius: 16px; padding: 20px 24px; }
    .referral-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
    .referral-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .referral-text { flex: 1; }
    .referral-title { font-size: 15px; font-weight: 800; color: ${C.g900}; margin-bottom: 2px; }
    .referral-desc { font-size: 13px; color: ${C.g500}; }
    .referral-dismiss { background: none; border: none; font-size: 20px; color: ${C.g400}; cursor: pointer; padding: 0 4px; line-height: 1; }
    .referral-dismiss:hover { color: ${C.g600}; }
    .referral-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .referral-chip { padding: 8px 16px; border-radius: 20px; border: 1.5px solid ${C.g200}; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; }
    .referral-chip:hover { border-color: ${C.g300}; }
    .referral-save { margin-top: 16px; display: flex; justify-content: flex-end; }

    /* Notification cards */
    .notif-count {
      margin-left: auto;
      min-width: 22px; height: 22px;
      border-radius: 11px;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; color: #fff;
      padding: 0 6px;
    }

    .notif-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      background: #fff;
      border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g200};
      border-radius: 14px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .notif-card:hover { border-color: ${C.g300}; background: ${C.g50}; }

    .notif-icon-wrap {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .notif-info { flex: 1; min-width: 0; }
    .notif-title { font-size: 13px; font-weight: 700; color: ${C.g900}; margin-bottom: 2px; }
    .notif-desc { font-size: 12px; color: ${C.g500}; line-height: 1.4; }
    .notif-time { font-size: 11px; font-weight: 600; color: ${C.g400}; white-space: nowrap; flex-shrink: 0; }
    .notif-arrow { flex-shrink: 0; display: flex; align-items: center; }

    @media (max-width: 900px) {
      .container { padding: 20px 16px 40px; }
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .actions-row { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardOverviewComponent implements OnInit {
  C = C;
  demoMode: 'full' | 'clear' | 'single' | 'new' = 'full';

  greeting = 'Welcome back, Ahmed';
  subtitle = 'Track your financing applications and manage your portfolio.';

  // --- Data sets ---
  fullApplications = [
    { projectName: "Al Noor Residential", company: "Al Omran Real Estate", amount: "~21M SAR", product: "Development", status: "Term-sheet Ready", sc: "green", route: "/application/1/status" },
    { projectName: "Riyadh Commercial Plaza", company: "Al Omran Real Estate", amount: "~45M SAR", product: "Construction", status: "In Review", sc: "amber", route: "/application/2/status" },
    { projectName: "Tabuk Residential Complex", company: "Al Omran Real Estate", amount: "~8M SAR", product: "Development", status: "Feedback Requested", sc: "amber", route: "/application/3/status" },
  ];

  clearApplications = [
    { projectName: "Al Noor Residential", company: "Al Omran Real Estate", amount: "~21M SAR", product: "Development", status: "Approved", sc: "green", route: "/application/1/status" },
    { projectName: "Riyadh Commercial Plaza", company: "Al Omran Real Estate", amount: "~45M SAR", product: "Construction", status: "In Review", sc: "blue", route: "/application/2/status" },
    { projectName: "Tabuk Residential Complex", company: "Al Omran Real Estate", amount: "~8M SAR", product: "Development", status: "In Review", sc: "blue", route: "/application/3/status" },
  ];

  singleApplications: any[] = [];
  activeApplications = this.fullApplications;

  // --- Stats ---
  fullStats = [
    { label: 'Total Applications', value: 3, iconBg: C.blue50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
    { label: 'Under Review', value: 1, iconBg: C.amber50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.amber500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
    { label: 'Action Required', value: 1, iconBg: '#fff2ee', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>` },
    { label: 'Term-sheet Ready', value: 1, iconBg: C.greenLt, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="16 13 12 17 9 14"/></svg>` },
  ];

  clearStats = [
    { label: 'Total Applications', value: 3, iconBg: C.blue50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
    { label: 'Under Review', value: 2, iconBg: C.amber50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.amber500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
    { label: 'Action Required', value: 0, iconBg: '#fff2ee', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>` },
    { label: 'Approved', value: 1, iconBg: C.greenLt, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` },
  ];

  singleStats = [
    { label: 'Total Applications', value: 0, iconBg: C.blue50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
    { label: 'Under Review', value: 0, iconBg: C.amber50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.amber500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
    { label: 'Action Required', value: 0, iconBg: '#fff2ee', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>` },
    { label: 'Term-sheet Ready', value: 0, iconBg: C.greenLt, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="16 13 12 17 9 14"/></svg>` },
  ];

  activeStats = this.fullStats;

  // --- Onboarding steps ---
  newUserSteps = [
    { title: 'Complete your profile', desc: 'Add your personal details and contact information.', action: 'Complete Profile', route: '/profile?from=onboarding', done: false },
    { title: 'Verify your company', desc: 'Complete company verification to unlock financing.', action: 'Verify Now', route: '/onboarding/company-verify?from=dashboard', done: false },
    { title: 'Add previous credentials', desc: 'Share previous credentials and track record.', action: 'Add Details', route: '/company/0/credentials', done: false },
    { title: 'Add your first project', desc: 'Create a development project to apply for financing.', action: 'Add Project', route: '/project/new?fresh=true', done: false },
    { title: 'Invite your team', desc: 'Add team members to collaborate on projects and applications.', action: 'Invite Team', route: '/dashboard/teams', done: false },
    { title: 'Submit financing application', desc: 'Apply for financing on your project.', action: 'Apply Now', route: '/application/new', done: false },
  ];

  singleUserSteps = [
    { title: 'Complete your profile', desc: 'Add your personal details and contact information.', action: 'Complete Profile', route: '/profile?from=onboarding', done: true },
    { title: 'Verify your company', desc: 'Complete company verification to unlock financing.', action: 'Verify Now', route: '/onboarding/company-verify?from=dashboard', done: false },
    { title: 'Add previous credentials', desc: 'Share previous credentials and track record.', action: 'Add Details', route: '/company/0/credentials', done: false },
    { title: 'Add a project', desc: 'Create your first development project.', action: 'Create Project', route: '/project/new?fresh=true', done: true },
    { title: 'Invite your team', desc: 'Add team members to collaborate on projects and applications.', action: 'Invite Team', route: '/dashboard/teams', done: false },
    { title: 'Submit financing application', desc: 'Apply for financing on your project.', action: 'Apply Now', route: '/application/new', done: false },
  ];

  // --- Notifications ---
  fullNotifications = [
    {
      title: 'Pending Company Verification',
      desc: 'Al Jazeera Development Co. needs to complete company verification.',
      time: '2h ago',
      route: '/onboarding/company-verify?from=dashboard',
      borderColor: C.amber500,
      iconBg: C.amber50,
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.amber500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    },
    {
      title: 'Feedback Requested',
      desc: 'Tabuk Residential Complex application requires additional documents.',
      time: '5h ago',
      route: '/application/3/status',
      borderColor: C.orange,
      iconBg: '#fff2ee',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
    },
    {
      title: 'Term-sheet Ready for Acceptance',
      desc: 'Al Noor Residential financing term-sheet is ready for your review.',
      time: '1d ago',
      route: '/application/1/status',
      borderColor: C.green,
      iconBg: C.greenLt,
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="16 13 12 17 9 14"/></svg>`,
    },
    {
      title: 'Pending Signing Agreement',
      desc: 'Riyadh Commercial Plaza agreement is ready for digital signature.',
      time: '2d ago',
      route: '/application/2/status',
      borderColor: C.blue500,
      iconBg: C.blue50,
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
    },
  ];

  activeNotifications = this.fullNotifications;

  showReferral = true;
  referralOptions = ['X (Twitter)', 'Instagram', 'Snapchat', 'LinkedIn', 'Website', 'A friend', 'Other'];
  referralSource = '';
  referralExtra = '';

  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Check if arriving from onboarding — land on "new" user state
    const state = this.route.snapshot.queryParamMap.get('state');
    if (state === 'new') {
      this.setDemo('new');
    }
  }

  setDemo(mode: 'full' | 'clear' | 'single' | 'new') {
    this.demoMode = mode;
    this.showReferral = mode === 'new';
    this.referralSource = '';
    switch (mode) {
      case 'full':
        this.greeting = 'Welcome back, Ahmed';
        this.subtitle = 'Track your financing applications and manage your portfolio.';
        this.activeStats = this.fullStats;
        this.activeApplications = this.fullApplications;
        this.activeNotifications = this.fullNotifications;
        break;
      case 'clear':
        this.greeting = 'Welcome back, Ahmed';
        this.subtitle = 'Track your financing applications and manage your portfolio.';
        this.activeStats = this.clearStats;
        this.activeApplications = this.clearApplications;
        this.activeNotifications = [];
        break;
      case 'single':
        this.greeting = 'Welcome back, Ahmed';
        this.subtitle = 'Complete the onboarding steps to submit your first financing application.';
        this.activeStats = this.singleStats;
        this.activeApplications = this.singleApplications;
        this.activeNotifications = [];
        break;
      case 'new':
        this.greeting = 'Welcome, Ahmed!';
        this.subtitle = 'Let\u2019s get your company set up on Safqah.';
        this.activeNotifications = [];
        break;
    }
  }

  isStepUnlocked(steps: any[], index: number): boolean {
    if (index === 0) return true;
    return steps.slice(0, index).every((s: any) => s.done);
  }

  toggleStep(steps: any[], index: number): void {
    steps[index].done = !steps[index].done;
    // If undoing a step, also undo all subsequent steps
    if (!steps[index].done) {
      for (let i = index + 1; i < steps.length; i++) {
        steps[i].done = false;
      }
    }
  }

  getProgress(steps: any[]): number {
    const done = steps.filter((s: any) => s.done).length;
    return Math.round(35 + (done / steps.length) * 65);
  }

  safe(html: string): SafeHtml { return this.sanitizer.bypassSecurityTrustHtml(html); }

  go(path: string) { this.router.navigateByUrl(path); }

  onAppClick(app: any) {
    if (app.sc === 'red') return;
    this.go(app.route);
  }
}
