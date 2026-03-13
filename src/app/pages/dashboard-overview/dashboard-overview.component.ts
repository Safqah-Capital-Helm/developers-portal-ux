import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { C } from '../../shared/theme';
import { ButtonComponent, BadgeComponent, InputComponent, StatCardComponent, ListCardComponent, PageHeaderComponent, TranslatePipe, I18nService, ApiService, SkeletonComponent } from '../../shared';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent, InputComponent, StatCardComponent, ListCardComponent, PageHeaderComponent, TranslatePipe, SkeletonComponent],
  template: `
    <div class="container">
      <!-- Demo toggles -->
      <div class="demo-bar">
        <button class="demo-toggle" [class.active]="demoMode === 'full'" (click)="setDemo('full')">{{ 'dashboard.demo_with_actions' | t }}</button>
        <button class="demo-toggle" [class.active]="demoMode === 'clear'" (click)="setDemo('clear')">{{ 'dashboard.demo_all_clear' | t }}</button>
        <button class="demo-toggle" [class.active]="demoMode === 'single'" (click)="setDemo('single')">{{ 'dashboard.demo_single' | t }}</button>
        <button class="demo-toggle" [class.active]="demoMode === 'new'" (click)="setDemo('new')">{{ 'dashboard.demo_new_user' | t }}</button>
      </div>

      <app-page-header [title]="greeting" [subtitle]="subtitle"></app-page-header>

      <!-- ===== Loading skeletons ===== -->
      <div *ngIf="loading">
        <app-skeleton type="stat" [count]="4"></app-skeleton>
        <app-skeleton type="list" [count]="3"></app-skeleton>
        <app-skeleton type="notification" [count]="2"></app-skeleton>
      </div>

      <!-- ===== Stats row (not new user) ===== -->
      <div *ngIf="!loading && demoMode !== 'new'" class="stats-row">
        <app-stat-card *ngFor="let s of activeStats" [label]="s.label" [value]="s.value" [iconBg]="s.iconBg" [icon]="s.icon"></app-stat-card>
      </div>

      <!-- ===== Recent Applications ===== -->
      <div *ngIf="!loading && demoMode !== 'new' && activeApplications.length > 0" class="section">
        <div class="section-header">
          <div class="section-icon" [style.background]="'#eff8ff'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <span class="section-title">{{ 'dashboard.recent_apps' | t }}</span>
          <span class="view-all" (click)="go('/dashboard/applications')">{{ 'common.view_all' | t }} &rarr;</span>
        </div>

        <app-list-card *ngFor="let app of activeApplications" [statusColor]="app.sc" (click)="onAppClick(app)">
          <div class="app-icon-sm"
               [class.icon-green]="app.sc === 'green'"
               [class.icon-amber]="app.sc === 'amber'"
               [class.icon-blue]="app.sc === 'blue'"
               [class.icon-red]="app.sc === 'red'">
            <svg *ngIf="app.sc === 'green'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="16 13 12 17 9 14"/></svg>
            <svg *ngIf="app.sc === 'amber'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <svg *ngIf="app.sc === 'blue'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <svg *ngIf="app.sc === 'red'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9.5" y1="12.5" x2="14.5" y2="17.5"/><line x1="14.5" y1="12.5" x2="9.5" y2="17.5"/></svg>
          </div>
          <div class="recent-info">
            <span class="recent-name">{{ app.projectName }}</span>
            <span class="recent-sub">{{ app.company }} &middot; {{ app.product }}</span>
          </div>
          <div class="recent-right">
            <div class="recent-chip"
                 [class.chip-green]="app.sc === 'green'"
                 [class.chip-amber]="app.sc === 'amber'"
                 [class.chip-blue]="app.sc === 'blue'"
                 [class.chip-red]="app.sc === 'red'">{{ app.amount }}</div>
            <app-badge [color]="$any(app.sc)">{{ app.status }}</app-badge>
          </div>
        </app-list-card>
      </div>

      <!-- ===== NEW USER: Onboarding Steps ===== -->
      <div *ngIf="!loading && demoMode === 'new'" class="section">
        <div class="onboarding-card">
          <div class="onboarding-header">
            <div class="onboarding-header-top">
              <div>
                <div class="onboarding-title">{{ 'dashboard.get_started' | t }}</div>
                <div class="onboarding-desc">{{ 'dashboard.get_started_desc' | t }}</div>
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
                <div class="step-desc">{{ !s.done && !isStepUnlocked(newUserSteps, i) ? ('common.complete_steps_above' | t) : s.desc }}</div>
              </div>
              <div class="step-actions">
                <app-btn *ngIf="!s.done && isStepUnlocked(newUserSteps, i)" variant="primary" size="sm" (clicked)="go(s.route)">{{ s.action }}</app-btn>
                <app-badge *ngIf="s.done" color="green">{{ 'common.done' | t }}</app-badge>
                <button *ngIf="i < newUserSteps.length - 1 && !s.done && isStepUnlocked(newUserSteps, i)" class="demo-advance" (click)="toggleStep(_newUserStepsDone, i)">{{ 'dashboard.demo_mark_done' | t }}</button>
                <button *ngIf="i < newUserSteps.length - 1 && s.done" class="demo-advance" (click)="toggleStep(_newUserStepsDone, i)">{{ 'dashboard.demo_undo' | t }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== SINGLE: Onboarding Steps ===== -->
      <div *ngIf="!loading && demoMode === 'single'" class="section">
        <div class="onboarding-card">
          <div class="onboarding-header">
            <div class="onboarding-header-top">
              <div>
                <div class="onboarding-title">{{ 'dashboard.get_started' | t }}</div>
                <div class="onboarding-desc">{{ 'dashboard.get_started_desc' | t }}</div>
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
                <div class="step-desc">{{ !s.done && !isStepUnlocked(singleUserSteps, i) ? ('common.complete_steps_above' | t) : s.desc }}</div>
              </div>
              <div class="step-actions">
                <app-btn *ngIf="!s.done && isStepUnlocked(singleUserSteps, i)" variant="primary" size="sm" (clicked)="go(s.route)">{{ s.action }}</app-btn>
                <app-badge *ngIf="s.done" color="green">{{ 'common.done' | t }}</app-badge>
                <button *ngIf="i < singleUserSteps.length - 1 && !s.done && isStepUnlocked(singleUserSteps, i)" class="demo-advance" (click)="toggleStep(_singleUserStepsDone, i)">{{ 'dashboard.demo_mark_done' | t }}</button>
                <button *ngIf="i < singleUserSteps.length - 1 && s.done" class="demo-advance" (click)="toggleStep(_singleUserStepsDone, i)">{{ 'dashboard.demo_undo' | t }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Important Notifications (only when there are active ones) ===== -->
      <div *ngIf="!loading && activeNotifications.length > 0" class="section">
        <div class="section-header">
          <div class="section-icon" [style.background]="'#fff2ee'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </div>
          <span class="section-title">{{ 'dashboard.action_required' | t }}</span>
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
      <div *ngIf="!loading && demoMode !== 'new'" class="section">
        <div class="section-header">
          <span class="section-title">{{ 'dashboard.quick_actions' | t }}</span>
        </div>
        <div class="actions-row">
          <div class="action-card" (click)="go('/application/new')">
            <div class="action-icon" [style.background]="C.greenLt">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div class="action-title">{{ 'dashboard.new_application' | t }}</div>
            <div class="action-sub">{{ 'dashboard.new_application_desc' | t }}</div>
          </div>
          <div class="action-card" (click)="go('/project/new')">
            <div class="action-icon" [style.background]="C.blue50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
            </div>
            <div class="action-title">{{ 'dashboard.add_project' | t }}</div>
            <div class="action-sub">{{ 'dashboard.add_project_desc' | t }}</div>
          </div>
          <div class="action-card" (click)="go('/dashboard/teams')">
            <div class="action-icon" [style.background]="C.amber50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            </div>
            <div class="action-title">{{ 'dashboard.invite_member' | t }}</div>
            <div class="action-sub">{{ 'dashboard.invite_member_desc' | t }}</div>
          </div>
        </div>
      </div>

      <!-- Referral card (new user only) -->
      <div *ngIf="!loading && demoMode === 'new' && showReferral" class="referral-card">
        <div class="referral-top">
          <div class="referral-icon" [style.background]="C.greenLt">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <div class="referral-text">
            <div class="referral-title">{{ 'dashboard.referral_title' | t }}</div>
            <div class="referral-desc">{{ 'dashboard.referral_desc' | t }}</div>
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
        <div *ngIf="referralSource === i18n.t('dashboard.referral_friend') || referralSource === i18n.t('dashboard.referral_other')" style="margin-top: 12px;">
          <app-input [label]="referralSource === i18n.t('dashboard.referral_friend') ? ('dashboard.referral_friend_name' | t) : ('dashboard.referral_specify' | t)" [placeholder]="'dashboard.enter_details' | t" [value]="referralExtra" (valueChange)="referralExtra = $event"></app-input>
        </div>
        <div *ngIf="referralSource" class="referral-save">
          <app-btn variant="primary" size="sm" (clicked)="showReferral = false">{{ 'common.submit' | t }}</app-btn>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .container { max-width: 1200px; margin: 0 auto; padding: 32px 32px 60px; }

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

    /* App status icon (compact) */
    .app-icon-sm {
      width: 34px; height: 34px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .icon-green { background: ${C.greenLt}; color: ${C.green}; }
    .icon-amber { background: ${C.amber100}; color: ${C.amber600}; }
    .icon-blue { background: ${C.blue50}; color: ${C.blue500}; }
    .icon-red { background: ${C.red50}; color: ${C.red500}; }

    .recent-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .recent-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }
    .recent-sub { font-size: 12px; color: ${C.g500}; }
    .recent-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

    /* Amount chip (colored) */
    .recent-chip {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 6px;
      font-size: 12px; font-weight: 800;
    }
    .chip-green { background: ${C.greenLt}; color: ${C.green}; }
    .chip-amber { background: ${C.amber100}; color: ${C.amber600}; }
    .chip-blue { background: ${C.blue100}; color: ${C.blue500}; }
    .chip-red { background: ${C.red50}; color: ${C.red500}; }

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
    .referral-dismiss { background: none; border: none; font-size: 20px; color: ${C.g500}; cursor: pointer; padding: 0 4px; line-height: 1; }
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

    @media (max-width: 768px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .actions-row { grid-template-columns: 1fr; gap: 10px; }
      .demo-bar { flex-wrap: wrap; }
      .demo-toggle { padding: 6px 12px; font-size: 11px; }
      .onboarding-card { padding: 16px; }
      .step-card { padding: 12px; gap: 10px; }
      .notif-card { padding: 12px 14px; gap: 10px; }
      .notif-time { display: none; }
      .referral-card { padding: 16px; }
    }

    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .stats-row { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .step-card { flex-wrap: wrap; }
      .step-actions { width: 100%; justify-content: flex-end; }
      .recent-right { flex-direction: column; align-items: flex-end; gap: 4px; }
      .recent-chip { font-size: 11px; padding: 2px 8px; }
      .app-icon-sm { width: 30px; height: 30px; border-radius: 8px; }
      .app-icon-sm svg { width: 13px; height: 13px; }
      .notif-card { flex-wrap: wrap; }
      .notif-arrow { display: none; }
      .referral-chips { gap: 6px; }
      .referral-chip { padding: 6px 12px; font-size: 12px; }
    }

    /* RTL support */
    :host-context([dir="rtl"]) .view-all { margin-left: 0; margin-right: auto; }
    :host-context([dir="rtl"]) .notif-count { margin-left: 0; margin-right: auto; }
    :host-context([dir="rtl"]) .notif-card { border-left: 1px solid ${C.g200}; border-right: 3.5px solid ${C.g200}; }
    :host-context([dir="rtl"]) .notif-arrow svg { transform: rotate(180deg); }
    :host-context([dir="rtl"]) .referral-save { justify-content: flex-start; }
  `]
})
export class DashboardOverviewComponent implements OnInit {
  C = C;
  demoMode: 'full' | 'clear' | 'single' | 'new' = 'full';
  loading = true;

  greeting = '';
  subtitle = '';

  // --- Data sets (loaded from API) ---
  fullApplications: any[] = [];
  clearApplications: any[] = [];
  singleApplications: any[] = [];
  activeApplications: any[] = [];

  // --- Stats (loaded from API per mode) ---
  activeStats: any[] = [];

  // --- Onboarding steps (loaded from API) ---
  _newUserStepsDone = [false, false, false, false, false, false];
  newUserSteps: any[] = [];

  _singleUserStepsDone = [true, false, false, true, false, false];
  singleUserSteps: any[] = [];

  // --- Notifications (loaded from API) ---
  fullNotifications: any[] = [];
  activeNotifications: any[] = [];

  showReferral = true;
  get referralOptions() {
    return [
      this.i18n.t('dashboard.referral_twitter'),
      this.i18n.t('dashboard.referral_instagram'),
      this.i18n.t('dashboard.referral_snapchat'),
      this.i18n.t('dashboard.referral_linkedin'),
      this.i18n.t('dashboard.referral_website'),
      this.i18n.t('dashboard.referral_friend'),
      this.i18n.t('dashboard.referral_other'),
    ];
  }
  referralSource = '';
  referralExtra = '';

  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer, public i18n: I18nService, private api: ApiService) {}

  ngOnInit(): void {
    // Check if arriving from onboarding — land on "new" user state
    const state = this.route.snapshot.queryParamMap.get('state');
    const mode = state === 'new' ? 'new' : 'full';

    // Load data from API
    this.loadDashboardData(mode);
  }

  loadDashboardData(mode: 'full' | 'clear' | 'single' | 'new') {
    this.loading = true;
    this.demoMode = mode;
    this.showReferral = mode === 'new';
    this.referralSource = '';

    // Set greeting immediately (no API needed)
    switch (mode) {
      case 'full':
      case 'clear':
        this.greeting = this.i18n.t('dashboard.welcome', { name: 'Ahmed' });
        this.subtitle = this.i18n.t('dashboard.subtitle');
        break;
      case 'single':
        this.greeting = this.i18n.t('dashboard.welcome', { name: 'Ahmed' });
        this.subtitle = this.i18n.t('dashboard.subtitle_single');
        break;
      case 'new':
        this.greeting = this.i18n.t('dashboard.welcome_new', { name: 'Ahmed' });
        this.subtitle = this.i18n.t('dashboard.subtitle_new');
        break;
    }

    // Load stats from API
    if (mode !== 'new') {
      const statsMode = mode === 'full' || mode === 'clear' || mode === 'single' ? mode : 'full';
      this.api.getDashboardStats(statsMode).subscribe(stats => this.activeStats = stats);
    }

    // Load applications from API
    if (mode === 'full' || mode === 'clear') {
      this.api.getDashboardApplications(mode).subscribe(apps => {
        const mapped = apps.map((a: any) => ({ ...a, sc: a.statusColor }));
        if (mode === 'full') this.fullApplications = mapped;
        else this.clearApplications = mapped;
        this.activeApplications = mapped;
      });
    } else {
      this.activeApplications = [];
    }

    // Load notifications from API (only for full mode)
    if (mode === 'full') {
      this.api.getNotifications().subscribe(notifs => {
        this.fullNotifications = notifs;
        this.activeNotifications = notifs;
        this.loading = false;
      });
    } else {
      this.activeNotifications = [];
      // Load onboarding steps for new/single modes
      if (mode === 'new' || mode === 'single') {
        this.api.getOnboardingSteps(mode === 'new' ? 'new' : 'single').subscribe(steps => {
          if (mode === 'new') {
            this.newUserSteps = steps.map((s, i) => ({ ...s, done: this._newUserStepsDone[i] }));
          } else {
            this.singleUserSteps = steps.map((s, i) => ({ ...s, done: this._singleUserStepsDone[i] }));
          }
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    }
  }

  setDemo(mode: 'full' | 'clear' | 'single' | 'new') {
    this.loadDashboardData(mode);
  }

  isStepUnlocked(steps: any[], index: number): boolean {
    if (index === 0) return true;
    return steps.slice(0, index).every((s: any) => s.done);
  }

  toggleStep(backing: boolean[], index: number): void {
    backing[index] = !backing[index];
    // If undoing a step, also undo all subsequent steps
    if (!backing[index]) {
      for (let i = index + 1; i < backing.length; i++) {
        backing[i] = false;
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
