import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C, borderColorForStatus } from '../../shared/theme';
import { BadgeComponent, PageHeaderComponent, DashedButtonComponent } from '../../shared';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent, PageHeaderComponent, DashedButtonComponent],
  template: `
    <div class="container">
      <app-page-header title="Projects" [count]="filteredProjects.length"></app-page-header>

      <!-- Filters -->
      <div class="filter-bar">
        <div class="filter-group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <select class="filter-select" [(ngModel)]="filterCompany">
            <option value="">All Companies</option>
            <option *ngFor="let c of uniqueCompanies" [value]="c">{{ c }}</option>
          </select>
        </div>
        <div class="filter-group">
          <select class="filter-select" [(ngModel)]="filterStatus">
            <option value="">All Statuses</option>
            <option *ngFor="let s of uniqueStatuses" [value]="s">{{ s }}</option>
          </select>
        </div>
        <button *ngIf="isFiltered" class="filter-clear" (click)="filterCompany = ''; filterStatus = ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Clear
        </button>
      </div>

      <!-- Project cards -->
      <div *ngFor="let p of filteredProjects"
           class="project-card"
           [class.draft]="p.sc === 'gray'"
           [class.dead]="p.sc === 'red'"
           [style.border-left-color]="borderColorForStatus(p.sc)"
           (click)="onProjectClick(p)">
        <div class="proj-top">
          <span class="proj-name">{{ p.name }}</span>
          <app-badge [color]="p.sc">{{ p.status }}</app-badge>
        </div>
        <div class="proj-sub">
          <span>{{ p.compShort }}</span>
          <span class="proj-dot">&#183;</span>
          <span>{{ p.type }}</span>
          <span class="proj-dot">&#183;</span>
          <span>{{ p.loc }}</span>
        </div>
        <div class="proj-grid">
          <div class="proj-cell">
            <div class="cell-label">Total Cost</div>
            <div class="cell-value">{{ p.cost }}</div>
          </div>
          <div class="proj-cell">
            <div class="cell-label">Financing</div>
            <div class="cell-value">{{ p.fin }}</div>
          </div>
          <div class="proj-cell">
            <div class="cell-label">Product</div>
            <div class="cell-value">{{ p.prod }}</div>
          </div>
          <div class="proj-cell">
            <div class="cell-label">Submitted</div>
            <div class="cell-value">{{ p.submitted || '\u2014' }}</div>
          </div>
          <div class="proj-cell">
            <div class="cell-label">Accepted</div>
            <div class="cell-value">{{ p.accepted || '\u2014' }}</div>
          </div>
          <div class="proj-cell">
            <div class="cell-label">Signed</div>
            <div class="cell-value">{{ p.signed || '\u2014' }}</div>
          </div>
        </div>
        <div *ngIf="p.sc === 'gray'" class="proj-cta" (click)="$event.stopPropagation(); go(p.route)">
          <app-badge color="green">Continue setup &rarr;</app-badge>
        </div>
      </div>

      <app-dashed-btn label="Create a new project" [fullWidth]="true" (clicked)="go('/project/new')"></app-dashed-btn>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 28px 40px 60px;
    }

    /* Filter bar */
    .filter-bar {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 14px; flex-wrap: wrap;
    }
    .filter-group { display: flex; align-items: center; gap: 6px; position: relative; }
    .filter-select {
      appearance: none;
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 8px;
      padding: 6px 28px 6px 10px;
      font-size: 12px; font-weight: 600;
      color: ${C.g700}; font-family: inherit;
      cursor: pointer; outline: none;
      transition: border-color 0.15s;
      background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }
    .filter-select:hover { border-color: ${C.g300}; }
    .filter-select:focus { border-color: ${C.green}; }
    .filter-clear {
      display: inline-flex; align-items: center; gap: 4px;
      background: none; border: none;
      font-size: 11px; font-weight: 700;
      color: ${C.g400}; cursor: pointer;
      font-family: inherit; padding: 4px 6px;
      border-radius: 6px; transition: all 0.15s;
    }
    .filter-clear:hover { color: ${C.red500}; background: ${C.red50}; }

    /* Project cards */
    .project-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g300};
      border-radius: 16px;
      padding: 18px 20px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
    .project-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); }
    .project-card.draft {
      border-style: dashed; border-width: 2px; border-left-width: 3.5px; cursor: default;
    }
    .project-card.draft:hover { box-shadow: none; }
    .project-card.dead { opacity: 0.6; cursor: default; pointer-events: none; }
    .proj-top {
      display: flex; justify-content: space-between;
      align-items: flex-start; gap: 10px; margin-bottom: 4px;
    }
    .proj-name { font-size: 15px; font-weight: 700; color: ${C.g900}; line-height: 1.3; }
    .proj-sub {
      font-size: 12px; color: ${C.g500}; margin-bottom: 14px;
      display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
    }
    .proj-dot { font-size: 16px; font-weight: 900; color: ${C.g300}; }
    .proj-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .proj-cell { background: ${C.g50}; border-radius: 8px; padding: 8px 10px; }
    .cell-label {
      font-size: 10px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px;
    }
    .cell-value { font-size: 13px; font-weight: 700; color: ${C.g700}; }
    .proj-cta { margin-top: 12px; cursor: pointer; }

    app-dashed-btn { display: block; margin-top: 4px; }

    @media (max-width: 900px) {
      .container { padding: 20px 16px 40px; }
    }
  `]
})
export class ProjectsPageComponent {
  C = C;

  projects: any[] = [
    { name: "Khobar Mixed-Use Tower", type: "Mixed Use", loc: "Khobar", comp: "Al Omran Real Estate Dev Co.", compShort: "Al Omran Real Estate", status: "New", sc: "gray", cost: "20-50M", fin: "~25M", prod: "Development", route: "/onboarding/complete" },
    { name: "Al Noor Residential", type: "Mixed Use", loc: "Dammam", compShort: "Al Omran Real Estate", status: "Term-sheet Ready", sc: "green", cost: "20-50M", fin: "~21M", prod: "Development", route: "/application/1/status", submitted: "Feb 12, 2026" },
    { name: "Riyadh Commercial Plaza", type: "Commercial", loc: "Riyadh", compShort: "Al Omran Real Estate", status: "In Review", sc: "amber", cost: "50-100M", fin: "~45M", prod: "Construction", route: "/application/2/status", submitted: "Feb 28, 2026" },
    { name: "Tabuk Residential Complex", type: "Residential", loc: "Tabuk", compShort: "Al Omran Real Estate", status: "Feedback Requested", sc: "amber", cost: "5-20M", fin: "~8M", prod: "Development", route: "/application/3/status", submitted: "Mar 1, 2026" },
    { name: "Jeddah Waterfront Villas", type: "Residential", loc: "Jeddah", compShort: "Al Omran Real Estate", status: "Pending Signing", sc: "blue", cost: "20-50M", fin: "~18M", prod: "Development", route: "/application/4/accepted", submitted: "Jan 15, 2026", accepted: "Feb 5, 2026" },
    { name: "Abha Mountain Villas", type: "Residential", loc: "Abha", compShort: "Al Omran Real Estate", status: "Signed", sc: "green", cost: "5-20M", fin: "~10M", prod: "Land Acquisition", route: "/dashboard", submitted: "Dec 8, 2025", accepted: "Jan 2, 2026", signed: "Jan 20, 2026" },
    { name: "Al Rawdah Gardens", type: "Residential", loc: "Riyadh", compShort: "Al Omran Real Estate", status: "Completed", sc: "green", cost: "20-50M", fin: "~22M", prod: "Development", route: "/dashboard", submitted: "Aug 15, 2025", accepted: "Sep 3, 2025", signed: "Sep 28, 2025" },
    { name: "Eastern Industrial Park", type: "Industrial", loc: "Dammam", comp: "Al Jazeera Development Co.", compShort: "Al Jazeera Development", status: "Cancelled", sc: "red", cost: "50-100M", fin: "~60M", prod: "Bridge", route: "/dashboard", submitted: "Nov 20, 2025" },
    { name: "Madinah Commercial Hub", type: "Commercial", loc: "Madinah", compShort: "Al Jazeera Development", status: "Term-sheet Rejected", sc: "red", cost: "20-50M", fin: "~30M", prod: "Construction", route: "/dashboard", submitted: "Jan 10, 2026" },
  ];

  filterCompany = '';
  filterStatus = '';

  constructor(private router: Router) {}

  get uniqueCompanies(): string[] {
    return [...new Set(this.projects.map(p => p.compShort))];
  }

  get uniqueStatuses(): string[] {
    return [...new Set(this.projects.map(p => p.status))];
  }

  get isFiltered(): boolean {
    return this.filterCompany !== '' || this.filterStatus !== '';
  }

  get filteredProjects(): any[] {
    return this.projects.filter(p => {
      if (this.filterCompany && p.compShort !== this.filterCompany) return false;
      if (this.filterStatus && p.status !== this.filterStatus) return false;
      return true;
    });
  }

  borderColorForStatus = borderColorForStatus;

  go(path: string) { this.router.navigateByUrl(path); }

  onProjectClick(p: any) {
    if (p.sc === 'red') return;
    if (p.sc === 'gray') return;
    const idx = this.projects.indexOf(p);
    this.go('/dashboard/project/' + idx);
  }
}
