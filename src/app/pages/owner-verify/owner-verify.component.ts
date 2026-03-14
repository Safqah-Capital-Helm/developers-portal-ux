import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import {
  LogoComponent,
  ButtonComponent,
  CardComponent,
  InputComponent,
  BadgeComponent,
  TranslatePipe,
  I18nService,
} from '../../shared';

type Step = 'intro' | 'id' | 'otp' | 'verifying' | 'grant' | 'done';

@Component({
  selector: 'app-owner-verify',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LogoComponent,
    ButtonComponent,
    CardComponent,
    InputComponent,
    BadgeComponent,
    TranslatePipe,
  ],
  template: `
    <div class="page">

      <!-- Header bar -->
      <div class="header-bar">
        <div class="header-inner">
          <app-logo [size]="32"></app-logo>
          <span class="header-text">{{ 'owner_verify.title' | t }}</span>
        </div>
      </div>

      <div class="container">

        <!-- ===== STEP: intro ===== -->
        <div *ngIf="step === 'intro'" class="animate-in">

          <!-- Shield icon -->
          <div class="icon-center">
            <div class="icon-circle icon-circle-lg green-gradient green-border">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
          </div>

          <div class="text-center" style="margin-bottom: 24px;">
            <h1 class="page-title">{{ 'owner_verify.auth_requested' | t:{name: requester.name} }}</h1>
            <p class="page-subtitle">{{ 'owner_verify.subtitle' | t }}</p>
          </div>

          <!-- Request Details card -->
          <app-card [padding]="24">
            <div class="card-label">{{ 'owner_verify.request_details' | t }}</div>

            <!-- Requester row -->
            <div class="requester-row">
              <div class="avatar-circle" [style.background]="C.greenLt" [style.color]="C.green">A</div>
              <div class="requester-info">
                <div class="requester-name">{{ requester.name }}</div>
                <div class="requester-meta">{{ 'owner_verify.nid_label' | t }} {{ requester.id }} &middot; {{ requester.phone }}</div>
              </div>
            </div>

            <p class="request-desc" [innerHTML]="'owner_verify.request_desc' | t"></p>

            <!-- Company info box -->
            <div class="company-box">
              <div class="company-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e90fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18"/>
                  <path d="M9 21V9"/>
                </svg>
              </div>
              <div>
                <div class="company-name">{{ company.name }}</div>
                <div class="company-cr">{{ 'common.cr_prefix' | t }} {{ company.cr }}</div>
              </div>
            </div>
          </app-card>

          <!-- Warning card -->
          <div class="warning-card" style="margin-top: 16px;">
            <div class="warning-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc6803" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <div class="warning-title">{{ 'owner_verify.what_this_means' | t }}</div>
              <div class="warning-desc">{{ 'owner_verify.what_this_means_desc' | t }}</div>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <app-btn variant="primary" [full]="true" size="lg" (clicked)="step = 'id'">
              {{ 'owner_verify.verify_btn' | t }} <span class="dir-arrow">&rarr;</span>
            </app-btn>
          </div>
          <p class="text-center footer-note">{{ 'owner_verify.not_right_person' | t }} <span class="link">{{ 'owner_verify.contact_support' | t }}</span></p>
        </div>

        <!-- ===== STEP: id ===== -->
        <div *ngIf="step === 'id'" class="animate-in">

          <div class="icon-center">
            <div class="icon-circle icon-circle-md green-gradient green-border">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
          </div>

          <div class="text-center" style="margin-bottom: 24px;">
            <h2 class="page-title-sm">{{ 'owner_verify.verify_btn' | t }}</h2>
            <p class="page-subtitle">{{ 'owner_verify.subtitle' | t }}</p>
          </div>

          <app-card [padding]="28">
            <app-input
              [label]="'owner_verify.nid_input_label' | t"
              [placeholder]="'owner_verify.nid_placeholder' | t"
              [value]="nid"
              (valueChange)="nid = $event"
              inputmode="numeric"
              [maxlength]="10"
              mask="digits"
              [error]="nid.length > 0 && nid.length < 10 ? i18n.t('validation.nid_format') : ''"
            ></app-input>
            <app-btn variant="primary" [full]="true" size="lg" [disabled]="nid.length < 10" (clicked)="step = 'otp'">
              {{ 'common.next' | t }}
            </app-btn>
            <p class="text-center back-link" (click)="step = 'intro'"><span class="dir-arrow">&larr;</span> {{ 'common.back' | t }}</p>
          </app-card>
        </div>

        <!-- ===== STEP: otp ===== -->
        <div *ngIf="step === 'otp'" class="animate-in">

          <div class="icon-center">
            <div class="icon-circle icon-circle-md green-gradient green-border">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
          </div>

          <div class="text-center" style="margin-bottom: 24px;">
            <h2 class="page-title-sm">{{ 'absher.otp_title' | t }}</h2>
            <p class="page-subtitle">{{ 'absher.otp_subtitle' | t }}</p>
          </div>

          <app-card [padding]="28">
            <app-input
              [label]="'owner_verify.otp_label' | t"
              [placeholder]="'owner_verify.otp_placeholder' | t"
              [helper]="'owner_verify.otp_helper' | t"
              [value]="otp"
              (valueChange)="otp = $event"
              inputmode="numeric"
              [maxlength]="6"
              mask="digits"
            ></app-input>
            <app-btn variant="primary" [full]="true" size="lg" [disabled]="otp.length < 4" (clicked)="onOtpConfirm()">
              {{ 'common.confirm' | t }}
            </app-btn>
          </app-card>
        </div>

        <!-- ===== STEP: verifying ===== -->
        <div *ngIf="step === 'verifying'" class="animate-in">
          <app-card [padding]="40">
            <div class="text-center">
              <div class="spinner"></div>
              <p class="verifying-text">{{ 'absher.verifying' | t }}</p>
            </div>
          </app-card>
        </div>

        <!-- ===== STEP: grant ===== -->
        <div *ngIf="step === 'grant'" class="animate-in">

          <div class="icon-center">
            <div class="check-circle-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>

          <div class="text-center" style="margin-bottom: 24px;">
            <h2 class="page-title-sm">{{ 'owner_verify.success_title' | t }}</h2>
            <p class="page-subtitle">{{ 'owner_verify.success_desc' | t }}</p>
          </div>

          <app-card [padding]="24">
            <div class="card-label">{{ 'owner_verify.grant_access_to' | t }}</div>

            <!-- Requester gray box -->
            <div class="grant-requester-box">
              <div class="avatar-circle avatar-sm" [style.background]="C.greenLt" [style.color]="C.green">A</div>
              <div>
                <div class="grant-name">{{ requester.name }}</div>
                <div class="grant-id">{{ 'owner_verify.nid_label' | t }} {{ requester.id }}</div>
              </div>
            </div>

            <!-- Blue info box -->
            <div class="grant-access-box">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e90fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span class="grant-access-title">{{ 'owner_verify.admin_access' | t }}</span>
              </div>
              <p class="grant-access-desc">{{ 'owner_verify.admin_access_desc' | t }}</p>
            </div>

            <div style="margin-top: 20px;">
              <app-btn variant="primary" [full]="true" size="lg" (clicked)="step = 'done'">
                {{ 'common.confirm' | t }} <span class="dir-arrow">&rarr;</span>
              </app-btn>
            </div>
          </app-card>
        </div>

        <!-- ===== STEP: done ===== -->
        <div *ngIf="step === 'done'" class="animate-in">

          <div class="icon-center">
            <div class="done-check-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>

          <div class="text-center" style="margin-bottom: 24px;">
            <h1 class="page-title">{{ 'owner_verify.success_title' | t }}</h1>
            <p class="page-subtitle" [innerHTML]="requester.name + ' ' + ('owner_verify.now_has_admin' | t) + ' ' + company.name + '.'"></p>
          </div>

          <app-card [padding]="24">
            <!-- Status row: requester -->
            <div class="status-row">
              <div class="status-row-left">
                <div class="avatar-circle avatar-sm" [style.background]="C.greenLt" [style.color]="C.green">A</div>
                <span class="status-row-name">{{ requester.name }}</span>
              </div>
              <app-badge color="green">{{ 'owner_verify.badge_admin' | t }}</app-badge>
            </div>

            <div class="status-divider"></div>

            <!-- Status row: company -->
            <div class="status-row">
              <div class="status-row-left">
                <div class="company-icon-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                  </svg>
                </div>
                <span class="status-row-name">{{ company.name }}</span>
              </div>
              <app-badge color="green">{{ 'owner_verify.badge_verified' | t }}</app-badge>
            </div>
          </app-card>

          <div style="margin-top: 24px;">
            <app-btn variant="primary" [full]="true" size="lg" (clicked)="goToCompanyVerify()">
              {{ 'owner_verify.complete_verify_btn' | t }}
            </app-btn>
          </div>
          <div style="margin-top: 12px;">
            <app-btn variant="secondary" [full]="true" size="md" (clicked)="go('/dashboard')">
              <span class="dir-arrow">&larr;</span> {{ 'common.back' | t }}
            </app-btn>
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

    /* ---- Header ---- */
    .header-bar {
      border-bottom: 1px solid ${C.g200};
      background: ${C.white};
    }
    .header-inner {
      max-width: 520px;
      margin: 0 auto;
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-text {
      font-size: 13px;
      font-weight: 600;
      color: ${C.g500};
    }

    /* ---- Container ---- */
    .container {
      max-width: 520px;
      margin: 0 auto;
      padding: 40px 24px 60px;
    }

    /* ---- Animations ---- */
    .animate-in {
      animation: fadeUp 0.35s ease-out both;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ---- Icons ---- */
    .icon-center {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    .icon-circle {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-circle-lg {
      width: 64px;
      height: 64px;
    }
    .icon-circle-md {
      width: 52px;
      height: 52px;
    }
    .green-gradient {
      background: linear-gradient(135deg, ${C.green}, ${C.greenDk});
    }
    .green-border {
      border: 3px solid ${C.greenMd};
    }

    .check-circle-icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: ${C.green};
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .done-check-circle {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${C.green}, ${C.greenDk});
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 161, 90, 0.25);
    }

    /* ---- Typography ---- */
    .page-title {
      font-size: 24px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 8px;
    }
    .page-title-sm {
      font-size: 20px;
      font-weight: 800;
      color: ${C.g900};
      margin: 0 0 8px;
    }
    .page-subtitle {
      font-size: 14px;
      color: ${C.g500};
      line-height: 1.6;
      margin: 0;
    }
    .text-center { text-align: center; }

    /* ---- Card label ---- */
    .card-label {
      font-size: 11px;
      font-weight: 700;
      color: ${C.g400};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    /* ---- Requester row ---- */
    .requester-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }
    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .avatar-sm {
      width: 32px;
      height: 32px;
      font-size: 13px;
    }
    .requester-name {
      font-size: 15px;
      font-weight: 700;
      color: ${C.g900};
    }
    .requester-meta {
      font-size: 12px;
      color: ${C.g400};
      margin-top: 2px;
    }

    .request-desc {
      font-size: 14px;
      color: ${C.g600};
      line-height: 1.6;
      margin: 0 0 16px;
    }

    /* ---- Company box ---- */
    .company-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: ${C.blue50};
      border-radius: 10px;
      padding: 12px 14px;
    }
    .company-icon-wrap {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: ${C.blue100};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .company-name {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g900};
    }
    .company-cr {
      font-size: 12px;
      color: ${C.g400};
      margin-top: 2px;
    }

    /* ---- Warning card ---- */
    .warning-card {
      display: flex;
      gap: 12px;
      background: ${C.amber50};
      border: 1px solid ${C.amber100};
      border-radius: 12px;
      padding: 16px;
    }
    .warning-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: ${C.amber100};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .warning-title {
      font-size: 13px;
      font-weight: 700;
      color: ${C.amber600};
      margin-bottom: 4px;
    }
    .warning-desc {
      font-size: 13px;
      color: ${C.g600};
      line-height: 1.55;
    }

    /* ---- Footer / link ---- */
    .footer-note {
      font-size: 12px;
      color: ${C.g400};
      margin-top: 16px;
    }
    .link {
      color: ${C.green};
      cursor: pointer;
      font-weight: 600;
    }
    .link:hover { text-decoration: underline; }

    .back-link {
      font-size: 13px;
      color: ${C.g400};
      margin-top: 16px;
      cursor: pointer;
      font-weight: 600;
    }
    .back-link:hover { color: ${C.g600}; }

    /* ---- Verifying spinner ---- */
    .spinner {
      width: 44px;
      height: 44px;
      border: 4px solid ${C.g200};
      border-top: 4px solid ${C.green};
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .verifying-text {
      font-size: 14px;
      color: ${C.g500};
      font-weight: 600;
      margin: 0;
    }

    /* ---- Grant step ---- */
    .grant-requester-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: ${C.g50};
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    .grant-name {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g900};
    }
    .grant-id {
      font-size: 12px;
      color: ${C.g400};
      margin-top: 2px;
    }
    .grant-access-box {
      background: ${C.blue50};
      border-radius: 10px;
      padding: 14px;
    }
    .grant-access-title {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g900};
    }
    .grant-access-desc {
      font-size: 13px;
      color: ${C.g600};
      line-height: 1.55;
      margin: 0;
    }

    /* ---- Done step status rows ---- */
    .status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
    }
    .status-row-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .status-row-name {
      font-size: 14px;
      font-weight: 600;
      color: ${C.g900};
    }
    .status-divider {
      height: 1px;
      background: ${C.g200};
      margin: 4px 0;
    }
    .company-icon-sm {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: ${C.g100};
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .container { padding: 28px 16px 40px; }
    }
    @media (max-width: 480px) {
      .container { padding: 20px 12px 32px; }
      .page-title { font-size: 20px; }
    }
  `]
})
export class OwnerVerifyComponent implements OnDestroy {
  readonly C = C;

  step: Step = 'intro';
  nid = '';
  otp = '';

  requester = { name: 'Ahmed Al-Salem', id: '106*******', phone: '+966 50 *** 4567' };
  company = { name: 'Al Omran Real Estate Dev Co.', cr: '1551515151516515' };

  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor(private router: Router, public i18n: I18nService) {}

  ngOnDestroy(): void {
    this.timers.forEach(t => clearTimeout(t));
  }

  onOtpConfirm(): void {
    this.step = 'verifying';
    const t = setTimeout(() => {
      this.step = 'grant';
    }, 2000);
    this.timers.push(t);
  }

  goToCompanyVerify(): void {
    this.router.navigate(['/onboarding/company-verify'], { queryParams: { from: 'owner-verify' } });
  }

  go(path: string): void {
    this.router.navigateByUrl(path);
  }
}
