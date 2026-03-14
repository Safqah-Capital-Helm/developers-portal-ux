import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  CardComponent,
  AlertBannerComponent,
  TranslatePipe,
} from '../../shared';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule, NavComponent, BackLinkComponent, ButtonComponent, CardComponent, AlertBannerComponent, TranslatePipe],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link [to]="'/application/' + appId + '/status'" [label]="('common.back' | t)"></app-back-link>

        <!-- Header -->
        <div class="header">
          <div class="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h1 class="title">{{ 'offer.title' | t }}</h1>
          <p class="subtitle">Al Noor Residential &middot; Al Omran Real Estate</p>
          <div class="deadline-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ 'offer.respond_by' | t:{date: 'March 23, 2026'} }}
          </div>
        </div>

        <!-- Term-sheet Card -->
        <app-card [padding]="0">
          <div class="card-inner">
            <!-- Top highlight row -->
            <div class="highlight-grid">
              <div class="highlight-cell" [style.background]="'${C.greenLt}'">
                <span class="highlight-label">{{ 'offer.amount' | t }}</span>
                <span class="highlight-value" [style.color]="'${C.green}'">21M SAR</span>
              </div>
              <div class="highlight-cell" [style.background]="'${C.g50}'">
                <span class="highlight-label">{{ 'offer.rate' | t }}</span>
                <span class="highlight-value" [style.color]="'${C.g800}'">8.5%</span>
              </div>
            </div>

            <!-- Detail grid -->
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">{{ 'offer.product' | t }}</span>
                <span class="detail-value">{{ 'offer.ts_value_development' | t }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">{{ 'offer.tenure' | t }}</span>
                <span class="detail-value">{{ 'offer.ts_value_months' | t:{count: '24'} }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">{{ 'offer.structure' | t }}</span>
                <span class="detail-value">{{ 'offer.ts_value_murabaha' | t }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">{{ 'offer.disbursement' | t }}</span>
                <span class="detail-value">{{ 'offer.ts_value_milestone' | t }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">{{ 'offer.grace' | t }}</span>
                <span class="detail-value">{{ 'offer.ts_value_grace' | t:{count: '6'} }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">{{ 'offer.repayment' | t }}</span>
                <span class="detail-value">{{ 'offer.ts_value_quarterly' | t }}</span>
              </div>
            </div>
          </div>
        </app-card>

        <!-- Validity warning -->
        <app-alert-banner
          type="warning"
          [title]="('offer.valid_until' | t:{date: 'March 23, 2026'})"
          style="display: block; margin-top: 16px;"
        ></app-alert-banner>

        <!-- Actions -->
        <div class="actions">
          <app-btn variant="dangerOutline" size="lg" (clicked)="go('/application/1/declined')">{{ 'offer.decline' | t }}</app-btn>
          <app-btn variant="primary" size="lg" (clicked)="go('/application/1/accepted')">{{ 'offer.accept' | t }} <span class="dir-arrow">&rarr;</span></app-btn>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page {
      min-height: 100vh;
      background: ${C.bg};
    }

    .container {
      max-width: 580px;
      margin: 0 auto;
      padding: 32px;
    }

    .header {
      text-align: center;
      margin-bottom: 28px;
    }

    .icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${C.greenLt};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .title {
      font-size: 24px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 6px 0;
    }

    .subtitle {
      font-size: 14px;
      color: ${C.g500};
      margin: 0;
    }

    .deadline-badge {
      display: inline-flex; align-items: center; gap: 6px;
      margin-top: 10px; padding: 6px 14px;
      background: #fff7ed; border: 1px solid #fed7aa;
      border-radius: 8px; font-size: 13px; font-weight: 700;
      color: #ea580c;
    }

    .card-inner {
      overflow: hidden;
    }

    .highlight-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .highlight-cell {
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .highlight-label {
      font-size: 12px;
      font-weight: 600;
      color: ${C.g500};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .highlight-value {
      font-size: 28px;
      font-weight: 900;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      padding: 20px 24px 24px;
      gap: 20px;
      border-top: 1px solid ${C.g200};
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      font-size: 11px;
      font-weight: 600;
      color: ${C.g400};
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .detail-value {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g800};
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 28px;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .container { padding: 24px 16px; }
      .highlight-value { font-size: 24px; }
      .highlight-cell { padding: 18px 16px; }
      .detail-grid { padding: 16px; gap: 16px; }
    }

    @media (max-width: 480px) {
      .container { padding: 20px 12px; }
      .title { font-size: 20px; }
      .highlight-value { font-size: 20px; }
      .highlight-cell { padding: 14px 12px; }
      .detail-grid { grid-template-columns: 1fr 1fr; padding: 14px 12px; gap: 14px; }
      .actions { flex-direction: column; }
    }
  `]
})
export class OfferComponent {
  appId = '1';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.appId = this.route.snapshot.paramMap.get('id') || '1';
  }

  go(path: string) { this.router.navigateByUrl(path); }
}
