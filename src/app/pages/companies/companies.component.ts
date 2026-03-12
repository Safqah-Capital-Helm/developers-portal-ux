import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C, borderColorForStatus } from '../../shared/theme';
import { BadgeComponent, ListCardComponent, ButtonComponent, PageHeaderComponent, getCompanyLogo } from '../../shared';

@Component({
  selector: 'app-companies-page',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ListCardComponent, ButtonComponent, PageHeaderComponent],
  template: `
    <div class="container">
      <app-page-header title="Companies" [count]="companies.length">
        <app-btn variant="primary" size="sm" (clicked)="go('/company/new')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Company
        </app-btn>
      </app-page-header>

      <!-- Company cards -->
      <app-list-card *ngFor="let co of companies; let i = index" [statusColor]="co.sc" (click)="go('/dashboard/company/' + i)">
        <div class="company-inner">
          <div class="company-row">
            <img *ngIf="co.logo" [src]="co.logo" class="company-logo" [alt]="co.name" />
            <div class="company-details">
              <div class="company-top">
                <span class="company-name">{{ co.name }}</span>
                <app-badge [color]="$any(co.sc)">{{ co.status }}</app-badge>
              </div>
              <div class="company-cr">CR: {{ co.cr }}</div>
              <div class="company-meta">
                <span class="meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
                  {{ co.proj }} projects
                </span>
                <span class="meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  {{ co.mem }} members
                </span>
              </div>
            </div>
          </div>
        </div>
      </app-list-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .container { max-width: 800px; margin: 0 auto; padding: 28px 40px 60px; }
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
  `]
})
export class CompaniesPageComponent {
  C = C;

  companies = [
    { name: "Al Omran Real Estate Dev Co.", cr: "1551515151516515", status: "Approved", sc: "green", proj: 8, mem: 3, logo: getCompanyLogo('1551515151516515') },
    { name: "Al Jazeera Development Co.", cr: "1020304050607", status: "Pending Verification", sc: "amber", proj: 2, mem: 1, logo: getCompanyLogo('1020304050607') },
    { name: "Riyad Construction Group", cr: "3080706050403", status: "Missing Credentials", sc: "red", proj: 1, mem: 2, logo: getCompanyLogo('3080706050403') }
  ];

  constructor(private router: Router) {}

  go(path: string) { this.router.navigateByUrl(path); }
}
