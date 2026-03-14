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
            <div class="app-header">
              <!-- Status icon circle -->
              <div class="app-icon"
                   [class.icon-green]="app.sc === 'green'"
                   [class.icon-amber]="app.sc === 'amber'"
                   [class.icon-blue]="app.sc === 'blue'"
                   [class.icon-red]="app.sc === 'red'">
                <svg *ngIf="app.sc === 'green'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="16 13 12 17 9 14"/></svg>
                <svg *ngIf="app.sc === 'amber'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <svg *ngIf="app.sc === 'blue'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                <svg *ngIf="app.sc === 'red'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9.5" y1="12.5" x2="14.5" y2="17.5"/><line x1="14.5" y1="12.5" x2="9.5" y2="17.5"/></svg>
              </div>

              <!-- Info -->
              <div class="app-info">
                <div class="app-top">
                  <span class="app-name">{{ app.projectName }}</span>
                  <app-badge [color]="$any(app.sc)">{{ app.status }}</app-badge>
                </div>
                <div class="app-meta">
                  <span class="meta-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                    {{ app.company }}
                  </span>
                  <span class="meta-sep">&middot;</span>
                  <span class="meta-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                    {{ app.product }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer: amount chip + date -->
            <div class="app-footer">
              <div class="amount-chip"
                   [class.chip-green]="app.sc === 'green'"
                   [class.chip-amber]="app.sc === 'amber'"
                   [class.chip-blue]="app.sc === 'blue'"
                   [class.chip-red]="app.sc === 'red'">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                {{ app.amount }}
              </div>
              <div *ngIf="app.submitted" class="date-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ app.submitted }}
              </div>
            </div>
          </div>
        </app-list-card>
      </ng-container>

      <!-- Empty state when filters produce no results -->
      <div *ngIf="!loading && filteredApplications.length === 0 && selectedStatus !== 'all'" class="empty-state">
        <div class="empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#98a2b3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div class="empty-title">{{ 'applications.no_results' | t }}</div>
        <app-btn variant="ghost" size="sm" (clicked)="selectedStatus = 'all'">{{ 'applications.clear_filter' | t }}</app-btn>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .container { max-width: 900px; margin: 0 auto; padding: 32px 32px 60px; }

    /* Filter chips */
    .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .filter-chip {
      background: ${C.g50}; border: 1px solid ${C.g200}; border-radius: 20px;
      padding: 6px 14px; font-size: 12px; font-weight: 600; color: ${C.g600};
      cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap;
    }
    .filter-chip:hover { background: ${C.g100}; border-color: ${C.g300}; }
    .filter-chip-active { background: ${C.green}; color: #fff; border-color: ${C.green}; }
    .filter-chip-active:hover { background: ${C.green}; border-color: ${C.green}; }
    .filter-chip:focus-visible { outline: 2px solid #00af3d; outline-offset: 2px; }

    /* Card inner */
    .app-inner { flex: 1; }
    .app-inner.dead { opacity: 0.55; }

    /* Header row: icon + info */
    .app-header { display: flex; gap: 14px; align-items: flex-start; }

    /* Status icon circle */
    .app-icon {
      width: 42px; height: 42px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .icon-green { background: ${C.greenLt}; color: ${C.green}; }
    .icon-amber { background: ${C.amber100}; color: ${C.amber600}; }
    .icon-blue { background: ${C.blue50}; color: ${C.blue500}; }
    .icon-red { background: ${C.red50}; color: ${C.red500}; }

    /* Info section */
    .app-info { flex: 1; min-width: 0; }
    .app-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 4px; }
    .app-name { font-size: 15px; font-weight: 700; color: ${C.g900}; line-height: 1.3; }

    /* Metadata with icons */
    .app-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .meta-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: ${C.g500}; font-weight: 500; }
    .meta-sep { color: ${C.g300}; font-weight: 900; font-size: 14px; }

    /* Footer: amount chip + date */
    .app-footer {
      display: flex; align-items: center; justify-content: space-between;
      margin-top: 14px; padding-top: 12px;
      border-top: 1px dashed ${C.g200};
    }

    /* Colored amount chip */
    .amount-chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 12px; border-radius: 8px;
      font-size: 13px; font-weight: 800;
    }
    .chip-green { background: ${C.greenLt}; color: ${C.green}; }
    .chip-amber { background: ${C.amber100}; color: ${C.amber600}; }
    .chip-blue { background: ${C.blue100}; color: ${C.blue500}; }
    .chip-red { background: ${C.red50}; color: ${C.red500}; }

    /* Date tag */
    .date-tag {
      display: flex; align-items: center; gap: 5px;
      font-size: 12px; color: ${C.g500}; font-weight: 600;
    }

    /* Empty state */
    .empty-state { text-align: center; padding: 48px 20px; }
    .empty-icon { margin-bottom: 12px; }
    .empty-title { font-size: 14px; font-weight: 600; color: #667085; margin-bottom: 16px; }

    /* Responsive */
    @media (max-width: 900px) { .container { padding: 20px 16px 40px; } }
    @media (max-width: 768px) {
      .container { padding: 20px 16px 40px; }
      .app-icon { width: 36px; height: 36px; border-radius: 10px; }
      .app-icon svg { width: 16px; height: 16px; }
    }
    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .app-top { flex-direction: column; gap: 4px; }
      .app-header { gap: 10px; }
      .app-icon { width: 34px; height: 34px; border-radius: 9px; }
      .app-icon svg { width: 15px; height: 15px; }
      .app-footer { flex-direction: column; align-items: flex-start; gap: 8px; }
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
      this.applications = data.map((a: any) => ({ ...a, sc: a.statusColor }));
      this.loading = false;
    });
  }

  go(path: string) { this.router.navigateByUrl(path); }

  onAppClick(app: any) {
    if (app.sc === 'red') return;
    this.go(app.route);
  }
}
