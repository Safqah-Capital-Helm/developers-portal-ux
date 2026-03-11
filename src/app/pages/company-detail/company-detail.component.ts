import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { BadgeComponent, BackLinkComponent } from '../../shared';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, BackLinkComponent],
  template: `
    <div class="container" *ngIf="company">
      <app-back-link to="/dashboard/companies" label="Back to Companies"></app-back-link>

      <!-- Header -->
      <div class="detail-header">
        <div class="header-left">
          <h1 class="detail-title">{{ company.name }}</h1>
          <app-badge [color]="company.sc">{{ company.status }}</app-badge>
        </div>
      </div>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-chip">
          <span class="stat-label">CR</span>
          <span class="stat-value">{{ company.cr }}</span>
        </div>
        <div class="stat-chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
          <span class="stat-value">{{ companyProjects.length }} projects</span>
        </div>
        <div class="stat-chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <span class="stat-value">{{ team.length }} members</span>
        </div>
      </div>

      <!-- Projects Section -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title" style="margin-bottom: 0;">Projects</h2>
          <a routerLink="/project/new" class="new-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </a>
        </div>

        <div *ngIf="companyProjects.length === 0" class="empty-state">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g300" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
          <span>No projects yet</span>
        </div>

        <div *ngFor="let p of companyProjects; let i = index"
             class="list-card"
             [style.border-left-color]="borderColor(p.sc)"
             [class.clickable]="p.sc !== 'red'"
             (click)="goToProject(p)">
          <div class="list-top">
            <span class="list-name">{{ p.name }}</span>
            <app-badge [color]="p.sc">{{ p.status }}</app-badge>
          </div>
          <div class="list-sub">{{ p.type }} &middot; {{ p.loc }}</div>
        </div>
      </div>

      <!-- Financing Applications Section -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title" style="margin-bottom: 0;">Financing Applications</h2>
          <a routerLink="/application/new" class="new-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Application
          </a>
        </div>

        <div *ngIf="companyApplications.length === 0" class="empty-state">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g300" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>No financing applications yet</span>
        </div>

        <div *ngFor="let app of companyApplications"
             class="app-card"
             [style.border-left-color]="borderColor(app.sc)"
             (click)="go(app.route)">
          <div class="app-top">
            <div>
              <span class="app-name">{{ app.product }}</span>
              <span class="app-project">{{ app.projectName }}</span>
            </div>
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

      <!-- Team Members Section -->
      <div class="section">
        <h2 class="section-title">Team Members</h2>

        <div *ngFor="let m of team" class="member-row">
          <div class="member-left">
            <div class="avatar" [style.background]="C.greenLt" [style.color]="C.green">{{ m.name.charAt(0) }}</div>
            <div>
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
      max-width: 800px;
      margin: 0 auto;
      padding: 28px 40px 60px;
    }

    .detail-header {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      margin-bottom: 10px;
    }
    .header-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .detail-title { font-size: 22px; font-weight: 900; color: ${C.g900}; margin: 0; }

    /* Stats */
    .stats-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
    .stat-chip {
      display: inline-flex; align-items: center; gap: 6px;
      background: ${C.g50}; border: 1px solid ${C.g200};
      border-radius: 8px; padding: 6px 12px;
    }
    .stat-label { font-size: 10px; font-weight: 700; color: ${C.g400}; text-transform: uppercase; letter-spacing: 0.3px; }
    .stat-value { font-size: 12px; font-weight: 700; color: ${C.g700}; }

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
    .new-link {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 700; color: ${C.green};
      text-decoration: none; cursor: pointer;
      padding: 4px 10px; border-radius: 8px;
      transition: background 0.15s;
    }
    .new-link:hover { background: ${C.greenLt}; }

    /* Empty state */
    .empty-state {
      display: flex; align-items: center; gap: 10px;
      padding: 16px; color: ${C.g400}; font-size: 13px; font-weight: 600;
    }

    /* List cards (projects) */
    .list-card {
      background: ${C.g50}; border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g300};
      border-radius: 12px; padding: 12px 16px;
      margin-bottom: 8px; transition: box-shadow 0.2s;
    }
    .list-card.clickable { cursor: pointer; }
    .list-card.clickable:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .list-top {
      display: flex; justify-content: space-between;
      align-items: center; gap: 8px; margin-bottom: 2px;
    }
    .list-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }
    .list-sub { font-size: 12px; color: ${C.g400}; }

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
    .app-name { font-size: 14px; font-weight: 700; color: ${C.g900}; display: block; }
    .app-project { font-size: 11px; color: ${C.g400}; display: block; margin-top: 1px; }
    .app-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .app-cell { background: #fff; border-radius: 8px; padding: 6px 10px; }
    .cell-label {
      font-size: 10px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 1px;
    }
    .cell-value { font-size: 13px; font-weight: 700; color: ${C.g700}; }

    /* Team members */
    .member-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 14px; background: ${C.g50}; border-radius: 10px;
      margin-bottom: 6px;
    }
    .member-left { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 34px; height: 34px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 800; flex-shrink: 0;
    }
    .member-name { font-size: 13px; font-weight: 700; color: ${C.g900}; }
    .member-email { font-size: 11px; color: ${C.g400}; }

    @media (max-width: 900px) {
      .container { padding: 20px 16px 40px; }
    }
  `]
})
export class CompanyDetailComponent implements OnInit {
  C = C;
  company: any = null;
  companyProjects: any[] = [];
  companyApplications: any[] = [];
  team: any[] = [];

  companies = [
    { name: "Al Omran Real Estate Dev Co.", cr: "1551515151516515", status: "Approved", sc: "green", proj: 8, mem: 3 },
    { name: "Al Jazeera Development Co.", cr: "1020304050607", status: "Under Review", sc: "amber", proj: 2, mem: 1 }
  ];

  allTeams: Record<number, any[]> = {
    0: [
      { name: "Ahmed Al-Salem", email: "ahmed@alomran.com", role: "Admin" },
      { name: "Mohammad Al-Salem", email: "mohammad@alomran.com", role: "Admin" },
      { name: "Fahad Al-Harbi", email: "fahad@alomran.com", role: "Viewer" },
      { name: "Sarah Ahmad", email: "sarah@alomran.com", role: "Editor" }
    ],
    1: [
      { name: "Omar Al-Rashid", email: "omar@aljazeera-dev.com", role: "Admin" }
    ]
  };

  projects: any[] = [
    { name: "Al Noor Residential", type: "Mixed Use", loc: "Dammam", comp: "Al Omran Real Estate Dev Co.", sc: "green", status: "Term-sheet Ready", idx: 1 },
    { name: "Riyadh Commercial Plaza", type: "Commercial", loc: "Riyadh", comp: "Al Omran Real Estate Dev Co.", sc: "amber", status: "In Review", idx: 2 },
    { name: "Tabuk Residential Complex", type: "Residential", loc: "Tabuk", comp: "Al Omran Real Estate Dev Co.", sc: "amber", status: "Feedback Requested", idx: 3 },
    { name: "Jeddah Waterfront Villas", type: "Residential", loc: "Jeddah", comp: "Al Omran Real Estate Dev Co.", sc: "blue", status: "Pending Signing", idx: 4 },
    { name: "Abha Mountain Villas", type: "Residential", loc: "Abha", comp: "Al Omran Real Estate Dev Co.", sc: "green", status: "Signed", idx: 5 },
    { name: "Al Rawdah Gardens", type: "Residential", loc: "Riyadh", comp: "Al Omran Real Estate Dev Co.", sc: "green", status: "Completed", idx: 6 },
    { name: "Khobar Mixed-Use Tower", type: "Mixed Use", loc: "Khobar", comp: "Al Omran Real Estate Dev Co.", sc: "gray", status: "New", idx: 0 },
    { name: "Eastern Industrial Park", type: "Industrial", loc: "Dammam", comp: "Al Jazeera Development Co.", sc: "red", status: "Cancelled", idx: 7 },
    { name: "Madinah Commercial Hub", type: "Commercial", loc: "Madinah", comp: "Al Jazeera Development Co.", sc: "red", status: "Term-sheet Rejected", idx: 8 },
  ];

  allApplications: any[] = [
    { product: "Development Finance", projectName: "Al Noor Residential", amount: "SAR 21,000,000", status: "Term-sheet Ready", sc: "green", submitted: "Feb 12, 2026", accepted: "—", route: "/application/1/term-sheet", comp: "Al Omran Real Estate Dev Co." },
    { product: "Construction Finance", projectName: "Riyadh Commercial Plaza", amount: "SAR 45,000,000", status: "In Review", sc: "amber", submitted: "Feb 28, 2026", accepted: "—", route: "/application/2/status", comp: "Al Omran Real Estate Dev Co." },
    { product: "Development Finance", projectName: "Tabuk Residential Complex", amount: "SAR 8,000,000", status: "Feedback Requested", sc: "amber", submitted: "Mar 1, 2026", accepted: "—", route: "/application/3/status", comp: "Al Omran Real Estate Dev Co." },
    { product: "Development Finance", projectName: "Jeddah Waterfront Villas", amount: "SAR 18,000,000", status: "Pending Signing", sc: "blue", submitted: "Jan 15, 2026", accepted: "Feb 5, 2026", route: "/application/4/accepted", comp: "Al Omran Real Estate Dev Co." },
    { product: "Land Acquisition Finance", projectName: "Abha Mountain Villas", amount: "SAR 10,000,000", status: "Signed", sc: "green", submitted: "Dec 8, 2025", accepted: "Jan 2, 2026", route: "/dashboard", comp: "Al Omran Real Estate Dev Co." },
    { product: "Development Finance", projectName: "Al Rawdah Gardens", amount: "SAR 22,000,000", status: "Completed", sc: "green", submitted: "Aug 15, 2025", accepted: "Sep 3, 2025", route: "/dashboard", comp: "Al Omran Real Estate Dev Co." },
    { product: "Bridge Finance", projectName: "Eastern Industrial Park", amount: "SAR 60,000,000", status: "Cancelled", sc: "red", submitted: "Nov 20, 2025", accepted: "—", route: "/dashboard", comp: "Al Jazeera Development Co." },
    { product: "Construction Finance", projectName: "Madinah Commercial Hub", amount: "SAR 30,000,000", status: "Term-sheet Rejected", sc: "red", submitted: "Jan 10, 2026", accepted: "—", route: "/dashboard", comp: "Al Jazeera Development Co." },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id >= 0 && id < this.companies.length) {
        this.company = this.companies[id];
        this.companyProjects = this.projects.filter(p => p.comp === this.company.name);
        this.companyApplications = this.allApplications.filter(a => a.comp === this.company.name);
        this.team = this.allTeams[id] || [];
      }
    });
  }

  borderColor(sc: string): string {
    const map: Record<string, string> = {
      green: C.green, amber: C.amber500, blue: C.blue500, red: C.red500, gray: C.g300
    };
    return map[sc] || C.g300;
  }

  roleBadgeColor(role: string): 'green' | 'amber' | 'gray' | 'blue' | 'red' {
    const map: Record<string, 'green' | 'amber' | 'gray' | 'blue' | 'red'> = {
      Admin: 'blue', Editor: 'green', Contributor: 'amber', Viewer: 'gray'
    };
    return map[role] || 'gray';
  }

  goToProject(p: any) {
    if (p.sc === 'red') return;
    this.router.navigateByUrl('/dashboard/project/' + p.idx);
  }

  go(path: string) { this.router.navigateByUrl(path); }
}
