import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { BackLinkComponent } from '../../shared/components/back-link/back-link.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule, NavComponent, BackLinkComponent, ButtonComponent, CardComponent],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link [to]="'/application/' + appId + '/status'" label="Back to Application Status"></app-back-link>

        <!-- Header -->
        <div class="header">
          <div class="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h1 class="title">Financing Term-sheet</h1>
          <p class="subtitle">Al Noor Residential &middot; Al Omran Real Estate</p>
        </div>

        <!-- Term-sheet Card -->
        <app-card [padding]="0">
          <div class="card-inner">
            <!-- Top highlight row -->
            <div class="highlight-grid">
              <div class="highlight-cell" [style.background]="'${C.greenLt}'">
                <span class="highlight-label">Amount</span>
                <span class="highlight-value" [style.color]="'${C.green}'">21M SAR</span>
              </div>
              <div class="highlight-cell" [style.background]="'${C.g50}'">
                <span class="highlight-label">Return</span>
                <span class="highlight-value" [style.color]="'${C.g800}'">8.5%</span>
              </div>
            </div>

            <!-- Detail grid -->
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Product</span>
                <span class="detail-value">Development</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tenor</span>
                <span class="detail-value">24 months</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Structure</span>
                <span class="detail-value">Murabaha</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Disbursement</span>
                <span class="detail-value">Milestone</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Grace</span>
                <span class="detail-value">6 months</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Repayment</span>
                <span class="detail-value">Quarterly</span>
              </div>
            </div>
          </div>
        </app-card>

        <!-- Warning card -->
        <div class="warning-card">
          <div class="warning-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div>
              <span class="warning-title">Valid for 14 days</span>
              <span class="warning-sub">Respond by March 23, 2026</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions">
          <app-btn variant="dangerOutline" size="lg" (clicked)="go('/application/1/declined')">Decline</app-btn>
          <app-btn variant="primary" size="lg" (clicked)="go('/application/1/accepted')">Accept Term-sheet &rarr;</app-btn>
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

    .warning-card {
      margin-top: 16px;
      background: ${C.amber50};
      border: 1px solid ${C.amber100};
      border-radius: 12px;
      padding: 16px 20px;
    }

    .warning-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .warning-title {
      font-size: 14px;
      font-weight: 700;
      color: ${C.amber600};
      display: block;
    }

    .warning-sub {
      font-size: 13px;
      color: ${C.g500};
      display: block;
      margin-top: 2px;
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 28px;
      justify-content: center;
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
