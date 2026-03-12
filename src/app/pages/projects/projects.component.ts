import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import { PageHeaderComponent, ButtonComponent, getCompanyLogoByName } from '../../shared';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, ButtonComponent],
  template: `
    <div class="container">
      <app-page-header title="Projects" [count]="filteredProjects.length">
        <app-btn variant="primary" size="sm" (clicked)="go('/project/new?fresh=1')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Project
        </app-btn>
      </app-page-header>

      <!-- Filters -->
      <div class="filter-bar">
        <div class="filter-group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <select class="filter-select" [(ngModel)]="filterCompany">
            <option value="">All Companies</option>
            <option *ngFor="let c of uniqueCompanies" [value]="c">{{ c }}</option>
          </select>
        </div>
        <button *ngIf="filterCompany" class="filter-clear" (click)="filterCompany = ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Clear
        </button>
      </div>

      <!-- Project grid -->
      <div class="projects-grid">
        <div *ngFor="let p of filteredProjects"
             class="project-card"
             [class.draft]="p.draft"
             (click)="onProjectClick(p)">

          <!-- Image -->
          <div class="card-img" [style.backgroundImage]="'url(' + p.img + ')'">
            <span *ngIf="p.draft" class="draft-ribbon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Draft
            </span>
          </div>

          <!-- Body -->
          <div class="card-body">
            <div class="card-top">
              <span class="card-name">{{ p.name }}</span>
            </div>
            <div class="card-meta">
              <span class="comp-tag">
                <img *ngIf="p.compLogo" [src]="p.compLogo" class="comp-logo" />
                {{ p.compShort }}
              </span>
              <span class="meta-dot">·</span>
              <span>{{ p.type }}</span>
              <span class="meta-dot">·</span>
              <span>{{ p.loc }}</span>
            </div>

            <!-- Draft: complete setup CTA -->
            <div *ngIf="p.draft" class="draft-cta">
              <div class="draft-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Setup incomplete
              </div>
              <button class="complete-btn" (click)="$event.stopPropagation(); go(p.route)">Complete Setup →</button>
            </div>

            <!-- Non-draft: cost + financing info -->
            <div *ngIf="!p.draft" class="card-stats">
              <div class="card-stat">
                <span class="stat-label">Total Cost</span>
                <span class="stat-value">{{ p.cost }}</span>
              </div>
              <div class="card-stat">
                <span class="stat-label">Product</span>
                <span class="stat-value">{{ p.prod }}</span>
              </div>
            </div>

            <!-- Financing row -->
            <div *ngIf="!p.draft" class="financing-row">
              <div *ngIf="p.finStatus" class="fin-badge" [class.fin-green]="p.finStatus === 'Active'" [class.fin-amber]="p.finStatus === 'In Review'" [class.fin-blue]="p.finStatus === 'Pending'">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                {{ p.fin }} · {{ p.finStatus }}
              </div>
              <button *ngIf="!p.finStatus" class="req-fin-btn" (click)="$event.stopPropagation(); requestFinancing(p)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                Request Financing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 28px 40px 60px;
    }

    /* Filter bar */
    .filter-bar {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 18px; flex-wrap: wrap;
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

    /* Grid */
    .projects-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    /* Card */
    .project-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.15s;
    }
    .project-card:hover {
      box-shadow: 0 8px 28px rgba(0,0,0,0.09);
      transform: translateY(-2px);
    }

    /* Draft card styling */
    .project-card.draft {
      border-color: ${C.amber100};
      background: ${C.amber50};
    }
    .project-card.draft .card-img { opacity: 0.7; }

    /* Card image */
    .card-img {
      height: 160px;
      background-size: cover;
      background-position: center;
      background-color: ${C.g100};
      position: relative;
    }
    .draft-ribbon {
      position: absolute; top: 10px; left: 10px;
      display: inline-flex; align-items: center; gap: 5px;
      background: ${C.amber500}; color: #fff;
      font-size: 11px; font-weight: 700;
      padding: 4px 10px; border-radius: 8px;
    }

    /* Card body */
    .card-body { padding: 14px 16px 16px; }
    .card-top { margin-bottom: 4px; }
    .card-name {
      font-size: 15px; font-weight: 700; color: ${C.g900};
      line-height: 1.3;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-meta {
      font-size: 11px; color: ${C.g500}; margin-bottom: 12px;
      display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
    }
    .meta-dot { font-size: 14px; font-weight: 900; color: ${C.g300}; }
    .comp-tag {
      display: inline-flex; align-items: center; gap: 4px;
    }
    .comp-logo {
      width: 14px; height: 14px; border-radius: 3px;
      object-fit: cover; flex-shrink: 0;
    }

    /* Stats row */
    .card-stats {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
      margin-bottom: 10px;
    }
    .card-stat {
      background: ${C.g50}; border-radius: 8px; padding: 8px 10px;
    }
    .stat-label {
      font-size: 10px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px;
    }
    .stat-value { font-size: 13px; font-weight: 700; color: ${C.g700}; }

    /* Draft CTA */
    .draft-cta { margin-top: 2px; }
    .draft-msg {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 600; color: ${C.amber600};
      margin-bottom: 10px;
    }
    .complete-btn {
      width: 100%;
      background: ${C.amber500}; color: #fff;
      border: none; border-radius: 10px;
      padding: 9px 16px;
      font-size: 13px; font-weight: 700;
      font-family: inherit; cursor: pointer;
      transition: background 0.15s;
    }
    .complete-btn:hover { background: ${C.amber600}; }

    /* Financing row */
    .financing-row { display: flex; align-items: center; }
    .fin-badge {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 700;
      padding: 5px 10px; border-radius: 8px;
    }
    .fin-green { background: ${C.greenLt}; color: ${C.green}; }
    .fin-amber { background: ${C.amber100}; color: ${C.amber600}; }
    .fin-blue { background: ${C.blue50}; color: ${C.blue500}; }

    .req-fin-btn {
      display: inline-flex; align-items: center; gap: 5px;
      background: ${C.greenLt}; color: ${C.green};
      border: 1.5px solid ${C.greenMd};
      border-radius: 10px; padding: 6px 12px;
      font-size: 12px; font-weight: 700;
      font-family: inherit; cursor: pointer;
      transition: all 0.15s;
    }
    .req-fin-btn:hover { background: ${C.green}; color: #fff; border-color: ${C.green}; }

    @media (max-width: 900px) {
      .container { padding: 20px 16px 40px; }
      .projects-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProjectsPageComponent {
  C = C;

  projects: any[] = [
    {
      name: "Khobar Mixed-Use Tower", type: "Mixed Use", loc: "Khobar",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"),
      cost: "20-50M", fin: "", prod: "Development",
      route: "/project/new", draft: true,
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=480&h=320&fit=crop"
    },
    {
      name: "Al Noor Residential", type: "Mixed Use", loc: "Dammam",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"),
      cost: "SAR 28M", fin: "~21M", prod: "Development",
      finStatus: "Active",
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=480&h=320&fit=crop"
    },
    {
      name: "Riyadh Commercial Plaza", type: "Commercial", loc: "Riyadh",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"),
      cost: "SAR 65M", fin: "~45M", prod: "Construction",
      finStatus: "In Review",
      img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=480&h=320&fit=crop"
    },
    {
      name: "Tabuk Residential Complex", type: "Residential", loc: "Tabuk",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"),
      cost: "SAR 12M", fin: "~8M", prod: "Development",
      finStatus: "In Review",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=480&h=320&fit=crop"
    },
    {
      name: "Jeddah Waterfront Villas", type: "Residential", loc: "Jeddah",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"),
      cost: "SAR 32M", fin: "~18M", prod: "Development",
      finStatus: "Pending",
      img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=480&h=320&fit=crop"
    },
    {
      name: "Abha Mountain Villas", type: "Residential", loc: "Abha",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"),
      cost: "SAR 14M", fin: "", prod: "Land Acquisition",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=480&h=320&fit=crop"
    },
    {
      name: "Al Rawdah Gardens", type: "Residential", loc: "Riyadh",
      compShort: "Al Omran Real Estate", compLogo: getCompanyLogoByName("Al Omran Real Estate"),
      cost: "SAR 30M", fin: "", prod: "Development",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=480&h=320&fit=crop"
    },
    {
      name: "Eastern Industrial Park", type: "Industrial", loc: "Dammam",
      compShort: "Al Jazeera Development", compLogo: getCompanyLogoByName("Al Jazeera Development"),
      cost: "SAR 75M", fin: "~60M", prod: "Bridge",
      finStatus: "Active",
      img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=480&h=320&fit=crop"
    },
    {
      name: "Madinah Commercial Hub", type: "Commercial", loc: "Madinah",
      compShort: "Al Jazeera Development", compLogo: getCompanyLogoByName("Al Jazeera Development"),
      cost: "SAR 40M", fin: "", prod: "Construction",
      img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=480&h=320&fit=crop"
    },
  ];

  filterCompany = '';

  constructor(private router: Router) {}

  get uniqueCompanies(): string[] {
    return [...new Set(this.projects.map(p => p.compShort))];
  }

  get filteredProjects(): any[] {
    return this.projects.filter(p => {
      if (this.filterCompany && p.compShort !== this.filterCompany) return false;
      return true;
    });
  }

  go(path: string) { this.router.navigateByUrl(path); }

  requestFinancing(p: any) {
    this.router.navigate(['/application/new'], { queryParams: { project: p.name } });
  }

  onProjectClick(p: any) {
    if (p.draft && p.route) { this.go(p.route); return; }
    const idx = this.projects.indexOf(p);
    this.go('/dashboard/project/' + idx);
  }
}
