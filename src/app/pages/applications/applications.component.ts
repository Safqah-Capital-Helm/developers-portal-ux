import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C, borderColorForStatus } from '../../shared/theme';
import { BadgeComponent, ListCardComponent, ButtonComponent, PageHeaderComponent, TranslatePipe, I18nService } from '../../shared';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ListCardComponent, ButtonComponent, PageHeaderComponent, TranslatePipe],
  template: `
    <div class="container">
      <app-page-header [title]="'applications.title' | t" [count]="applications.length">
        <app-btn variant="primary" size="sm" (clicked)="go('/application/new')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ 'applications.new_application' | t }}
        </app-btn>
      </app-page-header>

      <!-- Application cards -->
      <app-list-card *ngFor="let app of applications"
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
    </div>
  `,
  styles: [`
    :host { display: block; }
    .container { max-width: 900px; margin: 0 auto; padding: 32px 32px 60px; }
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
export class ApplicationsComponent {
  C = C;

  get applications() {
    return [
      { id: 1, projectName: "Al Noor Residential", company: "Al Omran Real Estate", amount: "~21M SAR", product: this.i18n.t('common.stage_development'), status: this.i18n.t('common.status_termsheet_ready'), sc: "green", submitted: "Feb 12, 2026", route: "/application/1/status" },
      { id: 2, projectName: "Riyadh Commercial Plaza", company: "Al Omran Real Estate", amount: "~45M SAR", product: this.i18n.t('common.stage_construction'), status: this.i18n.t('common.status_in_review'), sc: "amber", submitted: "Feb 28, 2026", route: "/application/2/status" },
      { id: 3, projectName: "Tabuk Residential Complex", company: "Al Omran Real Estate", amount: "~8M SAR", product: this.i18n.t('common.stage_development'), status: this.i18n.t('common.status_feedback_requested'), sc: "amber", submitted: "Mar 1, 2026", route: "/application/3/status" },
      { id: 4, projectName: "Jeddah Waterfront Villas", company: "Al Omran Real Estate", amount: "~18M SAR", product: this.i18n.t('common.stage_development'), status: this.i18n.t('common.status_pending_signing'), sc: "blue", submitted: "Jan 15, 2026", route: "/application/4/accepted" },
      { id: 5, projectName: "Abha Mountain Villas", company: "Al Omran Real Estate", amount: "~10M SAR", product: this.i18n.t('common.stage_land_acquisition'), status: this.i18n.t('common.status_signed'), sc: "green", submitted: "Dec 8, 2025", route: "/dashboard" },
    ];
  }

  constructor(private router: Router, private i18n: I18nService) {}

  go(path: string) { this.router.navigateByUrl(path); }

  onAppClick(app: any) {
    if (app.sc === 'red') return;
    this.go(app.route);
  }
}
