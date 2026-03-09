import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  CardComponent,
  InputComponent,
  BadgeComponent,
  ProgressStepsComponent,
} from '../../shared';

type Step =
  | 'cr'
  | 'crVerifying'
  | 'verify'
  | 'otp'
  | 'checking'
  | 'ownerFail'
  | 'delegate'
  | 'smsSent'
  | 'pending'
  | 'details'
  | 'success';

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavComponent,
    BackLinkComponent,
    ButtonComponent,
    CardComponent,
    InputComponent,
    BadgeComponent,
    ProgressStepsComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard" label="Back to Dashboard"></app-back-link>

        <!-- Title -->
        <h1 class="page-title">{{ title }}</h1>

        <!-- Progress Steps -->
        <app-progress-steps
          *ngIf="showProgress"
          [steps]="progressSteps"
          [current]="progressCurrent"
        ></app-progress-steps>

        <!-- ═══════ Step: cr ═══════ -->
        <div *ngIf="step === 'cr' || step === 'crVerifying'">
          <app-card [padding]="32">
            <div class="text-center" style="margin-bottom: 20px;">
              <div class="icon-circle green-gradient" style="width: 56px; height: 56px; margin: 0 auto 16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="18" rx="2"/>
                  <line x1="8" y1="8" x2="16" y2="8"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="8" y1="16" x2="12" y2="16"/>
                </svg>
              </div>
              <h2 class="card-title">Company verification</h2>
              <p class="card-desc">We'll verify eligibility from the commercial registry.</p>
            </div>

            <div class="cr-input-row">
              <div class="cr-prefix">CR</div>
              <input
                class="cr-field"
                [class.cr-error]="crRes === 'bad'"
                placeholder="Enter CR number"
                [(ngModel)]="cr"
                [disabled]="step === 'crVerifying'"
              />
            </div>

            <!-- Error state -->
            <div *ngIf="crRes === 'bad'" class="error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f04438" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              CR not found or not eligible for registration.
            </div>

            <!-- Verifying spinner -->
            <div *ngIf="step === 'crVerifying'" class="text-center" style="margin-top: 20px;">
              <div class="spinner" style="margin: 0 auto 10px;"></div>
              <p class="spinner-text">Verifying CR {{ cr }}...</p>
            </div>

            <div *ngIf="step === 'cr'" style="margin-top: 20px;">
              <app-btn variant="primary" [full]="true" size="lg" [disabled]="cr.length < 5" (clicked)="onCrSubmit()">
                Verify CR
              </app-btn>
            </div>
          </app-card>
        </div>

        <!-- ═══════ Step: verify / otp ═══════ -->
        <div *ngIf="step === 'verify' || step === 'otp'">
          <div style="margin-bottom: 20px;">
            <app-badge color="green">CR {{ cr }} verified &mdash; eligible for registration</app-badge>
          </div>

          <app-card [padding]="32">
            <div class="text-center" style="margin-bottom: 20px;">
              <div class="icon-circle green-gradient" style="width: 56px; height: 56px; margin: 0 auto 16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              </div>
              <h2 class="card-title">Verify your identity</h2>
            </div>

            <!-- verify: National ID input -->
            <div *ngIf="step === 'verify'">
              <app-input
                label="National ID / Iqama Number"
                placeholder="Enter your 10-digit ID"
                [value]="nid"
                (valueChange)="nid = $event"
                helper="Use an ID starting with '200' to test owner-not-found flow."
              ></app-input>
              <app-btn variant="primary" [full]="true" size="lg" [disabled]="nid.length < 10" (clicked)="step = 'otp'">
                Send Verification Code
              </app-btn>
            </div>

            <!-- otp: verification code input -->
            <div *ngIf="step === 'otp'">
              <div class="nid-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span>National ID: {{ nid }}</span>
              </div>
              <app-input
                label="Verification Code"
                placeholder="Enter 6-digit code"
                [value]="otp"
                (valueChange)="otp = $event"
                helper="Check your registered mobile for the code."
              ></app-input>
              <app-btn variant="primary" [full]="true" size="lg" [disabled]="otp.length < 4" (clicked)="onOtpConfirm()">
                Confirm
              </app-btn>
            </div>
          </app-card>

          <p class="form-footer">
            <span class="link" (click)="step = 'cr'; crRes = ''">Back to CR entry</span>
          </p>
        </div>

        <!-- ═══════ Step: checking ═══════ -->
        <div *ngIf="step === 'checking'">
          <app-card [padding]="48">
            <div class="text-center">
              <div class="spinner" style="margin: 0 auto 16px;"></div>
              <p class="spinner-text">Verifying ownership...</p>
            </div>
          </app-card>
        </div>

        <!-- ═══════ Step: ownerFail ═══════ -->
        <div *ngIf="step === 'ownerFail'">
          <app-card [padding]="32">
            <div class="text-center" style="margin-bottom: 20px;">
              <div class="icon-circle red-gradient" style="width: 56px; height: 56px; margin: 0 auto 16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </div>
              <h2 class="card-title">Not a registered owner</h2>
              <p class="card-desc" style="margin-top: 4px;">
                ID {{ nid.substring(0, 3) }}****{{ nid.substring(nid.length - 3) }} is not listed as an owner of CR {{ cr }}.
              </p>
            </div>

            <app-btn variant="primary" [full]="true" size="lg" (clicked)="step = 'delegate'">
              Request Owner Authorization &rarr;
            </app-btn>

            <div style="display: flex; gap: 10px; margin-top: 12px;">
              <app-btn variant="ghost" [full]="true" size="md" (clicked)="go('/dashboard')">Dashboard</app-btn>
              <app-btn variant="ghost" [full]="true" size="md" (clicked)="go('/support')">Support</app-btn>
            </div>
          </app-card>
        </div>

        <!-- ═══════ Step: delegate ═══════ -->
        <div *ngIf="step === 'delegate'">
          <app-card [padding]="32">
            <h2 class="card-title" style="margin-bottom: 16px;">Share verification link</h2>

            <div class="share-link-box">
              <span class="share-link-text">{{ shareLink }}</span>
              <button class="copy-btn" (click)="copyLink()">{{ copied ? 'Copied!' : 'Copy' }}</button>
            </div>

            <div class="divider-row">
              <div class="divider-line"></div>
              <span class="divider-text">or send via SMS</span>
              <div class="divider-line"></div>
            </div>

            <app-input
              label="Owner's mobile number"
              placeholder="+966 5x xxx xxxx"
              [value]="ownerPhone"
              (valueChange)="ownerPhone = $event"
            ></app-input>
            <app-btn variant="primary" [full]="true" size="lg" [disabled]="ownerPhone.length < 10" (clicked)="sendSms()">
              Send SMS
            </app-btn>
          </app-card>

          <p class="form-footer">
            <span class="link" (click)="step = 'ownerFail'">Back</span>
          </p>
        </div>

        <!-- ═══════ Step: smsSent ═══════ -->
        <div *ngIf="step === 'smsSent'">
          <app-card [padding]="40">
            <div class="text-center">
              <div class="sms-sent-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p [style.color]="C.g900" [style.font-weight]="700" [style.font-size.px]="17" [style.margin-bottom.px]="6">Link sent!</p>
              <p [style.color]="C.g500" [style.font-size.px]="14">Verification link sent to {{ ownerPhone }}</p>
            </div>
          </app-card>
        </div>

        <!-- ═══════ Step: pending ═══════ -->
        <div *ngIf="step === 'pending'">
          <div class="text-center" style="margin-bottom: 24px;">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>

          <app-card [padding]="32">
            <div class="text-center">
              <app-badge color="amber">Pending owner verification</app-badge>
              <p [style.color]="C.g600" [style.font-size.px]="14" [style.line-height]="'1.6'" [style.margin-top.px]="16">
                We are waiting for the company owner to complete identity verification. You will be notified once it's done.
              </p>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 24px;">
              <app-btn variant="secondary" [full]="true" size="md" (clicked)="step = 'delegate'">
                Resend / Change
              </app-btn>
              <app-btn variant="primary" [full]="true" size="md" (clicked)="go('/verify/owner/abc123')">
                Demo: Owner View &rarr;
              </app-btn>
            </div>
          </app-card>

          <p class="form-footer" style="margin-top: 20px;">
            <span class="link" (click)="go('/dashboard')">Back to Dashboard</span>
          </p>
        </div>

        <!-- ═══════ Step: details ═══════ -->
        <div *ngIf="step === 'details'">
          <!-- Company info badge bar -->
          <div class="details-badge-bar">
            <div>
              <app-badge color="green">CR {{ cr || '1020304050607' }} &mdash; Al Jazeera Development Co.</app-badge>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <app-badge color="green">Eligible</app-badge>
              <app-badge color="green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Owner verified
              </app-badge>
            </div>
          </div>

          <!-- Company Details card -->
          <app-card [padding]="32">
            <h2 class="card-title" style="margin-bottom: 20px;">Company Details</h2>
            <div class="details-grid">
              <div class="detail-item" *ngFor="let f of companyFields">
                <div class="detail-label">{{ f[0] }}</div>
                <div class="detail-value">
                  {{ f[1] }}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; flex-shrink: 0;">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Website (optional) -->
            <div style="margin-top: 20px;">
              <app-input
                label="Company Website (optional)"
                placeholder="https://example.com"
                [value]="website"
                (valueChange)="website = $event"
              ></app-input>
            </div>
          </app-card>

          <!-- Credit Bureau Authorization -->
          <app-card [padding]="28" style="margin-top: 16px;">
            <div class="consent-card">
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <input
                  type="checkbox"
                  class="consent-checkbox"
                  [checked]="consent"
                  (change)="consent = !consent"
                />
                <div>
                  <p [style.font-size.px]="14" [style.font-weight]="700" [style.color]="C.g900" [style.margin-bottom.px]="4">
                    Credit Bureau Authorization
                  </p>
                  <p [style.font-size.px]="13" [style.color]="C.g500" [style.line-height]="'1.5'">
                    I authorize Safqah to obtain the company's credit report from SIMAH (Saudi Credit Bureau) for the purpose of evaluating financing eligibility.
                  </p>
                </div>
              </div>
            </div>
          </app-card>

          <div style="margin-top: 24px;">
            <app-btn variant="primary" [full]="true" size="lg" [disabled]="!consent" (clicked)="onRegister()">
              Confirm &amp; Register Company &rarr;
            </app-btn>
          </div>
        </div>

        <!-- ═══════ Step: success ═══════ -->
        <div *ngIf="step === 'success'">
          <app-card [padding]="40">
            <div class="text-center">
              <div class="success-circle">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 class="card-title" style="font-size: 20px;">Company registered!</h2>
              <p class="card-desc">Al Jazeera Development Co. has been submitted for review.</p>
            </div>
          </app-card>

          <!-- Company status card -->
          <app-card [padding]="24" style="margin-top: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <p [style.font-size.px]="15" [style.font-weight]="700" [style.color]="C.g900">Al Jazeera Development Co.</p>
                <p [style.font-size.px]="13" [style.color]="C.g500" [style.margin-top.px]="2">CR {{ cr || '1020304050607' }}</p>
              </div>
              <app-badge color="amber">Under Review</app-badge>
            </div>
          </app-card>

          <div style="display: flex; gap: 12px; margin-top: 24px;">
            <app-btn variant="secondary" [full]="true" size="lg" (clicked)="go('/dashboard')">
              &larr; Dashboard
            </app-btn>
            <app-btn variant="primary" [full]="true" size="lg" (clicked)="go('/add-project')">
              Add a Project &rarr;
            </app-btn>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page {
      background: ${C.bg};
      min-height: 100vh;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 32px 32px 60px;
    }

    .page-title {
      font-size: 22px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 20px 0;
    }

    .text-center { text-align: center; }

    .card-title {
      font-size: 17px;
      font-weight: 800;
      color: ${C.g900};
      margin: 0 0 6px 0;
    }

    .card-desc {
      font-size: 14px;
      color: ${C.g500};
      line-height: 1.5;
      margin: 0;
    }

    /* Green / Red gradient circles */
    .icon-circle {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .green-gradient {
      background: linear-gradient(135deg, ${C.green}, ${C.greenDk});
    }

    .red-gradient {
      background: linear-gradient(135deg, ${C.red500}, #d92d20);
    }

    /* CR input */
    .cr-input-row {
      display: flex;
      align-items: center;
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      overflow: hidden;
      background: ${C.white};
    }

    .cr-input-row:has(.cr-error) {
      border-color: ${C.red500};
    }

    .cr-prefix {
      padding: 12px 14px;
      background: ${C.g50};
      border-right: 1.5px solid ${C.g200};
      font-size: 14px;
      font-weight: 800;
      color: ${C.g600};
      font-family: 'SF Mono', 'Fira Code', monospace;
      white-space: nowrap;
    }

    .cr-field {
      flex: 1;
      padding: 12px 14px;
      border: none;
      outline: none;
      font-size: 14px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      color: ${C.g900};
      background: transparent;
      letter-spacing: 0.5px;
    }

    .cr-field::placeholder {
      font-family: inherit;
      color: ${C.g400};
    }

    .cr-error {
      color: ${C.red500};
    }

    .error-box {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding: 10px 14px;
      background: ${C.red50};
      border: 1px solid ${C.red500};
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      color: ${C.red500};
    }

    /* NID info row */
    .nid-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: ${C.g50};
      border: 1px solid ${C.g200};
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      color: ${C.g600};
      margin-bottom: 16px;
    }

    /* Spinner */
    .spinner {
      width: 28px;
      height: 28px;
      border: 3px solid ${C.g200};
      border-top-color: ${C.green};
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .spinner-text {
      font-size: 14px;
      color: ${C.g500};
      font-weight: 600;
    }

    /* Share link */
    .share-link-box {
      display: flex;
      align-items: center;
      background: ${C.white};
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      padding: 10px 14px;
      gap: 10px;
    }

    .share-link-text {
      flex: 1;
      font-size: 12px;
      color: ${C.g500};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .copy-btn {
      background: ${C.green};
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      white-space: nowrap;
    }

    /* Divider */
    .divider-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 20px 0;
    }

    .divider-line {
      flex: 1;
      height: 1px;
      background: ${C.g200};
    }

    .divider-text {
      font-size: 12px;
      color: ${C.g400};
      white-space: nowrap;
    }

    /* SMS sent icon */
    .sms-sent-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${C.greenLt};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    /* Details grid */
    .details-badge-bar {
      margin-bottom: 20px;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .detail-item {
      min-width: 0;
    }

    .detail-label {
      font-size: 11px;
      font-weight: 600;
      color: ${C.g400};
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .detail-value {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g900};
      display: flex;
      align-items: center;
    }

    /* Consent card */
    .consent-card {
      background: ${C.blue50};
      border-radius: 12px;
      padding: 16px;
    }

    .consent-checkbox {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      accent-color: ${C.green};
      cursor: pointer;
      flex-shrink: 0;
    }

    /* Success circle */
    .success-circle {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${C.green}, ${C.greenDk});
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    /* Footer link */
    .form-footer {
      text-align: center;
      font-size: 13px;
      color: ${C.g400};
      margin-top: 16px;
    }

    .link {
      color: ${C.green};
      cursor: pointer;
      font-weight: 600;
    }

    .link:hover {
      text-decoration: underline;
    }
  `]
})
export class AddCompanyComponent implements OnDestroy {
  readonly C = C;

  step: Step = 'cr';
  cr = '';
  crRes = '';
  nid = '1063622662';
  otp = '';
  ownerPhone = '';
  copied = false;
  website = '';
  consent = false;

  shareLink = 'https://portal.safqah.com/verify/owner/def456';

  progressSteps = ['Verify CR', 'Verify ownership', 'Review & register'];

  companyFields: string[][] = [
    ['Legal Name (EN)', 'Al Jazeera Development Co.'],
    ['Legal Name (AR)', '\u0634\u0631\u0643\u0629 \u0627\u0644\u062c\u0632\u064a\u0631\u0629 \u0644\u0644\u062a\u0637\u0648\u064a\u0631'],
    ['CR Number', ''],
    ['Legal Form', 'LLC'],
    ['Status', 'Active'],
    ['Capital', '30M SAR'],
    ['Company Size', 'Small'],
    ['Activity Type', 'RE Development'],
    ['Unified No.', '7009876543'],
  ];

  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor(private router: Router) {}

  ngOnDestroy(): void {
    this.timers.forEach(t => clearTimeout(t));
  }

  get title(): string {
    switch (this.step) {
      case 'cr':
      case 'crVerifying':
        return 'Register a New Company';
      case 'verify':
      case 'otp':
        return 'Verify Ownership';
      case 'checking':
        return 'Checking Ownership';
      case 'ownerFail':
        return 'Owner Verification Failed';
      case 'delegate':
        return 'Request Authorization';
      case 'smsSent':
        return 'SMS Sent';
      case 'pending':
        return 'Waiting for owner verification';
      case 'details':
        return 'Review & Register';
      case 'success':
        return 'Registration Complete';
      default:
        return '';
    }
  }

  get showProgress(): boolean {
    return !['ownerFail', 'delegate', 'smsSent', 'pending'].includes(this.step);
  }

  get progressCurrent(): number {
    if (this.step === 'cr' || this.step === 'crVerifying') return 0;
    if (this.step === 'verify' || this.step === 'otp' || this.step === 'checking') return 1;
    if (this.step === 'details') return 2;
    if (this.step === 'success') return 3;
    return 0;
  }

  get crField(): string {
    return this.cr || '1020304050607';
  }

  onCrSubmit(): void {
    this.crRes = '';
    this.step = 'crVerifying';
    const t = setTimeout(() => {
      if (this.cr.startsWith('999')) {
        this.crRes = 'bad';
        this.step = 'cr';
      } else {
        this.step = 'verify';
      }
    }, 1500);
    this.timers.push(t);
  }

  onOtpConfirm(): void {
    this.step = 'checking';
    const t = setTimeout(() => {
      if (this.nid.startsWith('200')) {
        this.step = 'ownerFail';
      } else {
        // Update CR Number in companyFields
        this.companyFields[2][1] = this.cr || '1020304050607';
        this.step = 'details';
      }
    }, 1500);
    this.timers.push(t);
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.shareLink);
    this.copied = true;
    const t = setTimeout(() => { this.copied = false; }, 2000);
    this.timers.push(t);
  }

  sendSms(): void {
    this.step = 'smsSent';
    const t = setTimeout(() => { this.step = 'pending'; }, 2000);
    this.timers.push(t);
  }

  onRegister(): void {
    this.step = 'success';
  }

  go(path: string): void {
    this.router.navigateByUrl(path);
  }
}
