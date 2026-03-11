import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { C } from '../../shared/theme';
import { BadgeComponent, BackLinkComponent, CardComponent } from '../../shared';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, BackLinkComponent, CardComponent],
  template: `
    <div class="container" *ngIf="project">
      <app-back-link to="/dashboard/projects" label="Back to Projects"></app-back-link>

      <!-- Header -->
      <div class="detail-header">
        <div class="header-left">
          <h1 class="detail-title">{{ project.name }}</h1>
          <app-badge [color]="project.sc">{{ project.status }}</app-badge>
        </div>
      </div>

      <div class="detail-sub">
        <span>{{ project.type }}</span>
        <span class="dot">&#183;</span>
        <span>{{ project.loc }}</span>
      </div>

      <!-- Company Link -->
      <a [routerLink]="'/dashboard/company/' + project.companyIdx" class="company-link-card">
        <div class="company-link-left">
          <div class="company-icon" [style.background]="C.blue50">
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

      <!-- Project Details -->
      <div class="section">
        <h2 class="section-title">Project Details</h2>
        <div class="review-grid">
          <div class="review-item">
            <div class="review-label">Project Name</div>
            <div class="review-value">{{ project.name }}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Project Type</div>
            <div class="review-value">{{ project.type }}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Stage</div>
            <div class="review-value">{{ project.stage }}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Location</div>
            <div class="review-value">{{ project.loc }}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Expected Units</div>
            <div class="review-value">{{ project.expectedUnits }}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Building Area</div>
            <div class="review-value">{{ project.buildingArea }}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Selling Area</div>
            <div class="review-value">{{ project.sellingArea }}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Project Period</div>
            <div class="review-value">{{ project.period }}</div>
          </div>
        </div>
      </div>

      <!-- Project Financials -->
      <div class="section">
        <h2 class="section-title">Project Financials</h2>
        <div class="review-grid">
          <div class="review-item">
            <div class="review-label">Estimated Total Cost</div>
            <div class="review-value">{{ project.cost }}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Land Cost</div>
            <div class="review-value">{{ project.landCost }}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Development Cost</div>
            <div class="review-value">{{ project.devCost }}</div>
          </div>
          <div class="review-item">
            <div class="review-label">Expected Revenue</div>
            <div class="review-value">{{ project.expectedRevenue }}</div>
          </div>
        </div>
      </div>

      <!-- Financing Applications -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title" style="margin-bottom: 0;">Financing Applications</h2>
          <a routerLink="/application/new" class="new-app-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Application
          </a>
        </div>

        <div *ngIf="applications.length === 0" class="empty-state">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g300" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>No financing applications yet</span>
        </div>

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

    .detail-header {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      margin-bottom: 6px;
    }
    .header-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .detail-title { font-size: 22px; font-weight: 900; color: ${C.g900}; margin: 0; }
    .detail-sub {
      font-size: 13px; color: ${C.g500}; margin-bottom: 20px;
      display: flex; align-items: center; gap: 4px;
    }
    .dot { font-size: 18px; font-weight: 900; color: ${C.g300}; }

    /* Company link card */
    .company-link-card {
      display: flex; align-items: center; justify-content: space-between;
      background: ${C.g50}; border: 1px solid ${C.g200}; border-radius: 12px;
      padding: 12px 16px; margin-bottom: 24px; cursor: pointer;
      text-decoration: none; transition: border-color 0.15s, box-shadow 0.15s;
    }
    .company-link-card:hover { border-color: ${C.blue500}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .company-link-left { display: flex; align-items: center; gap: 12px; }
    .company-icon {
      width: 34px; height: 34px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .company-link-label { font-size: 10px; font-weight: 700; color: ${C.g400}; text-transform: uppercase; letter-spacing: 0.3px; }
    .company-link-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }

    /* Section */
    .section {
      background: #fff; border: 1px solid ${C.g200}; border-radius: 16px;
      padding: 20px 24px; margin-bottom: 16px;
    }
    .section-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 14px;
    }
    .section-title {
      font-size: 14px; font-weight: 800; color: ${C.g700};
      margin: 0 0 14px 0;
    }
    .new-app-link {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 700; color: ${C.green};
      text-decoration: none; cursor: pointer;
      padding: 4px 10px; border-radius: 8px;
      transition: background 0.15s;
    }
    .new-app-link:hover { background: ${C.greenLt}; }

    /* Review grid */
    .review-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 0; border-top: 1px solid ${C.g100};
    }
    .review-item {
      padding: 12px 0; border-bottom: 1px solid ${C.g100};
      padding-right: 16px;
    }
    .review-item:nth-child(even) { padding-left: 16px; padding-right: 0; }
    .review-label { font-size: 11px; font-weight: 600; color: ${C.g400}; margin-bottom: 2px; }
    .review-value { font-size: 14px; font-weight: 700; color: ${C.g800}; }

    /* Empty state */
    .empty-state {
      display: flex; align-items: center; gap: 10px;
      padding: 20px; color: ${C.g400}; font-size: 13px; font-weight: 600;
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
      .review-grid { grid-template-columns: 1fr; }
      .review-item:nth-child(even) { padding-left: 0; }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  C = C;
  project: any = null;
  applications: any[] = [];

  // Enriched project data with details
  allProjects: any[] = [
    {
      name: "Khobar Mixed-Use Tower", type: "Mixed Use", loc: "Khobar",
      compShort: "Al Omran Real Estate", companyIdx: 0,
      status: "New", sc: "gray", stage: "Pre-Development",
      expectedUnits: "120", buildingArea: "15,000 sqm", sellingArea: "12,000 sqm",
      period: "36 months", cost: "SAR 35,000,000",
      landCost: "SAR 14,000,000", devCost: "SAR 21,000,000", expectedRevenue: "SAR 52,000,000"
    },
    {
      name: "Al Noor Residential", type: "Mixed Use", loc: "Dammam",
      compShort: "Al Omran Real Estate", companyIdx: 0,
      status: "Term-sheet Ready", sc: "green", stage: "Development",
      expectedUnits: "80", buildingArea: "10,500 sqm", sellingArea: "8,200 sqm",
      period: "24 months", cost: "SAR 28,000,000",
      landCost: "SAR 11,200,000", devCost: "SAR 16,800,000", expectedRevenue: "SAR 42,000,000"
    },
    {
      name: "Riyadh Commercial Plaza", type: "Commercial", loc: "Riyadh",
      compShort: "Al Omran Real Estate", companyIdx: 0,
      status: "In Review", sc: "amber", stage: "Construction",
      expectedUnits: "45", buildingArea: "22,000 sqm", sellingArea: "18,500 sqm",
      period: "30 months", cost: "SAR 65,000,000",
      landCost: "SAR 26,000,000", devCost: "SAR 39,000,000", expectedRevenue: "SAR 95,000,000"
    },
    {
      name: "Tabuk Residential Complex", type: "Residential", loc: "Tabuk",
      compShort: "Al Omran Real Estate", companyIdx: 0,
      status: "Feedback Requested", sc: "amber", stage: "Development",
      expectedUnits: "35", buildingArea: "5,800 sqm", sellingArea: "4,500 sqm",
      period: "18 months", cost: "SAR 12,000,000",
      landCost: "SAR 4,800,000", devCost: "SAR 7,200,000", expectedRevenue: "SAR 18,000,000"
    },
    {
      name: "Jeddah Waterfront Villas", type: "Residential", loc: "Jeddah",
      compShort: "Al Omran Real Estate", companyIdx: 0,
      status: "Pending Signing", sc: "blue", stage: "Development",
      expectedUnits: "24", buildingArea: "8,400 sqm", sellingArea: "7,200 sqm",
      period: "24 months", cost: "SAR 32,000,000",
      landCost: "SAR 12,800,000", devCost: "SAR 19,200,000", expectedRevenue: "SAR 48,000,000"
    },
    {
      name: "Abha Mountain Villas", type: "Residential", loc: "Abha",
      compShort: "Al Omran Real Estate", companyIdx: 0,
      status: "Signed", sc: "green", stage: "Land Acquisition",
      expectedUnits: "16", buildingArea: "4,200 sqm", sellingArea: "3,600 sqm",
      period: "20 months", cost: "SAR 14,000,000",
      landCost: "SAR 5,600,000", devCost: "SAR 8,400,000", expectedRevenue: "SAR 22,000,000"
    },
    {
      name: "Al Rawdah Gardens", type: "Residential", loc: "Riyadh",
      compShort: "Al Omran Real Estate", companyIdx: 0,
      status: "Completed", sc: "green", stage: "Development",
      expectedUnits: "60", buildingArea: "9,600 sqm", sellingArea: "8,000 sqm",
      period: "24 months", cost: "SAR 30,000,000",
      landCost: "SAR 12,000,000", devCost: "SAR 18,000,000", expectedRevenue: "SAR 45,000,000"
    },
    {
      name: "Eastern Industrial Park", type: "Industrial", loc: "Dammam",
      compShort: "Al Jazeera Development", companyIdx: 1,
      status: "Cancelled", sc: "red", stage: "Bridge",
      expectedUnits: "—", buildingArea: "30,000 sqm", sellingArea: "28,000 sqm",
      period: "36 months", cost: "SAR 75,000,000",
      landCost: "SAR 30,000,000", devCost: "SAR 45,000,000", expectedRevenue: "SAR 110,000,000"
    },
    {
      name: "Madinah Commercial Hub", type: "Commercial", loc: "Madinah",
      compShort: "Al Jazeera Development", companyIdx: 1,
      status: "Term-sheet Rejected", sc: "red", stage: "Construction",
      expectedUnits: "30", buildingArea: "12,000 sqm", sellingArea: "10,000 sqm",
      period: "28 months", cost: "SAR 40,000,000",
      landCost: "SAR 16,000,000", devCost: "SAR 24,000,000", expectedRevenue: "SAR 58,000,000"
    },
  ];

  // Mock financing applications per project
  allApplications: Record<number, any[]> = {
    1: [
      { product: "Development Finance", amount: "SAR 21,000,000", status: "Term-sheet Ready", sc: "green", submitted: "Feb 12, 2026", accepted: "—", route: "/application/1/term-sheet" },
    ],
    2: [
      { product: "Construction Finance", amount: "SAR 45,000,000", status: "In Review", sc: "amber", submitted: "Feb 28, 2026", accepted: "—", route: "/application/2/status" },
    ],
    3: [
      { product: "Development Finance", amount: "SAR 8,000,000", status: "Feedback Requested", sc: "amber", submitted: "Mar 1, 2026", accepted: "—", route: "/application/3/status" },
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
      { product: "Bridge Finance", amount: "SAR 60,000,000", status: "Cancelled", sc: "red", submitted: "Nov 20, 2025", accepted: "—", route: "/dashboard" },
    ],
    8: [
      { product: "Construction Finance", amount: "SAR 30,000,000", status: "Term-sheet Rejected", sc: "red", submitted: "Jan 10, 2026", accepted: "—", route: "/dashboard" },
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

  borderColor(sc: string): string {
    const map: Record<string, string> = {
      green: C.green, amber: C.amber500, blue: C.blue500, red: C.red500, gray: C.g300
    };
    return map[sc] || C.g300;
  }

  go(path: string) { this.router.navigateByUrl(path); }
}
