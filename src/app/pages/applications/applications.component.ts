import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C, borderColorForStatus } from '../../shared/theme';
import { BadgeComponent, ListCardComponent, ButtonComponent, PageHeaderComponent, TranslatePipe, I18nService, SkeletonComponent, ApiService } from '../../shared';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ListCardComponent, ButtonComponent, PageHeaderComponent, TranslatePipe, SkeletonComponent],
  template: `
    <div class="container">
      <app-page-header [title]="'applications.title' | t" [count]="applications.length">
        <app-btn variant="primary" size="sm" (clicked)="go('/application/new')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ 'applications.new_application' | t }}
        </app-btn>
      </app-page-header>

      <!-- Status filter chips -->
      <div *ngIf="!loading" class="filter-row">
        <button *ngFor="let s of statusFilters"
                class="filter-chip"
                [class.filter-chip-active]="selectedStatus === s.key"
                (click)="selectedStatus = s.key">{{ s.label }}</button>
      </div>

      <!-- Company filter chips -->
      <div *ngIf="!loading && companyNames.length > 1" class="filter-row">
        <button class="filter-chip"
                [class.filter-chip-active]="selectedCompany === 'all'"
                (click)="selectedCompany = 'all'">{{ 'applications.filter_company_all' | t }}</button>
        <button *ngFor="let c of companyNames"
                class="filter-chip"
                [class.filter-chip-active]="selectedCompany === c"
                (click)="selectedCompany = c">{{ c }}</button>
      </div>

      <!-- Skeleton loading -->
      <app-skeleton *ngIf="loading" type="card" [count]="3"></app-skeleton>

      <!-- Application cards -->
      <ng-container *ngIf="!loading">
        <app-list-card *ngFor="let app of filteredApplications"
             [statusColor]="app.sc"
             [clickable]="app.sc !== 'red'"
             (click)="onAppClick(app)">
          <div class="app-inner" [class.dead]="app.sc === 'red'">
            <div class="app-top">
              <span class="app-name">{{ app.projectName }}</span>
              <app-badge [color]="$any(app.sc)">{{ app.status }}</app-badge>
            </div>
            <div class="app-sub">
              <span>{{ app.company }}</span>
              <span class="app-dot">&#183;</span>
              <span>{{ app.product }}</span>
            </div>
            <div class="app-grid">
              <div class="app-cell">
                <div class="cell-label">{{ 'applications.financing_amount' | t }}</div>
                <div class="cell-value">{{ app.amount }}</div>
              </div>
              <div class="app-cell">
                <div class="cell-label">{{ 'applications.product' | t }}</div>
                <div class="cell-value">{{ app.product }}</div>
              </div>
              <div class="app-cell">
                <div class="cell-label">{{ 'applications.submitted' | t }}</div>
                <div class="cell-value">{{ app.submitted || '\u2014' }}</div>
              </div>
            </div>
          </div>
        </app-list-card>
      </ng-container>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .container { max-width: 900px; margin: 0 auto; padding: 32px 32px 60px; }
    .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .filter-chip {
      background: ${C.g50}; border: 1px solid ${C.g200}; border-radius: 20px;
      padding: 6px 14px; font-size: 12px; font-weight: 600; color: ${C.g600};
      cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap;
    }
    .filter-chip:hover { background: ${C.g100}; border-color: ${C.g300}; }
    .filter-chip-active { background: ${C.green}; color: #fff; border-color: ${C.green}; }
    .filter-chip-active:hover { background: ${C.green}; border-color: ${C.green}; }
    .app-inner { flex: 1; }
    .app-inner.dead { opacity: 0.6; }
    .app-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 4px; }
    .app-name { font-size: 15px; font-weight: 700; color: ${C.g900}; line-height: 1.3; }
    .app-sub { font-size: 12px; color: ${C.g500}; margin-bottom: 14px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .app-dot { font-size: 16px; font-weight: 900; color: ${C.g300}; }
    .app-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .app-cell { background: ${C.g50}; border-radius: 8px; padding: 8px 10px; }
    .cell-label { font-size: 10px; font-weight: 700; color: ${C.g400}; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px; }
    .cell-value { font-size: 13px; font-weight: 700; color: ${C.g700}; }
    @media (max-width: 900px) { .container { padding: 20px 16px 40px; } }
    @media (max-width: 768px) {
      .container { padding: 20px 16px 40px; }
      .app-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .app-grid { grid-template-columns: 1fr; }
      .app-top { flex-direction: column; gap: 4px; }
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  C = C;
  loading = true;
  applications: any[] = [];
  selectedStatus = 'all';
  selectedCompany = 'all';

  get statusFilters() {
    return [
      { key: 'all', label: this.i18n.t('applications.filter_all') },
      { key: 'termsheet_ready', label: this.i18n.t('common.status_termsheet_ready') },
      { key: 'in_review', label: this.i18n.t('common.status_in_review') },
      { key: 'feedback_requested', label: this.i18n.t('common.status_feedback_requested') },
      { key: 'pending_signing', label: this.i18n.t('common.status_pending_signing') },
      { key: 'signed', label: this.i18n.t('common.status_signed') },
    ];
  }

  get companyNames(): string[] {
    const names = [...new Set(this.applications.map((a: any) => a.company))];
    return names.sort();
  }

  get filteredApplications(): any[] {
    return this.applications.filter((app: any) => {
      const statusMatch = this.selectedStatus === 'all' || app.statusKey === this.selectedStatus;
      const companyMatch = this.selectedCompany === 'all' || app.company === this.selectedCompany;
      return statusMatch && companyMatch;
    });
  }

  constructor(private router: Router, private i18n: I18nService, private api: ApiService) {}

  ngOnInit() {
    this.api.getApplications().subscribe(data => {
      this.applications = data;
      this.loading = false;
    });
  }

  go(path: string) { this.router.navigateByUrl(path); }

  onAppClick(app: any) {
    if (app.sc === 'red') return;
    this.go(app.route);
  }
}
