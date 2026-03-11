import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { ButtonComponent, BadgeComponent } from '../../shared';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent],
  template: `
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="section-icon" [style.background]="'#eff8ff'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h1 class="page-title">Financing Applications</h1>
          <span class="section-count">{{ applications.length }}</span>
        </div>
      </div>

      <!-- Application cards -->
      <div *ngFor="let app of applications"
           class="app-card"
           [class.dead]="app.sc === 'red'"
           [style.border-left-color]="borderColor(app.sc)"
           (click)="onAppClick(app)">
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
            <div class="cell-label">Financing Amount</div>
            <div class="cell-value">{{ app.amount }}</div>
          </div>
          <div class="app-cell">
            <div class="cell-label">Product</div>
            <div class="cell-value">{{ app.product }}</div>
          </div>
          <div class="app-cell">
            <div class="cell-label">Submitted</div>
            <div class="cell-value">{{ app.submitted || '\u2014' }}</div>
          </div>
        </div>
      </div>

      <!-- New application dashed button -->
      <div class="dashed-btn app-dashed" (click)="go('/application/new')">
        <div class="app-dashed-inner">
          <div class="app-dashed-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <div>
            <div class="app-dashed-title">Create a new application</div>
            <div class="app-dashed-sub">Submit a financing request for one of your projects</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 28px 40px 60px;
    }

    .page-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
    }
    .page-header-left { display: flex; align-items: center; gap: 10px; }
    .page-title { font-size: 20px; font-weight: 900; color: ${C.g900}; margin: 0; }
    .section-icon {
      width: 34px; height: 34px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .section-count {
      font-size: 12px; font-weight: 700; color: ${C.g400};
      background: ${C.g100}; padding: 2px 8px; border-radius: 10px;
    }

    /* Application cards */
    .app-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g300};
      border-radius: 16px;
      padding: 18px 20px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
    .app-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); }
    .app-card.dead { opacity: 0.6; cursor: default; pointer-events: none; }
    .app-top {
      display: flex; justify-content: space-between;
      align-items: flex-start; gap: 10px; margin-bottom: 4px;
    }
    .app-name { font-size: 15px; font-weight: 700; color: ${C.g900}; line-height: 1.3; }
    .app-sub {
      font-size: 12px; color: ${C.g500}; margin-bottom: 14px;
      display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
    }
    .app-dot { font-size: 16px; font-weight: 900; color: ${C.g300}; }
    .app-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .app-cell { background: ${C.g50}; border-radius: 8px; padding: 8px 10px; }
    .cell-label {
      font-size: 10px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px;
    }
    .cell-value { font-size: 13px; font-weight: 700; color: ${C.g700}; }

    /* Dashed button */
    .dashed-btn {
      border: 2px dashed ${C.g300};
      border-radius: 12px; padding: 14px;
      display: flex; align-items: center; justify-content: center;
      gap: 8px; cursor: pointer;
      font-size: 13px; font-weight: 700; color: ${C.g500};
      transition: border-color 0.2s, background 0.2s; margin-top: 4px;
    }
    .dashed-btn:hover { border-color: ${C.green}; background: ${C.greenLt}; color: ${C.green}; }
    .dashed-btn:hover svg { stroke: ${C.green}; }
    .app-dashed { padding: 20px; }
    .app-dashed-inner { display: flex; align-items: center; gap: 14px; }
    .app-dashed-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: ${C.g100}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .app-dashed-title { font-size: 14px; font-weight: 700; color: ${C.g700}; margin-bottom: 2px; }
    .app-dashed-sub { font-size: 12px; color: ${C.g400}; font-weight: 500; }

    @media (max-width: 900px) {
      .container { padding: 20px 16px 40px; }
    }
  `]
})
export class ApplicationsComponent {
  C = C;

  applications = [
    { id: 1, projectName: "Al Noor Residential", company: "Al Omran Real Estate", amount: "~21M SAR", product: "Development", status: "Term-sheet Ready", sc: "green", submitted: "Feb 12, 2026", route: "/application/1/status" },
    { id: 2, projectName: "Riyadh Commercial Plaza", company: "Al Omran Real Estate", amount: "~45M SAR", product: "Construction", status: "In Review", sc: "amber", submitted: "Feb 28, 2026", route: "/application/2/status" },
    { id: 3, projectName: "Tabuk Residential Complex", company: "Al Omran Real Estate", amount: "~8M SAR", product: "Development", status: "Feedback Requested", sc: "amber", submitted: "Mar 1, 2026", route: "/application/3/status" },
    { id: 4, projectName: "Jeddah Waterfront Villas", company: "Al Omran Real Estate", amount: "~18M SAR", product: "Development", status: "Pending Signing", sc: "blue", submitted: "Jan 15, 2026", route: "/application/4/accepted" },
    { id: 5, projectName: "Abha Mountain Villas", company: "Al Omran Real Estate", amount: "~10M SAR", product: "Land Acquisition", status: "Signed", sc: "green", submitted: "Dec 8, 2025", route: "/dashboard" },
  ];

  constructor(private router: Router) {}

  borderColor(sc: string): string {
    const map: Record<string, string> = {
      green: C.green, amber: C.amber500, blue: C.blue500, red: C.red500, gray: C.g300
    };
    return map[sc] || C.g300;
  }

  go(path: string) { this.router.navigateByUrl(path); }

  onAppClick(app: any) {
    if (app.sc === 'red') return;
    this.go(app.route);
  }
}
