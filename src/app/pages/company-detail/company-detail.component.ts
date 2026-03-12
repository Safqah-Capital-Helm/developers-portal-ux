import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import { BadgeComponent, BackLinkComponent, ButtonComponent, AvatarComponent, EmptyStateComponent, AlertBannerComponent, getCompanyLogo } from '../../shared';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BadgeComponent, BackLinkComponent, ButtonComponent, AvatarComponent, EmptyStateComponent, AlertBannerComponent],
  template: `
    <div class="container" *ngIf="company">
      <app-back-link to="/dashboard/companies" label="Back to Companies"></app-back-link>

      <!-- Verification Alert -->
      <app-alert-banner
        *ngIf="!company.verified"
        type="warning"
        title="Company Verification Required"
        message="Complete company verification to unlock financing applications."
        actionLabel="Verify Company"
        (action)="go('/onboarding/company-verify?from=dashboard')"
        style="display: block; margin-bottom: 16px;"
      ></app-alert-banner>

      <!-- ═══ Hero Card ═══ -->
      <div class="hero-card">
        <div class="hero-top">
          <div class="hero-left">
            <div class="company-logo" [style.background]="company.logoBg">
              <img *ngIf="company.logoUrl" [src]="company.logoUrl" [alt]="company.name" class="logo-img" />
              <span *ngIf="!company.logoUrl" class="logo-initials">{{ company.initials }}</span>
            </div>
            <div class="hero-info">
              <div class="hero-name-row">
                <h1 class="hero-name">{{ company.name }}</h1>
                <app-badge [color]="company.sc">{{ company.status }}</app-badge>
              </div>
              <div class="hero-meta">
                <span class="meta-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  CR {{ company.cr }}
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
            Domain
          </div>
          <div class="domain-value" *ngIf="!editingDomain" (click)="startEditDomain()">
            <span *ngIf="company.domain" class="domain-text">{{ company.domain }}</span>
            <span *ngIf="!company.domain" class="domain-placeholder">Add domain name</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div class="domain-edit" *ngIf="editingDomain">
            <input
              class="domain-input"
              [(ngModel)]="domainDraft"
              placeholder="e.g. alomran.com"
              (keydown.enter)="saveDomain()"
              (keydown.escape)="cancelEditDomain()"
              #domainInput
            />
            <button class="domain-save" (click)="saveDomain()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button class="domain-cancel" (click)="cancelEditDomain()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-value">{{ companyProjects.length }}</div>
            <div class="hero-stat-label">Projects</div>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <div class="hero-stat-value">{{ team.length }}</div>
            <div class="hero-stat-label">Members</div>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <div class="hero-stat-value">{{ company.capital }}</div>
            <div class="hero-stat-label">Capital</div>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <div class="hero-stat-value">{{ company.size }}</div>
            <div class="hero-stat-label">Size</div>
          </div>
        </div>
      </div>

      <!-- ═══ Projects Section ═══ -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Projects</h2>
          <a class="new-link" *ngIf="companyProjects.length > 0" (click)="newProject()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </a>
        </div>

        <app-empty-state *ngIf="companyProjects.length === 0" message="No projects yet"></app-empty-state>

        <div class="projects-grid" *ngIf="companyProjects.length > 0">
          <div *ngFor="let p of visibleProjects"
               class="project-card"
               [class.draft]="p.draft"
               (click)="goToProject(p)">
            <div class="card-img" [style.backgroundImage]="'url(' + p.img + ')'">
              <span *ngIf="p.draft" class="draft-ribbon">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Draft
              </span>
            </div>
            <div class="card-body">
              <span class="card-name">{{ p.name }}</span>
              <div class="card-meta">{{ p.type }} · {{ p.loc }}</div>
              <div *ngIf="!p.draft && p.cost" class="card-cost">{{ p.cost }}</div>
              <div *ngIf="p.draft" class="draft-msg">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Setup incomplete
              </div>
            </div>
          </div>
        </div>

        <a *ngIf="companyProjects.length > 3" class="view-all-link" routerLink="/dashboard/projects">
          View all {{ companyProjects.length }} projects
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
            Previous Credentials
          </h2>
          <a *ngIf="company.hasPrevProjects" class="new-link" (click)="editCredentials()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </a>
        </div>

        <!-- Has data -->
        <div *ngIf="company.hasPrevProjects" class="prev-data">
          <div class="prev-stats-row">
            <div class="prev-stat-box">
              <div class="prev-stat-value">{{ company.prevCount }}</div>
              <div class="prev-stat-label">Completed Projects</div>
            </div>
            <div class="prev-stat-box">
              <div class="prev-stat-value">{{ company.prevValue }}</div>
              <div class="prev-stat-label">Combined Value</div>
            </div>
          </div>

          <div class="prev-fin-section">
            <div class="prev-fin-label">Financing Sources</div>
            <div class="prev-fin-bar">
              <div class="prev-fin-seg" *ngIf="company.finBank > 0" [style.width.%]="company.finBank" [style.background]="C.green">{{ company.finBank }}%</div>
              <div class="prev-fin-seg" *ngIf="company.finFintech > 0" [style.width.%]="company.finFintech" [style.background]="C.blue500">{{ company.finFintech }}%</div>
              <div class="prev-fin-seg" *ngIf="company.finFriends > 0" [style.width.%]="company.finFriends" [style.background]="C.amber500">{{ company.finFriends }}%</div>
              <div class="prev-fin-seg" *ngIf="company.finSelf > 0" [style.width.%]="company.finSelf" [style.background]="C.g300">{{ company.finSelf }}%</div>
            </div>
            <div class="prev-fin-legend">
              <span class="prev-fin-item"><span class="prev-fin-dot" [style.background]="C.green"></span> Bank {{ company.finBank }}%</span>
              <span class="prev-fin-item"><span class="prev-fin-dot" [style.background]="C.blue500"></span> Fintech {{ company.finFintech }}%</span>
              <span class="prev-fin-item"><span class="prev-fin-dot" [style.background]="C.amber500"></span> Friends & Family {{ company.finFriends }}%</span>
              <span class="prev-fin-item"><span class="prev-fin-dot" [style.background]="C.g300"></span> Self-Funded {{ company.finSelf }}%</span>
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
          <div class="prev-empty-text">No previous credentials added yet</div>
          <div class="prev-empty-desc">Share your track record to strengthen financing applications.</div>
          <app-btn variant="primary" size="sm" (clicked)="editCredentials()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Credentials
          </app-btn>
        </div>
      </div>

      <!-- ═══ Team Section ═══ -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Team Members <span class="section-count">{{ team.length }}</span></h2>
          <a routerLink="/dashboard/teams" class="new-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Invite
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
      padding: 28px 40px 60px;
    }

    /* ═══ Hero Card ═══ */
    .hero-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 20px;
      padding: 28px 28px 0;
      margin-bottom: 20px;
    }
    .hero-top {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 16px; margin-bottom: 24px;
    }
    .hero-left { display: flex; align-items: center; gap: 18px; flex: 1; min-width: 0; }

    /* Company Logo */
    .company-logo {
      width: 60px; height: 60px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; overflow: hidden;
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
      .company-logo { width: 48px; height: 48px; border-radius: 12px; }
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
  editingDomain = false;
  domainDraft = '';

  companies = [
    {
      name: "Al Omran Real Estate Dev Co.", cr: "1551515151516515",
      status: "Approved", sc: "green" as const,
      verified: true, hasPrevProjects: true, initials: "AO",
      logoBg: `linear-gradient(135deg, ${C.green}, ${C.greenDk})`,
      logoUrl: getCompanyLogo("1551515151516515"),
      legalForm: "LLC", activity: "RE Development",
      capital: "50M", size: "Medium",
      domain: "alomran.com",
      prevCount: 12, prevValue: "SAR 180M",
      finBank: 40, finFintech: 20, finFriends: 15, finSelf: 25
    },
    {
      name: "Al Jazeera Development Co.", cr: "1020304050607",
      status: "Pending Verification", sc: "amber" as const,
      verified: false, hasPrevProjects: false, initials: "AJ",
      logoBg: `linear-gradient(135deg, ${C.purple}, ${C.purpleDk})`,
      logoUrl: getCompanyLogo("1020304050607"),
      legalForm: "LLC", activity: "RE Development",
      capital: "30M", size: "Small",
      domain: "",
      prevCount: 0, prevValue: "",
      finBank: 0, finFintech: 0, finFriends: 0, finSelf: 0
    },
    {
      name: "Riyad Construction Group", cr: "3080706050403",
      status: "Missing Credentials", sc: "red" as const,
      verified: true, hasPrevProjects: false, initials: "RC",
      logoBg: `linear-gradient(135deg, ${C.orange}, ${C.orangeDk})`,
      logoUrl: getCompanyLogo("3080706050403"),
      legalForm: "LLC", activity: "Construction",
      capital: "20M", size: "Small",
      domain: "riyadconstruction.sa",
      prevCount: 0, prevValue: "",
      finBank: 0, finFintech: 0, finFriends: 0, finSelf: 0
    }
  ];

  allTeams: Record<number, any[]> = {
    0: [
      { name: "Ahmed Al-Salem", email: "ahmed@alomran.com", role: "Admin", active: true },
      { name: "Mohammad Al-Salem", email: "mohammad@alomran.com", role: "Admin", active: true },
      { name: "Fahad Al-Harbi", email: "fahad@alomran.com", role: "Viewer", active: true },
      { name: "Sarah Ahmad", email: "sarah@alomran.com", role: "Editor", active: false }
    ],
    1: [
      { name: "Omar Al-Rashid", email: "omar@aljazeera-dev.com", role: "Admin", active: true }
    ],
    2: [
      { name: "Saad Al-Dosari", email: "saad@riyadconstruction.sa", role: "Admin", active: true },
      { name: "Nasser Al-Mutairi", email: "nasser@riyadconstruction.sa", role: "Viewer", active: true }
    ]
  };

  projects: any[] = [
    {
      name: "Al Noor Residential", type: "Mixed Use", loc: "Dammam",
      comp: "Al Omran Real Estate Dev Co.", idx: 1, cost: "SAR 28M",
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=480&h=320&fit=crop"
    },
    {
      name: "Riyadh Commercial Plaza", type: "Commercial", loc: "Riyadh",
      comp: "Al Omran Real Estate Dev Co.", idx: 2, cost: "SAR 65M",
      img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=480&h=320&fit=crop"
    },
    {
      name: "Tabuk Residential Complex", type: "Residential", loc: "Tabuk",
      comp: "Al Omran Real Estate Dev Co.", idx: 3, cost: "SAR 12M",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=480&h=320&fit=crop"
    },
    {
      name: "Jeddah Waterfront Villas", type: "Residential", loc: "Jeddah",
      comp: "Al Omran Real Estate Dev Co.", idx: 4, cost: "SAR 32M",
      img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=480&h=320&fit=crop"
    },
    {
      name: "Abha Mountain Villas", type: "Residential", loc: "Abha",
      comp: "Al Omran Real Estate Dev Co.", idx: 5, cost: "SAR 14M",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=480&h=320&fit=crop"
    },
    {
      name: "Al Rawdah Gardens", type: "Residential", loc: "Riyadh",
      comp: "Al Omran Real Estate Dev Co.", idx: 6, cost: "SAR 30M",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=480&h=320&fit=crop"
    },
    {
      name: "Khobar Mixed-Use Tower", type: "Mixed Use", loc: "Khobar",
      comp: "Al Omran Real Estate Dev Co.", idx: 0, draft: true,
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=480&h=320&fit=crop"
    },
    {
      name: "Eastern Industrial Park", type: "Industrial", loc: "Dammam",
      comp: "Al Jazeera Development Co.", idx: 7, cost: "SAR 75M",
      img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=480&h=320&fit=crop"
    },
    {
      name: "Madinah Commercial Hub", type: "Commercial", loc: "Madinah",
      comp: "Al Jazeera Development Co.", idx: 8, cost: "SAR 40M",
      img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=480&h=320&fit=crop"
    },
    {
      name: "Al Khalij Residential", type: "Residential", loc: "Riyadh",
      comp: "Riyad Construction Group", idx: 9, cost: "SAR 22M",
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=480&h=320&fit=crop"
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id >= 0 && id < this.companies.length) {
        this.companyId = id;
        this.company = this.companies[id];
        this.companyProjects = this.projects.filter(p => p.comp === this.company.name);
        this.team = this.allTeams[id] || [];
      }
    });
  }

  /** Show max 3 projects in the card view */
  get visibleProjects(): any[] {
    return this.companyProjects.slice(0, 3);
  }

  roleBadgeColor(role: string): 'green' | 'amber' | 'gray' | 'blue' | 'red' {
    const map: Record<string, 'green' | 'amber' | 'gray' | 'blue' | 'red'> = {
      Admin: 'blue', Editor: 'green', Contributor: 'amber', Viewer: 'gray'
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

  go(path: string) { this.router.navigateByUrl(path); }
}
