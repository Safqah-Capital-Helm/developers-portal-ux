import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { ButtonComponent, BadgeComponent } from '../../shared';

@Component({
  selector: 'app-companies-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent],
  template: `
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="section-icon" [style.background]="C.blue50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
              <line x1="9" y1="9" x2="9" y2="9.01"/><line x1="9" y1="13" x2="9" y2="13.01"/><line x1="9" y1="17" x2="9" y2="17.01"/>
            </svg>
          </div>
          <h1 class="page-title">Companies</h1>
          <span class="section-count">{{ companies.length }}</span>
        </div>
      </div>

      <!-- Company cards -->
      <div *ngFor="let co of companies; let i = index" class="company-card" [style.border-left-color]="borderColor(co.sc)" (click)="go('/dashboard/company/' + i)">
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

      <div class="dashed-btn" (click)="go('/company/new')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Add company</span>
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

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .page-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .page-title {
      font-size: 20px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0;
    }
    .section-icon {
      width: 34px; height: 34px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .section-count {
      font-size: 12px; font-weight: 700; color: ${C.g400};
      background: ${C.g100}; padding: 2px 8px; border-radius: 10px;
    }

    /* Company cards */
    .company-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g300};
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: box-shadow 0.2s, border-color 0.2s;
    }
    .company-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
    .company-top {
      display: flex; justify-content: space-between;
      align-items: flex-start; gap: 8px; margin-bottom: 4px;
    }
    .company-name { font-size: 14px; font-weight: 700; color: ${C.g900}; line-height: 1.3; }
    .company-cr { font-size: 11px; color: ${C.g400}; margin-bottom: 8px; }
    .company-meta { display: flex; gap: 16px; }
    .meta-item {
      display: flex; align-items: center; gap: 4px;
      font-size: 12px; color: ${C.g500}; font-weight: 600;
    }

    /* Dashed button */
    .dashed-btn {
      border: 2px dashed ${C.g300};
      border-radius: 12px;
      padding: 14px;
      display: flex; align-items: center; justify-content: center;
      gap: 8px; cursor: pointer;
      font-size: 13px; font-weight: 700; color: ${C.g500};
      transition: border-color 0.2s, background 0.2s;
      margin-top: 4px;
    }
    .dashed-btn:hover {
      border-color: ${C.green}; background: ${C.greenLt}; color: ${C.green};
    }
    .dashed-btn:hover svg { stroke: ${C.green}; }

    @media (max-width: 900px) {
      .container { padding: 20px 16px 40px; }
    }
  `]
})
export class CompaniesPageComponent {
  C = C;

  companies = [
    { name: "Al Omran Real Estate Dev Co.", cr: "1551515151516515", status: "Approved", sc: "green", proj: 8, mem: 3 },
    { name: "Al Jazeera Development Co.", cr: "1020304050607", status: "Under Review", sc: "amber", proj: 2, mem: 1 }
  ];

  constructor(private router: Router) {}

  borderColor(sc: string): string {
    const map: Record<string, string> = {
      green: C.green, amber: C.amber500, blue: C.blue500, red: C.red500, gray: C.g300
    };
    return map[sc] || C.g300;
  }

  go(path: string) { this.router.navigateByUrl(path); }
}
