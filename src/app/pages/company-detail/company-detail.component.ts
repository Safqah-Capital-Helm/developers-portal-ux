import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import { BadgeComponent, BackLinkComponent, ButtonComponent, AvatarComponent, EmptyStateComponent, AlertBannerComponent, SkeletonComponent, ApiService, getCompanyLogo, TranslatePipe, I18nService } from '../../shared';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BadgeComponent, BackLinkComponent, ButtonComponent, AvatarComponent, EmptyStateComponent, AlertBannerComponent, SkeletonComponent, TranslatePipe],
  template: `
    <div class="container" *ngIf="company">
      <app-back-link to="/dashboard/companies" [label]="('company.back_to_companies' | t)"></app-back-link>

      <!-- Verification Alert -->
      <app-alert-banner
        *ngIf="!company.verified"
        type="warning"
        [title]="('company.verify_alert_title' | t)"
        [message]="('company.verify_alert_desc' | t)"
        [actionLabel]="('company.verify_btn' | t)"
        (action)="go('/onboarding/company-verify?from=dashboard')"
        style="display: block; margin-bottom: 16px;"
      ></app-alert-banner>

      <!-- ═══ Hero Card ═══ -->
      <div class="hero-card">
        <div class="hero-top">
          <div class="hero-left">
            <div class="company-logo-wrap" (click)="triggerLogoUpload()">
              <div class="company-logo" [style.background]="company.logoBg">
                <img *ngIf="company.logoUrl" [src]="company.logoUrl" [alt]="company.name" class="logo-img" />
                <span *ngIf="!company.logoUrl" class="logo-initials">{{ company.initials }}</span>
              </div>
              <div class="logo-overlay">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <input type="file" class="logo-file-input" accept="image/*" (change)="onLogoFileSelected($event)" #logoFileInput />
            </div>
            <div class="hero-info">
              <div class="hero-name-row">
                <h1 class="hero-name">{{ company.name }}</h1>
                <app-badge [color]="company.sc">{{ company.status }}</app-badge>
              </div>
              <div class="hero-meta">
                <span class="meta-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  {{ 'common.cr_prefix' | t }} {{ company.cr }}
                </span>
                <span class="meta-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                  {{ company.legalForm }}
                </span>
                <span class="meta-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  {{ company.activity }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Domain name (editable) -->
        <div class="domain-row">
          <div class="domain-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            {{ 'company.domain' | t }}
          </div>
          <div class="domain-value" *ngIf="!editingDomain" (click)="startEditDomain()">
            <span *ngIf="company.domain" class="domain-text">{{ company.domain }}</span>
            <span *ngIf="!company.domain" class="domain-placeholder">{{ 'company.add_domain' | t }}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div class="domain-edit" *ngIf="editingDomain">
            <input
              class="domain-input"
              [(ngModel)]="domainDraft"
              [placeholder]="i18n.t('company.domain_example')"
              (keydown.enter)="saveDomain()"
              (keydown.escape)="cancelEditDomain()"
              #domainInput
            />
            <button class="domain-save" (click)="saveDomain()" aria-label="Save domain">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button class="domain-cancel" (click)="cancelEditDomain()" aria-label="Cancel editing domain">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-value">{{ companyProjects.length }}</div>
            <div class="hero-stat-label">{{ 'company.projects' | t }}</div>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <div class="hero-stat-value">{{ team.length }}</div>
            <div class="hero-stat-label">{{ 'company.members' | t }}</div>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <div class="hero-stat-value">{{ company.capital }}</div>
            <div class="hero-stat-label">{{ 'company.capital' | t }}</div>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <div class="hero-stat-value">{{ company.size }}</div>
            <div class="hero-stat-label">{{ 'company.size' | t }}</div>
          </div>
        </div>
      </div>

      <!-- ═══ Owners Section ═══ -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon-sm" [style.background]="'#f0fdf4'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </span>
            {{ 'company.owners_title' | t }}
            <span class="section-count">{{ owners.length }}</span>
          </h2>
        </div>

        <app-skeleton *ngIf="ownersLoading" type="list" [count]="3"></app-skeleton>

        <div *ngIf="!ownersLoading">
          <div *ngFor="let o of owners" class="owner-row">
            <div class="owner-left">
              <div class="owner-avatar" [style.background]="'linear-gradient(135deg, ' + C.green + ', ' + C.greenDk + ')'">
                {{ getInitials(o.name) }}
              </div>
              <div class="owner-info">
                <div class="owner-name">{{ o.name }}</div>
                <div class="owner-meta">
                  <span class="owner-role">{{ i18n.t('common.role_' + o.role) }}</span>
                  <span class="owner-nid-sep">&middot;</span>
                  <span class="owner-nid">{{ 'company.nid_label' | t }}: {{ maskNid(o.nid) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ Projects Section ═══ -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">{{ 'company.projects' | t }}</h2>
          <a class="new-link" *ngIf="companyProjects.length > 0" (click)="newProject()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ 'company.new_project' | t }}
          </a>
        </div>

        <app-empty-state *ngIf="companyProjects.length === 0" [message]="('company.no_projects' | t)"></app-empty-state>

        <div class="projects-grid" *ngIf="companyProjects.length > 0">
          <div *ngFor="let p of visibleProjects"
               class="project-card"
               [class.draft]="p.draft"
               (click)="goToProject(p)">
            <div class="card-img" [style.backgroundImage]="'url(' + p.img + ')'">
              <span *ngIf="p.draft" class="draft-ribbon">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                {{ 'company.draft' | t }}
              </span>
            </div>
            <div class="card-body">
              <span class="card-name">{{ p.name }}</span>
              <div class="card-meta">{{ p.type }} · {{ p.loc }}</div>
              <div *ngIf="!p.draft && p.cost" class="card-cost">{{ p.cost }}</div>
              <div *ngIf="p.draft" class="draft-msg">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ 'company.setup_incomplete' | t }}
              </div>
            </div>
          </div>
        </div>

        <a *ngIf="companyProjects.length > 3" class="view-all-link" routerLink="/dashboard/projects">
          {{ 'company.view_all_projects' | t:{count: '' + companyProjects.length} }}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>

      <!-- ═══ Previous Credentials Section ═══ -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon-sm" [style.background]="'#eff8ff'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </span>
            {{ 'company.credentials' | t }}
          </h2>
          <a *ngIf="company.hasPrevProjects" class="new-link" (click)="editCredentials()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            {{ 'common.edit' | t }}
          </a>
        </div>

        <!-- Has data -->
        <div *ngIf="company.hasPrevProjects" class="prev-data">
          <div class="prev-stats-row">
            <div class="prev-stat-box">
              <div class="prev-stat-value">{{ company.prevCount }}</div>
              <div class="prev-stat-label">{{ 'company.completed_projects' | t }}</div>
            </div>
            <div class="prev-stat-box">
              <div class="prev-stat-value">{{ company.prevValue }}</div>
              <div class="prev-stat-label">{{ 'company.combined_value' | t }}</div>
            </div>
          </div>

          <div class="prev-fin-section">
            <div class="prev-fin-label">{{ 'credentials.financing_sources' | t }}</div>
            <div class="prev-fin-bar">
              <div class="prev-fin-seg" *ngIf="company.finBank > 0" [style.width.%]="company.finBank" [style.background]="C.green">{{ company.finBank }}%</div>
              <div class="prev-fin-seg" *ngIf="company.finFintech > 0" [style.width.%]="company.finFintech" [style.background]="C.blue500">{{ company.finFintech }}%</div>
              <div class="prev-fin-seg" *ngIf="company.finFriends > 0" [style.width.%]="company.finFriends" [style.background]="C.amber500">{{ company.finFriends }}%</div>
              <div class="prev-fin-seg" *ngIf="company.finSelf > 0" [style.width.%]="company.finSelf" [style.background]="C.g300">{{ company.finSelf }}%</div>
            </div>
            <div class="prev-fin-legend">
              <span class="prev-fin-item"><span class="prev-fin-dot" [style.background]="C.green"></span> {{ 'credentials.bank' | t }} {{ company.finBank }}%</span>
              <span class="prev-fin-item"><span class="prev-fin-dot" [style.background]="C.blue500"></span> {{ 'credentials.fintech' | t }} {{ company.finFintech }}%</span>
              <span class="prev-fin-item"><span class="prev-fin-dot" [style.background]="C.amber500"></span> {{ 'credentials.friends_family' | t }} {{ company.finFriends }}%</span>
              <span class="prev-fin-item"><span class="prev-fin-dot" [style.background]="C.g300"></span> {{ 'credentials.self_funded' | t }} {{ company.finSelf }}%</span>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="!company.hasPrevProjects" class="prev-empty">
          <div class="prev-empty-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g300" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div class="prev-empty-text">{{ 'company.no_credentials' | t }}</div>
          <div class="prev-empty-desc">{{ 'company.no_credentials_desc' | t }}</div>
          <app-btn variant="primary" size="sm" (clicked)="editCredentials()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {{ 'company.add_credentials' | t }}
          </app-btn>
        </div>
      </div>

      <!-- ═══ Team Section ═══ -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">{{ 'company.team_members' | t }} <span class="section-count">{{ team.length }}</span></h2>
          <a routerLink="/dashboard/teams" class="new-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            {{ 'company.invite' | t }}
          </a>
        </div>

        <div *ngFor="let m of team" class="member-row">
          <div class="member-left">
            <app-avatar [initials]="m.name.charAt(0)" [color]="m.active !== false ? 'green' : 'gray'" size="md"></app-avatar>
            <div class="member-info">
              <div class="member-name">{{ m.name }}</div>
              <div class="member-email">{{ m.email }}</div>
            </div>
          </div>
          <app-badge [color]="roleBadgeColor(m.role)">{{ m.role }}</app-badge>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .container {
      max-width: 880px;
      margin: 0 auto;
      padding: 32px 32px 60px;
    }

    /* ═══ Hero Card ═══ */
    .hero-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 20px;
      padding: 32px 32px 0;
      margin-bottom: 20px;
    }
    .hero-top {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 16px; margin-bottom: 24px;
    }
    .hero-left { display: flex; align-items: center; gap: 18px; flex: 1; min-width: 0; }

    /* Company Logo (updatable) */
    .company-logo-wrap {
      position: relative; width: 60px; height: 60px;
      flex-shrink: 0; cursor: pointer; border-radius: 16px;
    }
    .company-logo {
      width: 60px; height: 60px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; transition: filter 0.2s;
    }
    .company-logo-wrap:hover .company-logo { filter: brightness(0.7); }
    .logo-overlay {
      position: absolute; inset: 0; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.35); color: #fff;
      opacity: 0; transition: opacity 0.2s; pointer-events: none;
    }
    .company-logo-wrap:hover .logo-overlay { opacity: 1; }
    .logo-file-input {
      position: absolute; inset: 0; width: 100%; height: 100%;
      opacity: 0; cursor: pointer; z-index: 2;
    }
    .logo-img {
      width: 100%; height: 100%; object-fit: cover;
    }
    .logo-initials {
      font-size: 20px; font-weight: 900; color: #fff;
      letter-spacing: 0.5px;
    }

    .hero-info { flex: 1; min-width: 0; }
    .hero-name-row {
      display: flex; align-items: center; gap: 10px;
      flex-wrap: wrap; margin-bottom: 8px;
    }
    .hero-name {
      font-size: 22px; font-weight: 900; color: ${C.g900}; margin: 0;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .hero-meta {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    }
    .meta-chip {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 600; color: ${C.g500};
      background: ${C.g50}; border: 1px solid ${C.g200};
      padding: 4px 10px; border-radius: 8px;
      white-space: nowrap;
    }
    .meta-chip svg { stroke: ${C.g400}; }

    /* Domain row */
    .domain-row {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 0; margin: 0 0 0;
      border-top: 1px solid ${C.g100};
    }
    .domain-label {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px;
      flex-shrink: 0;
    }
    .domain-value {
      display: flex; align-items: center; gap: 6px;
      cursor: pointer; padding: 4px 10px; border-radius: 8px;
      transition: background 0.15s;
    }
    .domain-value:hover { background: ${C.g50}; }
    .domain-text {
      font-size: 13px; font-weight: 600; color: ${C.g700};
    }
    .domain-placeholder {
      font-size: 13px; font-weight: 600; color: ${C.g300};
      font-style: italic;
    }
    .domain-edit {
      display: flex; align-items: center; gap: 6px; flex: 1;
    }
    .domain-input {
      flex: 1; max-width: 280px;
      padding: 6px 12px; border: 1.5px solid ${C.green};
      border-radius: 8px; font-size: 13px; font-weight: 600;
      color: ${C.g800}; outline: none; font-family: inherit;
      background: ${C.greenLt};
      transition: border-color 0.15s;
    }
    .domain-input::placeholder { color: ${C.g300}; font-style: italic; font-weight: 500; }
    .domain-input:focus { border-color: ${C.green}; box-shadow: 0 0 0 3px ${C.green}18; }
    .domain-save, .domain-cancel {
      width: 30px; height: 30px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      border: none; cursor: pointer; transition: all 0.15s;
    }
    .domain-save {
      background: ${C.green}; color: #fff;
    }
    .domain-save:hover { background: ${C.greenDk}; }
    .domain-cancel {
      background: ${C.g100}; color: ${C.g500};
    }
    .domain-cancel:hover { background: ${C.g200}; color: ${C.g700}; }

    /* Hero stats */
    .hero-stats {
      display: flex; align-items: center;
      border-top: 1px solid ${C.g100};
      padding: 0;
    }
    .hero-stat {
      flex: 1; text-align: center; padding: 18px 12px;
    }
    .hero-stat-value {
      font-size: 18px; font-weight: 900; color: ${C.g900};
      margin-bottom: 2px;
    }
    .hero-stat-label {
      font-size: 11px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .hero-stat-divider {
      width: 1px; height: 32px; background: ${C.g200}; flex-shrink: 0;
    }

    /* ═══ Section ═══ */
    .section {
      background: #fff; border: 1px solid ${C.g200};
      border-radius: 20px; padding: 24px 28px 20px;
      margin-bottom: 16px;
    }
    .section-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 16px; font-weight: 800; color: ${C.g800};
      margin: 0; display: flex; align-items: center; gap: 8px;
    }
    .section-count {
      font-size: 12px; font-weight: 700; color: ${C.g400};
      background: ${C.g100}; padding: 2px 8px; border-radius: 6px;
    }
    .new-link {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 700; color: ${C.green};
      text-decoration: none; cursor: pointer;
      padding: 5px 12px; border-radius: 8px;
      transition: background 0.15s;
    }
    .new-link:hover { background: ${C.greenLt}; }

    /* ═══ Project Grid (matches projects page) ═══ */
    .projects-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;
    }

    .project-card {
      background: #fff; border: 1px solid ${C.g200};
      border-radius: 14px; overflow: hidden;
      cursor: pointer; transition: box-shadow 0.2s, transform 0.15s;
    }
    .project-card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }
    .project-card.draft {
      border-color: ${C.amber100}; background: ${C.amber50};
    }
    .project-card.draft .card-img { opacity: 0.7; }

    .card-img {
      height: 120px; background-size: cover;
      background-position: center; background-color: ${C.g100};
      position: relative;
    }
    .draft-ribbon {
      position: absolute; top: 8px; left: 8px;
      display: inline-flex; align-items: center; gap: 4px;
      background: ${C.amber500}; color: #fff;
      font-size: 10px; font-weight: 700;
      padding: 3px 8px; border-radius: 6px;
    }
    .card-body { padding: 12px 14px 14px; }
    .card-name {
      font-size: 14px; font-weight: 700; color: ${C.g900};
      display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
      overflow: hidden; margin-bottom: 3px;
    }
    .card-meta {
      font-size: 11px; color: ${C.g500}; margin-bottom: 6px;
    }
    .card-cost {
      font-size: 12px; font-weight: 700; color: ${C.g700};
      background: ${C.g50}; border-radius: 6px;
      padding: 4px 8px; display: inline-block;
    }
    .draft-msg {
      display: flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 600; color: ${C.amber600};
    }

    .view-all-link {
      display: flex; align-items: center; justify-content: center;
      gap: 4px; margin-top: 14px;
      font-size: 13px; font-weight: 700; color: ${C.green};
      text-decoration: none; cursor: pointer;
      padding: 8px 0; border-radius: 8px;
      transition: background 0.15s;
    }
    .view-all-link:hover { background: ${C.greenLt}; }

    /* ═══ Previous Project History ═══ */
    .section-icon-sm {
      width: 28px; height: 28px; border-radius: 8px;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .prev-stats-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
      margin-bottom: 16px;
    }
    .prev-stat-box {
      background: ${C.g50}; border: 1px solid ${C.g100};
      border-radius: 12px; padding: 16px;
      text-align: center;
    }
    .prev-stat-value {
      font-size: 20px; font-weight: 900; color: ${C.g900};
      margin-bottom: 2px;
    }
    .prev-stat-label {
      font-size: 11px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px;
    }

    .prev-fin-section { margin-top: 4px; }
    .prev-fin-label {
      font-size: 12px; font-weight: 700; color: ${C.g500};
      margin-bottom: 10px;
    }
    .prev-fin-bar {
      display: flex; height: 28px; border-radius: 8px;
      overflow: hidden; margin-bottom: 12px;
    }
    .prev-fin-seg {
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800; color: #fff;
      min-width: 30px; transition: width 0.3s;
    }
    .prev-fin-legend {
      display: flex; flex-wrap: wrap; gap: 14px;
    }
    .prev-fin-item {
      display: flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 600; color: ${C.g600};
    }
    .prev-fin-dot {
      width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    }

    .prev-empty {
      display: flex; flex-direction: column; align-items: center;
      padding: 24px 16px; text-align: center;
    }
    .prev-empty-icon {
      width: 48px; height: 48px; border-radius: 12px;
      background: ${C.g50}; display: flex; align-items: center;
      justify-content: center; margin-bottom: 12px;
    }
    .prev-empty-text {
      font-size: 14px; font-weight: 700; color: ${C.g600};
      margin-bottom: 4px;
    }
    .prev-empty-desc {
      font-size: 12px; color: ${C.g400}; margin-bottom: 16px;
      max-width: 320px;
    }

    /* ═══ Owners ═══ */
    .owner-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 14px; border-radius: 12px; margin-bottom: 6px;
      transition: background 0.15s;
    }
    .owner-row:hover { background: ${C.g50}; }
    .owner-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
    .owner-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 800; color: #fff;
      flex-shrink: 0; letter-spacing: 0.3px;
    }
    .owner-info { flex: 1; min-width: 0; }
    .owner-name {
      font-size: 14px; font-weight: 700; color: ${C.g900};
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .owner-meta {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: ${C.g400}; margin-top: 2px;
      flex-wrap: wrap;
    }
    .owner-role { font-weight: 600; color: ${C.g500}; }
    .owner-nid-sep { color: ${C.g300}; }
    .owner-nid { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11px; color: ${C.g400}; letter-spacing: 0.3px; }

    /* ═══ Team members ═══ */
    .member-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 14px; border-radius: 12px; margin-bottom: 6px;
      transition: background 0.15s;
    }
    .member-row:hover { background: ${C.g50}; }
    .member-left { display: flex; align-items: center; gap: 12px; }
    .member-info { min-width: 0; }
    .member-name { font-size: 13px; font-weight: 700; color: ${C.g900}; }
    .member-email { font-size: 11px; color: ${C.g400}; }

    @media (max-width: 900px) {
      .container { padding: 20px 16px 40px; }
      .hero-top { flex-direction: column; }
      .hero-left { flex-direction: column; text-align: center; }
      .hero-name-row { justify-content: center; }
      .hero-meta { justify-content: center; }
      .projects-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 600px) {
      .projects-grid { grid-template-columns: 1fr; }
      .hero-stats { flex-wrap: wrap; }
    }
    @media (max-width: 768px) {
      .container { padding: 20px 16px 40px; }
      .hero-card { padding: 20px 20px 0; border-radius: 16px; }
      .section { padding: 18px 20px 16px; border-radius: 16px; }
      .prev-stats-row { grid-template-columns: 1fr; }
      .prev-fin-legend { gap: 10px; }
      .domain-row { flex-wrap: wrap; gap: 8px; }
    }
    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .hero-card { padding: 16px 16px 0; }
      .hero-name { font-size: 18px; }
      .hero-left { gap: 12px; }
      .company-logo-wrap { width: 48px; height: 48px; border-radius: 12px; }
      .company-logo { width: 48px; height: 48px; border-radius: 12px; }
      .logo-overlay { border-radius: 12px; }
      .meta-chip { font-size: 11px; padding: 3px 8px; }
      .section { padding: 14px 16px 12px; }
      .hero-stats { padding: 0; }
      .hero-stat { padding: 12px 8px; }
      .hero-stat-value { font-size: 16px; }
      .member-row { padding: 8px 10px; }
      .prev-fin-legend { flex-direction: column; gap: 6px; }
    }
  `]
})
export class CompanyDetailComponent implements OnInit {
  C = C;
  company: any = null;
  companyId = 0;
  companyProjects: any[] = [];
  team: any[] = [];
  owners: any[] = [];
  ownersLoading = true;
  editingDomain = false;
  domainDraft = '';

  get companies() {
    return [
      {
        name: "Al Omran Real Estate Dev Co.", cr: "1551515151516515",
        status: this.i18n.t('common.status_approved'), sc: "green" as const,
        verified: true, hasPrevProjects: true, initials: "AO",
        logoBg: `linear-gradient(135deg, ${C.green}, ${C.greenDk})`,
        logoUrl: getCompanyLogo("1551515151516515"),
        legalForm: this.i18n.t('common.legal_form_llc'), activity: this.i18n.t('common.activity_re_dev'),
        capital: "50M", size: this.i18n.t('common.size_medium'),
        domain: "alomran.com",
        prevCount: 12, prevValue: "SAR 180M",
        finBank: 40, finFintech: 20, finFriends: 15, finSelf: 25
      },
      {
        name: "Al Jazeera Development Co.", cr: "1020304050607",
        status: this.i18n.t('common.status_pending_verification'), sc: "amber" as const,
        verified: false, hasPrevProjects: false, initials: "AJ",
        logoBg: `linear-gradient(135deg, ${C.purple}, ${C.purpleDk})`,
        logoUrl: getCompanyLogo("1020304050607"),
        legalForm: this.i18n.t('common.legal_form_llc'), activity: this.i18n.t('common.activity_re_dev'),
        capital: "30M", size: this.i18n.t('common.size_small'),
        domain: "",
        prevCount: 0, prevValue: "",
        finBank: 0, finFintech: 0, finFriends: 0, finSelf: 0
      },
      {
        name: "Riyad Construction Group", cr: "3080706050403",
        status: this.i18n.t('common.status_missing_credentials'), sc: "red" as const,
        verified: true, hasPrevProjects: false, initials: "RC",
        logoBg: `linear-gradient(135deg, ${C.orange}, ${C.orangeDk})`,
        logoUrl: getCompanyLogo("3080706050403"),
        legalForm: this.i18n.t('common.legal_form_llc'), activity: this.i18n.t('common.activity_construction'),
        capital: "20M", size: this.i18n.t('common.size_small'),
        domain: "riyadconstruction.sa",
        prevCount: 0, prevValue: "",
        finBank: 0, finFintech: 0, finFriends: 0, finSelf: 0
      }
    ];
  }

  get allTeams(): Record<number, any[]> {
    return {
      0: [
        { name: "Ahmed Al-Salem", email: "ahmed@alomran.com", role: this.i18n.t('common.role_admin'), active: true },
        { name: "Mohammad Al-Salem", email: "mohammad@alomran.com", role: this.i18n.t('common.role_admin'), active: true },
        { name: "Fahad Al-Harbi", email: "fahad@alomran.com", role: this.i18n.t('common.role_viewer'), active: true },
        { name: "Sarah Ahmad", email: "sarah@alomran.com", role: this.i18n.t('common.role_editor'), active: false }
      ],
      1: [
        { name: "Omar Al-Rashid", email: "omar@aljazeera-dev.com", role: this.i18n.t('common.role_admin'), active: true }
      ],
      2: [
        { name: "Saad Al-Dosari", email: "saad@riyadconstruction.sa", role: this.i18n.t('common.role_admin'), active: true },
        { name: "Nasser Al-Mutairi", email: "nasser@riyadconstruction.sa", role: this.i18n.t('common.role_viewer'), active: true }
      ]
    };
  }

  get projects(): any[] {
    return [
      {
        name: "Al Noor Residential", type: this.i18n.t('common.type_mixed_use'), loc: "Dammam",
        comp: "Al Omran Real Estate Dev Co.", idx: 1, cost: "SAR 28M",
        img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=480&h=320&fit=crop"
      },
      {
        name: "Riyadh Commercial Plaza", type: this.i18n.t('common.type_commercial'), loc: "Riyadh",
        comp: "Al Omran Real Estate Dev Co.", idx: 2, cost: "SAR 65M",
        img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=480&h=320&fit=crop"
      },
      {
        name: "Tabuk Residential Complex", type: this.i18n.t('common.type_residential'), loc: "Tabuk",
        comp: "Al Omran Real Estate Dev Co.", idx: 3, cost: "SAR 12M",
        img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=480&h=320&fit=crop"
      },
      {
        name: "Jeddah Waterfront Villas", type: this.i18n.t('common.type_residential'), loc: "Jeddah",
        comp: "Al Omran Real Estate Dev Co.", idx: 4, cost: "SAR 32M",
        img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=480&h=320&fit=crop"
      },
      {
        name: "Abha Mountain Villas", type: this.i18n.t('common.type_residential'), loc: "Abha",
        comp: "Al Omran Real Estate Dev Co.", idx: 5, cost: "SAR 14M",
        img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=480&h=320&fit=crop"
      },
      {
        name: "Al Rawdah Gardens", type: this.i18n.t('common.type_residential'), loc: "Riyadh",
        comp: "Al Omran Real Estate Dev Co.", idx: 6, cost: "SAR 30M",
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=480&h=320&fit=crop"
      },
      {
        name: "Khobar Mixed-Use Tower", type: this.i18n.t('common.type_mixed_use'), loc: "Khobar",
        comp: "Al Omran Real Estate Dev Co.", idx: 0, draft: true,
        img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=480&h=320&fit=crop"
      },
      {
        name: "Eastern Industrial Park", type: this.i18n.t('common.type_industrial'), loc: "Dammam",
        comp: "Al Jazeera Development Co.", idx: 7, cost: "SAR 75M",
        img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=480&h=320&fit=crop"
      },
      {
        name: "Madinah Commercial Hub", type: this.i18n.t('common.type_commercial'), loc: "Madinah",
        comp: "Al Jazeera Development Co.", idx: 8, cost: "SAR 40M",
        img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=480&h=320&fit=crop"
      },
      {
        name: "Al Khalij Residential", type: this.i18n.t('common.type_residential'), loc: "Riyadh",
        comp: "Riyad Construction Group", idx: 9, cost: "SAR 22M",
        img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=480&h=320&fit=crop"
      },
    ];
  }

  constructor(private route: ActivatedRoute, private router: Router, public i18n: I18nService, private api: ApiService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id >= 0 && id < this.companies.length) {
        this.companyId = id;
        this.company = this.companies[id];
        this.companyProjects = this.projects.filter(p => p.comp === this.company.name);
        this.team = this.allTeams[id] || [];
        this.loadOwners(String(id));
      }
    });
  }

  private loadOwners(companyId: string) {
    this.ownersLoading = true;
    this.api.getCompanyOwners(companyId).subscribe(owners => {
      this.owners = owners;
      this.ownersLoading = false;
    });
  }

  /** Show max 3 projects in the card view */
  get visibleProjects(): any[] {
    return this.companyProjects.slice(0, 3);
  }

  roleBadgeColor(role: string): 'green' | 'amber' | 'gray' | 'blue' | 'red' {
    const map: Record<string, 'green' | 'amber' | 'gray' | 'blue' | 'red'> = {
      [this.i18n.t('common.role_admin')]: 'blue',
      [this.i18n.t('common.role_editor')]: 'green',
      [this.i18n.t('common.role_contributor')]: 'amber',
      [this.i18n.t('common.role_viewer')]: 'gray'
    };
    return map[role] || 'gray';
  }

  goToProject(p: any) {
    if (p.draft) {
      this.router.navigateByUrl('/project/new');
      return;
    }
    this.router.navigateByUrl('/dashboard/project/' + p.idx);
  }

  newProject() {
    this.router.navigate(['/project/new'], { queryParams: { fresh: '1', company: this.company.cr } });
  }

  startEditDomain() {
    this.domainDraft = this.company?.domain || '';
    this.editingDomain = true;
    setTimeout(() => {
      const el = document.querySelector('.domain-input') as HTMLInputElement;
      if (el) el.focus();
    });
  }

  saveDomain() {
    if (this.company) {
      this.company.domain = this.domainDraft.trim();
    }
    this.editingDomain = false;
  }

  cancelEditDomain() {
    this.editingDomain = false;
  }

  editCredentials() {
    this.router.navigateByUrl('/company/' + this.companyId + '/credentials');
  }

  getInitials(name: string): string {
    return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  maskNid(nid: string): string {
    if (!nid || nid.length < 6) return nid;
    return nid.slice(0, 3) + '...' + nid.slice(-3);
  }

  triggerLogoUpload() {
    // The hidden file input handles the click natively
  }

  onLogoFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (this.company) {
        this.company.logoUrl = reader.result as string;
        this.company.logoBg = 'transparent';
      }
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  go(path: string) { this.router.navigateByUrl(path); }
}
