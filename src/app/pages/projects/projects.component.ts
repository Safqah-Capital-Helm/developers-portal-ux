import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import { PageHeaderComponent, ButtonComponent, getCompanyLogoByName, TranslatePipe, I18nService, ApiService, SkeletonComponent } from '../../shared';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, ButtonComponent, TranslatePipe, SkeletonComponent],
  template: `
    <div class="container">
      <app-page-header [title]="'projects.title' | t" [count]="filteredProjects.length">
        <app-btn variant="primary" size="sm" (clicked)="go('/project/new?fresh=1')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ 'projects.add_project' | t }}
        </app-btn>
      </app-page-header>

      <!-- Skeleton loading -->
      <app-skeleton *ngIf="loading" type="grid" [count]="4"></app-skeleton>

      <!-- Filters -->
      <div class="filter-bar" *ngIf="!loading">
        <div class="filter-group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <select class="filter-select" [(ngModel)]="filterCompany">
            <option value="">{{ 'projects.all_companies' | t }}</option>
            <option *ngFor="let c of uniqueCompanies" [value]="c">{{ c }}</option>
          </select>
        </div>
        <button *ngIf="filterCompany" class="filter-clear" (click)="filterCompany = ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          {{ 'projects.clear' | t }}
        </button>
      </div>

      <!-- Project grid -->
      <div class="projects-grid" *ngIf="!loading">
        <div *ngFor="let p of filteredProjects"
             class="project-card"
             [class.draft]="p.draft"
             (click)="onProjectClick(p)">

          <!-- Image -->
          <div class="card-img" [style.backgroundImage]="'url(' + p.img + ')'">
            <span *ngIf="p.draft" class="draft-ribbon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              {{ 'projects.draft' | t }}
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
                {{ 'projects.setup_incomplete' | t }}
              </div>
              <button class="complete-btn" (click)="$event.stopPropagation(); go(p.route)">{{ 'projects.complete_setup' | t }} →</button>
            </div>

            <!-- Non-draft: cost + financing info -->
            <div *ngIf="!p.draft" class="card-stats">
              <div class="card-stat">
                <span class="stat-label">{{ 'projects.total_cost' | t }}</span>
                <span class="stat-value">{{ p.cost }}</span>
              </div>
              <div class="card-stat">
                <span class="stat-label">{{ 'projects.product' | t }}</span>
                <span class="stat-value">{{ p.prod }}</span>
              </div>
            </div>

            <!-- Financing row -->
            <div *ngIf="!p.draft" class="financing-row">
              <div *ngIf="p.finStatus" class="fin-badge" [class.fin-green]="p.finStatus === i18n.t('common.status_active')" [class.fin-amber]="p.finStatus === i18n.t('common.status_in_review')" [class.fin-blue]="p.finStatus === i18n.t('common.status_pending')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                {{ p.fin }} · {{ p.finStatus }}
              </div>
              <button *ngIf="!p.finStatus" class="req-fin-btn" (click)="$event.stopPropagation(); requestFinancing(p)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                {{ 'projects.request_financing' | t }}
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
      padding: 32px 32px 60px;
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
      color: ${C.g500}; cursor: pointer;
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
    @media (max-width: 768px) {
      .container { padding: 20px 16px 40px; }
      .card-img { height: 140px; }
    }
    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .card-img { height: 120px; }
      .card-body { padding: 12px 14px 14px; }
      .card-stats { gap: 6px; }
      .card-stat { padding: 6px 8px; }
      .stat-label { font-size: 9px; }
      .stat-value { font-size: 12px; }
    }
  `]
})
export class ProjectsPageComponent implements OnInit {
  C = C;
  loading = true;
  projects: any[] = [];
  filterCompany = '';

  constructor(private router: Router, public i18n: I18nService, private api: ApiService) {}

  ngOnInit() {
    this.api.getProjects().subscribe(data => {
      this.projects = data.map(p => ({
        name: p.name,
        type: p.type,
        loc: p.location,
        compShort: p.companyName,
        compLogo: p.compLogo,
        cost: p.cost,
        fin: p.financingAmount,
        prod: p.product,
        finStatus: p.financingStatus,
        draft: p.draft,
        route: p.draftRoute,
        img: p.image
      }));
      this.loading = false;
    });
  }

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
