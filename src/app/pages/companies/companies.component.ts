import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C, borderColorForStatus } from '../../shared/theme';
import { BadgeComponent, ListCardComponent, DashedButtonComponent, PageHeaderComponent } from '../../shared';

@Component({
  selector: 'app-companies-page',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ListCardComponent, DashedButtonComponent, PageHeaderComponent],
  template: `
    <div class="container">
      <app-page-header title="Companies" [count]="companies.length"></app-page-header>

      <!-- Company cards -->
      <app-list-card *ngFor="let co of companies; let i = index" [statusColor]="co.sc" (click)="go('/dashboard/company/' + i)">
        <div class="company-inner">
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
      </app-list-card>

      <app-dashed-btn label="Add company" [fullWidth]="true" (clicked)="go('/company/new')"></app-dashed-btn>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .container { max-width: 800px; margin: 0 auto; padding: 28px 40px 60px; }
    .company-inner { flex: 1; }
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
    { name: "Al Omran Real Estate Dev Co.", cr: "1551515151516515", status: "Approved", sc: "green", proj: 8, mem: 3 },
    { name: "Al Jazeera Development Co.", cr: "1020304050607", status: "Under Review", sc: "amber", proj: 2, mem: 1 }
  ];

  constructor(private router: Router) {}

  go(path: string) { this.router.navigateByUrl(path); }
}
