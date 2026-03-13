import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C, borderColorForStatus } from '../../shared/theme';
import { BadgeComponent, ListCardComponent, ButtonComponent, PageHeaderComponent, getCompanyLogo, TranslatePipe, I18nService, ApiService, SkeletonComponent } from '../../shared';
import type { Company } from '../../shared';

@Component({
  selector: 'app-companies-page',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ListCardComponent, ButtonComponent, PageHeaderComponent, TranslatePipe, SkeletonComponent],
  template: `
    <div class="container">
      <app-page-header [title]="'companies.title' | t" [count]="companies.length">
        <app-btn variant="primary" size="sm" (clicked)="go('/company/new')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ 'companies.add_company' | t }}
        </app-btn>
      </app-page-header>

      <!-- Skeleton loading -->
      <div *ngIf="loading" class="skeleton-container">
        <app-skeleton type="list" [count]="3"></app-skeleton>
      </div>

      <!-- Company cards -->
      <ng-container *ngIf="!loading">
      <app-list-card *ngFor="let co of companies; let i = index" [statusColor]="co.statusColor" (click)="go('/dashboard/company/' + co.id)">
        <div class="company-inner">
          <div class="company-row">
            <img *ngIf="getCompanyLogo(co.cr)" [src]="getCompanyLogo(co.cr)" class="company-logo" [alt]="co.name" />
            <div class="company-details">
              <div class="company-top">
                <span class="company-name">{{ co.name }}</span>
                <app-badge [color]="$any(co.statusColor)">{{ co.status }}</app-badge>
              </div>
              <div class="company-cr">{{ 'companies.cr_label' | t }}: {{ co.cr }}</div>
              <div class="company-meta">
                <span class="meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
                  {{ co.projectCount }} {{ 'companies.projects' | t }}
                </span>
                <span class="meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  {{ co.memberCount }} {{ 'companies.members' | t }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </app-list-card>
      </ng-container>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .skeleton-container { margin-top: 16px; }
    .container { max-width: 800px; margin: 0 auto; padding: 32px 32px 60px; }
    .company-inner { flex: 1; }
    .company-row { display: flex; align-items: center; gap: 16px; }
    .company-logo {
      width: 48px; height: 48px; border-radius: 12px;
      object-fit: cover; flex-shrink: 0;
    }
    .company-details { flex: 1; min-width: 0; }
    .company-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 4px; }
    .company-name { font-size: 14px; font-weight: 700; color: ${C.g900}; line-height: 1.3; }
    .company-cr { font-size: 11px; color: ${C.g400}; margin-bottom: 8px; }
    .company-meta { display: flex; gap: 16px; }
    .meta-item { display: flex; align-items: center; gap: 4px; font-size: 12px; color: ${C.g500}; font-weight: 600; }
    @media (max-width: 900px) { .container { padding: 20px 16px 40px; } }
    @media (max-width: 768px) {
      .container { padding: 20px 16px 40px; }
      .company-row { gap: 12px; }
      .company-logo { width: 40px; height: 40px; border-radius: 10px; }
    }
    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .company-top { flex-direction: column; gap: 4px; }
      .company-meta { gap: 10px; }
    }
  `]
})
export class CompaniesPageComponent implements OnInit {
  C = C;
  loading = true;
  companies: Company[] = [];
  getCompanyLogo = getCompanyLogo;

  constructor(private router: Router, private i18n: I18nService, private api: ApiService) {}

  ngOnInit() {
    this.api.getCompanies().subscribe({
      next: (data) => { this.companies = data; },
      complete: () => { this.loading = false; }
    });
  }

  go(path: string) { this.router.navigateByUrl(path); }
}
