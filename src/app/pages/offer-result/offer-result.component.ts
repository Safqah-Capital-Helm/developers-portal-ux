import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { BackLinkComponent } from '../../shared/components/back-link/back-link.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-offer-result',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent, BackLinkComponent, ButtonComponent, CardComponent, BadgeComponent],
  template: `
    <!-- ===== ACCEPTED STATE ===== -->
    <div class="page" *ngIf="accepted">
      <app-nav></app-nav>
      <div class="container-accepted">
        <div class="center-content">
          <div class="check-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 class="result-title">Term-sheet accepted!</h1>
          <p class="result-sub">Our team will contact you within 24 hours to begin the signing process.</p>

          <app-card [padding]="0" class="status-card">
            <div class="status-row">
              <div class="status-left">
                <div class="status-icon project-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
                  </svg>
                </div>
                <span class="status-name">Al Noor Residential</span>
              </div>
              <app-badge color="blue">Pending Signing</app-badge>
            </div>
            <div class="status-divider"></div>
            <div class="status-row">
              <div class="status-left">
                <div class="status-icon company-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
                  </svg>
                </div>
                <span class="status-name">Al Omran Real Estate</span>
              </div>
              <app-badge color="green">Approved</app-badge>
            </div>
          </app-card>

          <div class="btn-group-center">
            <app-btn variant="secondary" size="lg" (clicked)="go('/dashboard')">&larr; Back to Dashboard</app-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== DECLINED STATE ===== -->
    <div class="page" *ngIf="!accepted">
      <app-nav></app-nav>

      <!-- Decline FORM -->
      <div class="container-declined" *ngIf="!submitted">
        <app-back-link [to]="'/application/' + appId + '/term-sheet'" label="Back to Term-sheet"></app-back-link>

        <div class="header-section">
          <div class="x-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${C.red500}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
          <h1 class="result-title">Decline term-sheet</h1>
          <p class="result-sub">Please let us know why so we can improve our offerings.</p>
        </div>

        <app-card [padding]="0">
          <!-- Project info row -->
          <div class="project-info-row">
            <div class="project-info-left">
              <div class="status-icon project-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
                </svg>
              </div>
              <div>
                <span class="project-name">Al Noor Residential</span>
                <span class="project-meta">21M SAR &middot; Development &middot; 24 months &middot; 8.5%</span>
              </div>
            </div>
          </div>

          <div class="reasons-divider"></div>

          <!-- Reason selection -->
          <div class="reasons-section">
            <div
              *ngFor="let r of reasons"
              class="reason-item"
              [class.selected]="reason === r"
              (click)="reason = r"
            >
              <div class="radio-circle" [class.active]="reason === r">
                <div class="radio-dot" *ngIf="reason === r"></div>
              </div>
              <span class="reason-text">{{ r }}</span>
            </div>

            <!-- Other reason textarea -->
            <div class="other-textarea" *ngIf="reason === 'Other reason'">
              <textarea
                class="textarea-field"
                placeholder="Please describe your reason..."
                [(ngModel)]="extra"
                rows="3"
              ></textarea>
            </div>
          </div>
        </app-card>

        <div class="btn-group-spread">
          <app-btn variant="secondary" size="lg" (clicked)="go('/application/1/term-sheet')">&larr; Back to Term-sheet</app-btn>
          <app-btn variant="danger" size="lg" [disabled]="!reason" (clicked)="submitted = true">Confirm Decline</app-btn>
        </div>
      </div>

      <!-- Decline SUBMITTED -->
      <div class="container-accepted" *ngIf="submitted">
        <div class="center-content">
          <div class="red-result-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
            </svg>
          </div>
          <h1 class="result-title">Term-sheet declined</h1>
          <p class="result-sub">Your feedback has been recorded. You can contact our support team if you change your mind.</p>

          <app-card [padding]="0" class="status-card">
            <div class="status-row">
              <div class="status-left">
                <div class="status-icon project-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
                  </svg>
                </div>
                <span class="status-name">Al Noor Residential</span>
              </div>
              <app-badge color="red">Declined</app-badge>
            </div>
            <div class="status-divider"></div>
            <div class="status-row">
              <div class="status-left">
                <div class="status-icon company-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
                  </svg>
                </div>
                <span class="status-name">Al Omran Real Estate</span>
              </div>
              <app-badge color="green">Approved</app-badge>
            </div>
            <div class="status-divider"></div>
            <div class="reason-display">
              <span class="reason-label">Reason</span>
              <span class="reason-value">{{ reason }}{{ reason === 'Other reason' && extra ? ': ' + extra : '' }}</span>
            </div>
          </app-card>

          <div class="btn-group-center two-btns">
            <app-btn variant="secondary" size="lg" (clicked)="go('/dashboard')">&larr; Back to Dashboard</app-btn>
            <app-btn variant="primary" size="lg" (clicked)="go('/support')">Contact Support</app-btn>
          </div>
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

    /* ===== Accepted / Submitted result layout ===== */
    .container-accepted {
      max-width: 480px;
      margin: 0 auto;
      padding: 60px 32px 32px;
    }

    .center-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .check-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${C.green};
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      box-shadow: 0 8px 24px rgba(0, 161, 90, 0.25);
    }

    .red-result-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${C.red500};
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      box-shadow: 0 8px 24px rgba(240, 68, 56, 0.25);
    }

    .result-title {
      font-size: 24px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 8px 0;
    }

    .result-sub {
      font-size: 14px;
      color: ${C.g500};
      margin: 0 0 28px 0;
      max-width: 380px;
      line-height: 1.55;
    }

    .status-card {
      width: 100%;
      margin-bottom: 28px;
    }

    .status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
    }

    .status-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .project-icon {
      background: ${C.g100};
    }

    .company-icon {
      background: ${C.g100};
    }

    .status-name {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g800};
    }

    .status-divider {
      height: 1px;
      background: ${C.g200};
      margin: 0 20px;
    }

    .reason-display {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .reason-label {
      font-size: 11px;
      font-weight: 600;
      color: ${C.g400};
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .reason-value {
      font-size: 13px;
      color: ${C.g700};
      line-height: 1.4;
    }

    .btn-group-center {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn-group-center.two-btns {
      width: 100%;
      justify-content: center;
    }

    /* ===== Declined form layout ===== */
    .container-declined {
      max-width: 520px;
      margin: 0 auto;
      padding: 32px;
    }

    .header-section {
      text-align: center;
      margin-bottom: 24px;
    }

    .x-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${C.red50};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .project-info-row {
      display: flex;
      align-items: center;
      padding: 16px 20px;
    }

    .project-info-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .project-name {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g800};
      display: block;
    }

    .project-meta {
      font-size: 12px;
      color: ${C.g400};
      display: block;
      margin-top: 2px;
    }

    .reasons-divider {
      height: 1px;
      background: ${C.g200};
    }

    .reasons-section {
      padding: 8px 0;
    }

    .reason-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      cursor: pointer;
      transition: background 0.15s;
    }

    .reason-item:hover {
      background: ${C.g50};
    }

    .reason-item.selected {
      background: ${C.g50};
    }

    .radio-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid ${C.g300};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: border-color 0.15s;
    }

    .radio-circle.active {
      border-color: ${C.green};
    }

    .radio-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${C.green};
    }

    .reason-text {
      font-size: 14px;
      color: ${C.g700};
    }

    .other-textarea {
      padding: 4px 20px 12px;
    }

    .textarea-field {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      font-size: 14px;
      font-family: inherit;
      color: ${C.g900};
      background: ${C.white};
      outline: none;
      resize: vertical;
      box-sizing: border-box;
    }

    .textarea-field:focus {
      border-color: ${C.green};
    }

    .textarea-field::placeholder {
      color: ${C.g400};
    }

    .btn-group-spread {
      display: flex;
      gap: 12px;
      justify-content: space-between;
      margin-top: 24px;
    }
  `]
})
export class OfferResultComponent implements OnInit {
  accepted = true;
  appId = '1';
  reason = '';
  extra = '';
  submitted = false;

  reasons = [
    'Pricing / return rate is too high',
    'Tenor or repayment terms don\'t work',
    'Found better terms elsewhere',
    'Project plans have changed',
    'Need different financing structure',
    'Other reason',
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.accepted = this.route.snapshot.data['accepted'] ?? true;
    this.appId = this.route.snapshot.paramMap.get('id') || '1';
  }

  go(path: string) { this.router.navigateByUrl(path); }
}
