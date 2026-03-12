import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { C, borderColorForStatus } from '../../shared/theme';
import { BadgeComponent, BackLinkComponent, EmptyStateComponent, ButtonComponent, getCompanyLogoByName } from '../../shared';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, BackLinkComponent, EmptyStateComponent, ButtonComponent],
  template: `
    <div class="container" *ngIf="project">
      <app-back-link to="/dashboard/projects" label="Back to Projects"></app-back-link>

      <!-- Project image -->
      <div class="hero-img" [style.backgroundImage]="'url(' + project.img + ')'"></div>

      <!-- Header row with actions -->
      <div class="detail-header-row">
        <h1 class="detail-title">{{ project.name }}</h1>
        <div class="detail-actions">
          <app-btn variant="secondary" size="sm" (clicked)="editProject()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </app-btn>
          <app-btn variant="dangerOutline" size="sm" (clicked)="showDeleteConfirm = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            Delete
          </app-btn>
        </div>
      </div>

      <!-- Delete confirmation -->
      <div *ngIf="showDeleteConfirm" class="delete-confirm">
        <div class="delete-confirm-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.red500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <div>
          <div class="delete-confirm-title">Delete this project?</div>
          <div class="delete-confirm-sub">This action cannot be undone. All project data and financing applications will be permanently removed.</div>
        </div>
        <div class="delete-confirm-actions">
          <app-btn variant="danger" size="sm" (clicked)="go('/dashboard/projects')">Yes, Delete</app-btn>
          <app-btn variant="secondary" size="sm" (clicked)="showDeleteConfirm = false">Cancel</app-btn>
        </div>
      </div>

      <div class="detail-chips">
        <span class="chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          {{ project.type }}
        </span>
        <span class="chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ project.loc }}
        </span>
        <span class="chip stage">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ project.stage }}
        </span>
      </div>

      <!-- Company Link -->
      <a [routerLink]="'/dashboard/company/' + project.companyIdx" class="company-link-card">
        <div class="company-link-left">
          <img *ngIf="project.compLogo" [src]="project.compLogo" class="company-logo-img" />
          <div *ngIf="!project.compLogo" class="company-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
            </svg>
          </div>
          <div>
            <div class="company-link-label">Company</div>
            <div class="company-link-name">{{ project.compShort }}</div>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </a>

      <!-- Project Overview -->
      <div class="section">
        <h2 class="section-title">Project Overview</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon" [style.background]="C.blue50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                <line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/>
                <line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/>
                <path d="M9 18h6"/>
              </svg>
            </div>
            <div class="metric-label">Expected Units</div>
            <div class="metric-value">{{ project.expectedUnits }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-icon" [style.background]="C.purpleLt">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.purple" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <div class="metric-label">Building Area</div>
            <div class="metric-value">{{ project.buildingArea }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-icon" [style.background]="C.greenLt">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z"/>
              </svg>
            </div>
            <div class="metric-label">Selling Area</div>
            <div class="metric-value">{{ project.sellingArea }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-icon" [style.background]="C.amber50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="metric-label">Project Period</div>
            <div class="metric-value">{{ project.period }}</div>
          </div>
        </div>
      </div>

      <!-- Project Financials -->
      <div class="section">
        <h2 class="section-title">Project Financials</h2>

        <!-- Total Cost hero -->
        <div class="cost-hero">
          <div class="cost-hero-label">Estimated Total Cost</div>
          <div class="cost-hero-value">{{ project.cost }}</div>
        </div>

        <!-- Cost Breakdown -->
        <div class="breakdown">
          <div class="breakdown-header">
            <span class="breakdown-tag" [style.color]="C.amber600">
              <span class="tag-dot" [style.background]="C.amber500"></span>
              Land {{ landPct }}%
            </span>
            <span class="breakdown-tag" [style.color]="C.blue500">
              <span class="tag-dot" [style.background]="C.blue500"></span>
              Development {{ devPct }}%
            </span>
          </div>
          <div class="breakdown-bar">
            <div class="bar-land" [style.width.%]="landPct"></div>
            <div class="bar-dev" [style.width.%]="devPct"></div>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-box" [style.borderColor]="C.amber100" [style.background]="C.amber50">
            <div class="stat-label" [style.color]="C.amber600">Land Cost</div>
            <div class="stat-val">{{ project.landCost }}</div>
            <div class="stat-sub" [style.color]="C.amber500">{{ landPct }}% of total</div>
          </div>
          <div class="stat-box" [style.borderColor]="C.blue100" [style.background]="C.blue50">
            <div class="stat-label" [style.color]="C.blue500">Development Cost</div>
            <div class="stat-val">{{ project.devCost }}</div>
            <div class="stat-sub" [style.color]="C.blue500">{{ devPct }}% of total</div>
          </div>
        </div>

        <div class="stat-box revenue" [style.borderColor]="C.greenMd" [style.background]="C.greenLt">
          <div class="revenue-row">
            <div>
              <div class="stat-label" [style.color]="C.green">Expected Revenue</div>
              <div class="stat-val">{{ project.expectedRevenue }}</div>
            </div>
            <div *ngIf="profitMargin > 0" class="margin-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              {{ profitMargin }}% margin
            </div>
          </div>
        </div>
      </div>

      <!-- Financing Applications -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title" style="margin-bottom: 0;">Financing Applications</h2>
          <a (click)="newApplication()" class="new-app-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Application
          </a>
        </div>

        <app-empty-state *ngIf="applications.length === 0" message="No financing applications yet"></app-empty-state>

        <div *ngFor="let app of applications"
             class="app-card"
             [style.border-left-color]="borderColor(app.sc)"
             (click)="go(app.route)">
          <div class="app-top">
            <span class="app-name">{{ app.product }}</span>
            <app-badge [color]="app.sc">{{ app.status }}</app-badge>
          </div>
          <div class="app-grid">
            <div class="app-cell">
              <div class="cell-label">Amount</div>
              <div class="cell-value">{{ app.amount }}</div>
            </div>
            <div class="app-cell">
              <div class="cell-label">Submitted</div>
              <div class="cell-value">{{ app.submitted || '\u2014' }}</div>
            </div>
            <div class="app-cell">
              <div class="cell-label">Accepted</div>
              <div class="cell-value">{{ app.accepted || '\u2014' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 28px 40px 60px;
    }

    /* Hero image */
    .hero-img {
      width: 100%; height: 220px;
      background-size: cover; background-position: center;
      background-color: ${C.g100};
      border-radius: 16px; margin-bottom: 20px;
    }

    /* Header row */
    .detail-header-row {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 16px; margin-bottom: 10px;
    }
    .detail-actions {
      display: flex; align-items: center; gap: 8px; flex-shrink: 0;
    }

    .detail-title {
      font-size: 24px; font-weight: 900; color: ${C.g900}; margin: 0;
    }

    /* Delete confirmation */
    .delete-confirm {
      display: flex; align-items: flex-start; gap: 12px;
      background: ${C.red50}; border: 1.5px solid ${C.red500};
      border-radius: 14px; padding: 16px 18px; margin-bottom: 16px;
    }
    .delete-confirm-icon { flex-shrink: 0; margin-top: 2px; }
    .delete-confirm-title {
      font-size: 14px; font-weight: 800; color: ${C.g900}; margin-bottom: 4px;
    }
    .delete-confirm-sub {
      font-size: 12px; color: ${C.g600}; line-height: 1.5; margin-bottom: 12px;
    }
    .delete-confirm-actions { display: flex; gap: 8px; flex-shrink: 0; align-self: center; }

    /* Chips */
    .detail-chips {
      display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;
    }
    .chip {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 600; color: ${C.g600};
      background: ${C.g50}; border: 1px solid ${C.g200};
      border-radius: 20px; padding: 5px 12px;
    }
    .chip.stage {
      background: ${C.greenLt}; border-color: ${C.greenMd};
      color: ${C.green}; font-weight: 700;
    }

    /* Company link card */
    .company-link-card {
      display: flex; align-items: center; justify-content: space-between;
      background: ${C.g50}; border: 1px solid ${C.g200}; border-radius: 12px;
      padding: 12px 16px; margin-bottom: 20px; cursor: pointer;
      text-decoration: none; transition: border-color 0.15s, box-shadow 0.15s;
    }
    .company-link-card:hover { border-color: ${C.blue500}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .company-link-left { display: flex; align-items: center; gap: 12px; }
    .company-logo-img {
      width: 34px; height: 34px; border-radius: 10px;
      object-fit: cover; flex-shrink: 0;
    }
    .company-icon {
      width: 34px; height: 34px; border-radius: 10px; background: ${C.blue50};
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .company-link-label { font-size: 10px; font-weight: 700; color: ${C.g400}; text-transform: uppercase; letter-spacing: 0.3px; }
    .company-link-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }

    /* Section */
    .section {
      background: #fff; border: 1px solid ${C.g200}; border-radius: 16px;
      padding: 22px 24px; margin-bottom: 16px;
    }
    .section-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 14px;
    }
    .section-title {
      font-size: 15px; font-weight: 800; color: ${C.g800};
      margin: 0 0 16px 0;
    }
    .new-app-link {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 700; color: ${C.green};
      text-decoration: none; cursor: pointer;
      padding: 4px 10px; border-radius: 8px;
      transition: background 0.15s;
    }
    .new-app-link:hover { background: ${C.greenLt}; }

    /* Metrics grid */
    .metrics-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    }
    .metric-card {
      background: ${C.g50}; border: 1px solid ${C.g100};
      border-radius: 12px; padding: 16px 18px;
    }
    .metric-icon {
      width: 34px; height: 34px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px;
    }
    .metric-label {
      font-size: 11px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px;
      margin-bottom: 4px;
    }
    .metric-value {
      font-size: 18px; font-weight: 900; color: ${C.g900};
    }

    /* Financial hero */
    .cost-hero {
      background: ${C.g50}; border: 1px solid ${C.g100};
      border-radius: 14px; padding: 20px 22px;
      margin-bottom: 16px;
    }
    .cost-hero-label {
      font-size: 11px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px;
      margin-bottom: 6px;
    }
    .cost-hero-value {
      font-size: 26px; font-weight: 900; color: ${C.g900};
      letter-spacing: -0.5px;
    }

    /* Breakdown bar */
    .breakdown { margin-bottom: 16px; }
    .breakdown-header {
      display: flex; justify-content: space-between;
      margin-bottom: 8px;
    }
    .breakdown-tag {
      font-size: 12px; font-weight: 700;
      display: inline-flex; align-items: center; gap: 5px;
    }
    .tag-dot {
      width: 8px; height: 8px; border-radius: 50%; display: inline-block;
    }
    .breakdown-bar {
      display: flex; height: 10px; border-radius: 5px;
      overflow: hidden; background: ${C.g100};
    }
    .bar-land { background: ${C.amber500}; border-radius: 5px 0 0 5px; }
    .bar-dev { background: ${C.blue500}; border-radius: 0 5px 5px 0; }

    /* Stat boxes */
    .stat-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
      margin-bottom: 12px;
    }
    .stat-box {
      border: 1.5px solid ${C.g200}; border-radius: 14px;
      padding: 16px 18px;
    }
    .stat-label {
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.3px;
      margin-bottom: 6px;
    }
    .stat-val {
      font-size: 17px; font-weight: 900; color: ${C.g900};
      line-height: 1.2;
    }
    .stat-sub {
      font-size: 11px; font-weight: 600;
      margin-top: 4px;
    }

    /* Revenue box */
    .stat-box.revenue { margin-bottom: 0; }
    .revenue-row {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
    }
    .margin-badge {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 700; color: ${C.green};
      background: rgba(0,175,61,0.08); border-radius: 20px;
      padding: 5px 12px; white-space: nowrap;
    }

    /* Application cards */
    .app-card {
      background: ${C.g50}; border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g300};
      border-radius: 12px; padding: 14px 16px;
      margin-bottom: 8px; cursor: pointer;
      transition: box-shadow 0.2s;
    }
    .app-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .app-top {
      display: flex; justify-content: space-between;
      align-items: center; gap: 8px; margin-bottom: 10px;
    }
    .app-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }
    .app-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .app-cell { background: #fff; border-radius: 8px; padding: 6px 10px; }
    .cell-label {
      font-size: 10px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 1px;
    }
    .cell-value { font-size: 13px; font-weight: 700; color: ${C.g700}; }

    @media (max-width: 900px) {
      .container { padding: 20px 16px 40px; }
      .metrics-grid { grid-template-columns: 1fr; }
      .stat-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  C = C;
  project: any = null;
  applications: any[] = [];
  showDeleteConfirm = false;

  // Enriched project data with details
  allProjects: any[] = [
    {
      name: "Khobar Mixed-Use Tower", type: "Mixed Use", loc: "Khobar",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"), companyIdx: 0,
      stage: "Pre-Development",
      expectedUnits: "120", buildingArea: "15,000 sqm", sellingArea: "12,000 sqm",
      period: "36 months", cost: "SAR 35,000,000",
      landCost: "SAR 14,000,000", devCost: "SAR 21,000,000", expectedRevenue: "SAR 52,000,000",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=440&fit=crop"
    },
    {
      name: "Al Noor Residential", type: "Mixed Use", loc: "Dammam",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"), companyIdx: 0,
      stage: "Development",
      expectedUnits: "80", buildingArea: "10,500 sqm", sellingArea: "8,200 sqm",
      period: "24 months", cost: "SAR 28,000,000",
      landCost: "SAR 11,200,000", devCost: "SAR 16,800,000", expectedRevenue: "SAR 42,000,000",
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=440&fit=crop"
    },
    {
      name: "Riyadh Commercial Plaza", type: "Commercial", loc: "Riyadh",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"), companyIdx: 0,
      stage: "Construction",
      expectedUnits: "45", buildingArea: "22,000 sqm", sellingArea: "18,500 sqm",
      period: "30 months", cost: "SAR 65,000,000",
      landCost: "SAR 26,000,000", devCost: "SAR 39,000,000", expectedRevenue: "SAR 95,000,000",
      img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=440&fit=crop"
    },
    {
      name: "Tabuk Residential Complex", type: "Residential", loc: "Tabuk",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"), companyIdx: 0,
      stage: "Development",
      expectedUnits: "35", buildingArea: "5,800 sqm", sellingArea: "4,500 sqm",
      period: "18 months", cost: "SAR 12,000,000",
      landCost: "SAR 4,800,000", devCost: "SAR 7,200,000", expectedRevenue: "SAR 18,000,000",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=440&fit=crop"
    },
    {
      name: "Jeddah Waterfront Villas", type: "Residential", loc: "Jeddah",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"), companyIdx: 0,
      stage: "Development",
      expectedUnits: "24", buildingArea: "8,400 sqm", sellingArea: "7,200 sqm",
      period: "24 months", cost: "SAR 32,000,000",
      landCost: "SAR 12,800,000", devCost: "SAR 19,200,000", expectedRevenue: "SAR 48,000,000",
      img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=440&fit=crop"
    },
    {
      name: "Abha Mountain Villas", type: "Residential", loc: "Abha",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"), companyIdx: 0,
      stage: "Land Acquisition",
      expectedUnits: "16", buildingArea: "4,200 sqm", sellingArea: "3,600 sqm",
      period: "20 months", cost: "SAR 14,000,000",
      landCost: "SAR 5,600,000", devCost: "SAR 8,400,000", expectedRevenue: "SAR 22,000,000",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=440&fit=crop"
    },
    {
      name: "Al Rawdah Gardens", type: "Residential", loc: "Riyadh",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"), companyIdx: 0,
      stage: "Development",
      expectedUnits: "60", buildingArea: "9,600 sqm", sellingArea: "8,000 sqm",
      period: "24 months", cost: "SAR 30,000,000",
      landCost: "SAR 12,000,000", devCost: "SAR 18,000,000", expectedRevenue: "SAR 45,000,000",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=440&fit=crop"
    },
    {
      name: "Eastern Industrial Park", type: "Industrial", loc: "Dammam",
      compShort: "Al Jazeera Development", compLogo: getCompanyLogoByName("Al Jazeera Development"), companyIdx: 1,
      stage: "Bridge",
      expectedUnits: "\u2014", buildingArea: "30,000 sqm", sellingArea: "28,000 sqm",
      period: "36 months", cost: "SAR 75,000,000",
      landCost: "SAR 30,000,000", devCost: "SAR 45,000,000", expectedRevenue: "SAR 110,000,000",
      img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=440&fit=crop"
    },
    {
      name: "Madinah Commercial Hub", type: "Commercial", loc: "Madinah",
      compShort: "Al Jazeera Development", compLogo: getCompanyLogoByName("Al Jazeera Development"), companyIdx: 1,
      stage: "Construction",
      expectedUnits: "30", buildingArea: "12,000 sqm", sellingArea: "10,000 sqm",
      period: "28 months", cost: "SAR 40,000,000",
      landCost: "SAR 16,000,000", devCost: "SAR 24,000,000", expectedRevenue: "SAR 58,000,000",
      img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=440&fit=crop"
    },
  ];

  // Mock financing applications per project
  allApplications: Record<number, any[]> = {
    1: [
      { product: "Development Finance", amount: "SAR 21,000,000", status: "Term-sheet Ready", sc: "green", submitted: "Feb 12, 2026", accepted: "\u2014", route: "/application/1/term-sheet" },
    ],
    2: [
      { product: "Construction Finance", amount: "SAR 45,000,000", status: "In Review", sc: "amber", submitted: "Feb 28, 2026", accepted: "\u2014", route: "/application/2/status" },
    ],
    3: [
      { product: "Development Finance", amount: "SAR 8,000,000", status: "Feedback Requested", sc: "amber", submitted: "Mar 1, 2026", accepted: "\u2014", route: "/application/3/status" },
    ],
    4: [
      { product: "Development Finance", amount: "SAR 18,000,000", status: "Pending Signing", sc: "blue", submitted: "Jan 15, 2026", accepted: "Feb 5, 2026", route: "/application/4/accepted" },
    ],
    5: [
      { product: "Land Acquisition Finance", amount: "SAR 10,000,000", status: "Signed", sc: "green", submitted: "Dec 8, 2025", accepted: "Jan 2, 2026", route: "/dashboard" },
    ],
    6: [
      { product: "Development Finance", amount: "SAR 22,000,000", status: "Completed", sc: "green", submitted: "Aug 15, 2025", accepted: "Sep 3, 2025", route: "/dashboard" },
    ],
    7: [
      { product: "Bridge Finance", amount: "SAR 60,000,000", status: "Cancelled", sc: "red", submitted: "Nov 20, 2025", accepted: "\u2014", route: "/dashboard" },
    ],
    8: [
      { product: "Construction Finance", amount: "SAR 30,000,000", status: "Term-sheet Rejected", sc: "red", submitted: "Jan 10, 2026", accepted: "\u2014", route: "/dashboard" },
    ],
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id >= 0 && id < this.allProjects.length) {
        this.project = this.allProjects[id];
        this.applications = this.allApplications[id] || [];
      }
    });
  }

  borderColor = borderColorForStatus;

  // Financial helpers
  private parseAmount(s: string): number {
    return parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;
  }

  get landPct(): number {
    if (!this.project) return 0;
    const total = this.parseAmount(this.project.cost);
    const land = this.parseAmount(this.project.landCost);
    return total > 0 ? Math.round((land / total) * 100) : 0;
  }

  get devPct(): number {
    return 100 - this.landPct;
  }

  get profitMargin(): number {
    if (!this.project) return 0;
    const cost = this.parseAmount(this.project.cost);
    const revenue = this.parseAmount(this.project.expectedRevenue);
    if (cost <= 0 || revenue <= 0) return 0;
    return Math.round(((revenue - cost) / cost) * 100);
  }

  newApplication(): void {
    this.router.navigate(['/application/new'], { queryParams: { project: this.project?.name } });
  }

  editProject(): void {
    if (!this.project) return;
    // Pre-fill the add-project form draft with current project data, starting at step 0 (company)
    const draft = {
      step: 0,
      sel: this.project.compShort,
      name: this.project.name,
      type: this.project.type,
      stage: this.project.stage,
      expectedUnits: this.project.expectedUnits,
      totalBuildingArea: this.project.buildingArea?.replace(/[^0-9]/g, '') || '',
      totalSellingArea: this.project.sellingArea?.replace(/[^0-9]/g, '') || '',
      projectPeriod: this.project.period?.replace(/[^0-9]/g, '') || '',
      totalCost: this.project.cost?.replace(/[^0-9]/g, '') || '',
      landCostPct: this.landPct,
      expectedRevenue: this.project.expectedRevenue?.replace(/[^0-9]/g, '') || '',
    };
    localStorage.setItem('safqah_project_draft', JSON.stringify(draft));
    this.router.navigateByUrl('/project/new');
  }

  go(path: string) { this.router.navigateByUrl(path); }
}
