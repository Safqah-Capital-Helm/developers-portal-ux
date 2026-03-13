import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import {
  LogoComponent,
  ButtonComponent,
  InputComponent,
  ProgressStepsComponent,
  CardComponent,
  TranslatePipe,
  I18nService,
} from '../../shared';

type IdentityStep = 'id' | 'otp' | 'verifying' | 'ownerCheck' | 'ownerFail' | 'delegate' | 'smsSent' | 'pending';

@Component({
  selector: 'app-absher',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LogoComponent,
    ButtonComponent,
    InputComponent,
    ProgressStepsComponent,
    CardComponent,
    TranslatePipe,
  ],
  template: `
    <div class="page">
      <div class="absher-container animate-in">

        <!-- Header bar -->
        <div class="header-bar">
          <app-logo [size]="32"></app-logo>
          <span class="header-right" *ngIf="mode === 'register'" [style.color]="C.g500" [style.font-size.px]="13" [style.font-weight]="600">{{ 'absher.step_of' | t:{current: '' + currentStepDisplay} }}</span>
        </div>

        <!-- Progress steps (register mode only, not on pending) -->
        <app-progress-steps
          *ngIf="mode === 'register' && identityStep !== 'pending'"
          [steps]="progressSteps"
          [current]="progressCurrent"
        ></app-progress-steps>

        <!-- ═══════ IDENTITY PHASE ═══════ -->
        <div *ngIf="phase === 'identity'" class="identity-wrap">

          <!-- Icon header area -->
          <div class="icon-header" *ngIf="showIconHeader">
            <div class="icon-circle" [ngStyle]="iconCircleStyle">
              <!-- Shield check icon (success states) -->
              <svg *ngIf="!isErrorStep" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
              <!-- X icon (error states) -->
              <svg *ngIf="isErrorStep" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
          </div>

          <!-- Title / Subtitle -->
          <div class="text-center" style="margin-bottom: 24px;" *ngIf="identityTitle">
            <h1 class="absher-title">{{ identityTitle }}</h1>
            <p class="absher-subtitle" *ngIf="identitySubtitle">{{ identitySubtitle }}</p>
          </div>

          <!-- Step: id -->
          <div *ngIf="identityStep === 'id'">
            <div class="form-area">
              <app-input
                [label]="'absher.nid_label' | t"
                [placeholder]="'absher.nid_placeholder' | t"
                [value]="nid"
                (valueChange)="nid = $event"
                inputmode="numeric"
                [maxlength]="10"
                mask="digits"
                [error]="nid && nid.length > 0 && !isValidNid(nid) ? i18n.t('validation.nid_format') : ''"
              ></app-input>
              <app-btn variant="primary" [full]="true" size="lg" [disabled]="!isValidNid(nid)" (clicked)="onIdSubmit()">
                {{ 'absher.verify_btn' | t }}
              </app-btn>
            </div>
            <p class="form-footer">
              {{ 'absher.will_redirect' | t }}
            </p>
          </div>

          <!-- Step: otp -->
          <div *ngIf="identityStep === 'otp'">
            <div class="form-area">
              <app-input
                [label]="'absher.otp_label' | t"
                [placeholder]="'absher.otp_placeholder' | t"
                [value]="otp"
                (valueChange)="otp = $event"
                [helper]="'absher.otp_helper' | t"
                inputmode="numeric"
                [maxlength]="6"
                mask="digits"
              ></app-input>
              <app-btn variant="primary" [full]="true" size="lg" [disabled]="otp.length < 4" (clicked)="onOtpConfirm()">
                {{ 'common.confirm' | t }}
              </app-btn>
              <div *ngIf="mode === 'register'" class="demo-bar">
                <button class="demo-advance" (click)="identityStep = 'ownerFail'">{{ 'absher.demo_owner_not_found' | t }} &rarr;</button>
              </div>
            </div>
            <p class="form-footer">
              <span class="link" (click)="identityStep = 'id'">{{ 'absher.back_to_id' | t }}</span>
            </p>
          </div>

          <!-- Step: verifying (spinner) -->
          <div *ngIf="identityStep === 'verifying'" class="text-center" style="padding: 40px 0;">
            <div class="spinner" style="margin: 0 auto 16px;"></div>
            <p [style.color]="C.g500" [style.font-size.px]="14">{{ 'absher.verifying' | t }}</p>
          </div>

          <!-- Step: ownerCheck (spinner) -->
          <div *ngIf="identityStep === 'ownerCheck'" class="text-center" style="padding: 40px 0;">
            <div class="spinner" style="margin: 0 auto 16px;"></div>
            <p [style.color]="C.g500" [style.font-size.px]="14">{{ 'absher.checking_ownership' | t }}</p>
          </div>

          <!-- Step: ownerFail -->
          <div *ngIf="identityStep === 'ownerFail'">
            <div class="form-area">
              <p [style.color]="C.g600" [style.font-size.px]="14" [style.line-height]="'1.6'" [style.margin-bottom.px]="20">
                {{ 'absher.not_owner_desc' | t }}
              </p>
              <app-btn variant="primary" [full]="true" size="lg" (clicked)="identityStep = 'delegate'">
                {{ 'absher.request_owner' | t }}
              </app-btn>
              <div style="margin-top: 12px;">
                <app-btn variant="secondary" [full]="true" size="md" (clicked)="identityStep = 'id'">
                  {{ 'absher.try_different_id' | t }}
                </app-btn>
              </div>
            </div>
          </div>

          <!-- Step: delegate -->
          <div *ngIf="identityStep === 'delegate'">
            <div class="form-area">
              <p [style.color]="C.g600" [style.font-size.px]="14" [style.line-height]="'1.6'" [style.margin-bottom.px]="20">
                {{ 'absher.delegate_desc' | t }}
              </p>

              <div class="share-link-box">
                <span class="share-link-text">{{ shareLink }}</span>
                <button class="copy-btn" (click)="copyLink()">{{ copied ? ('common.copied' | t) : ('common.copy' | t) }}</button>
              </div>

              <div style="margin-top: 20px;">
                <app-input
                  [label]="'absher.owner_phone_label' | t"
                  [placeholder]="'absher.owner_phone_placeholder' | t"
                  [value]="ownerPhone"
                  (valueChange)="ownerPhone = $event"
                ></app-input>
                <app-btn variant="primary" [full]="true" size="lg" [disabled]="ownerPhone.length < 10" (clicked)="sendSms()">
                  {{ 'absher.send_sms' | t }}
                </app-btn>
              </div>
            </div>
          </div>

          <!-- Step: smsSent -->
          <div *ngIf="identityStep === 'smsSent'" class="text-center" style="padding: 40px 0;">
            <div class="sms-sent-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00af3d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p [style.color]="C.g900" [style.font-weight]="700" [style.font-size.px]="16" [style.margin-bottom.px]="6">{{ 'absher.sms_sent' | t }}</p>
            <p [style.color]="C.g500" [style.font-size.px]="14">{{ 'absher.sms_sent_desc' | t }}</p>
          </div>

          <!-- Step: pending -->
          <div *ngIf="identityStep === 'pending'">
            <div class="form-area">
              <div class="pending-icon-wrap text-center" style="margin-bottom: 20px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f79009" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <p [style.color]="C.g600" [style.font-size.px]="14" [style.line-height]="'1.6'" [style.margin-bottom.px]="20" [style.text-align]="'center'">
                {{ 'absher.pending_desc' | t }}
              </p>
              <app-btn variant="secondary" [full]="true" size="md" (clicked)="router.navigate(['/verify/owner/abc123'])">
                {{ 'absher.demo_open_owner_verify' | t }}
              </app-btn>
            </div>
          </div>

        </div>


      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .absher-container {
      max-width: 620px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .identity-wrap {
      max-width: 420px;
      margin: 0 auto;
    }

    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
    }

    .icon-header {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .icon-circle {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .absher-title {
      font-size: 22px;
      font-weight: 900;
      color: #101828;
      margin-bottom: 8px;
    }

    .absher-subtitle {
      font-size: 14px;
      color: #667085;
      line-height: 1.5;
    }

    .form-area {
      background: #f8f9fa;
      border-radius: 18px;
      padding: 32px;
      border: 1px solid #e2e5e9;
    }

    .form-footer {
      text-align: center;
      font-size: 12px;
      color: #98a2b3;
      margin-top: 16px;
    }

    .link {
      color: #00af3d;
      cursor: pointer;
      font-weight: 600;
    }
    .link:hover {
      text-decoration: underline;
    }

    .share-link-box {
      display: flex;
      align-items: center;
      background: #fff;
      border: 1.5px solid #e2e5e9;
      border-radius: 10px;
      padding: 10px 14px;
      gap: 10px;
    }

    .share-link-text {
      flex: 1;
      font-size: 12px;
      color: #667085;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .copy-btn {
      background: #00af3d;
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

    .sms-sent-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #e6f7ee;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    /* Demo buttons */
    .demo-bar {
      text-align: center; margin-top: 16px;
    }
    .demo-advance {
      background: none; border: 1px dashed ${C.g300};
      border-radius: 6px; padding: 4px 10px;
      font-size: 11px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit;
    }
    .demo-advance:hover { background: ${C.g50}; color: ${C.g700}; }

    @media (max-width: 480px) {
      .absher-container { padding: 24px 16px; }
      .form-area { padding: 20px 16px; }
      .absher-title { font-size: 18px; }
      .absher-subtitle { font-size: 13px; }
    }
  `]
})
export class AbsherComponent implements OnInit, OnDestroy {
  readonly C = C;

  mode: 'register' | 'login' = 'register';
  phase: 'identity' = 'identity';
  identityStep: IdentityStep = 'id';

  nid = '';
  otp = '';
  ownerPhone = '';
  copied = false;
  shareLink = 'https://portal.safqah.com/verify/owner/abc123';

  get progressSteps(): string[] {
    return [
      this.i18n.t('team_invite.step_verify'),
      this.i18n.t('team_invite.step_invite'),
    ];
  }
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public i18n: I18nService,
  ) {}

  ngOnInit(): void {
    this.mode = (this.route.snapshot.data as any)['mode'] || 'register';
    this.nid = '';
  }

  ngOnDestroy(): void {
    this.timers.forEach(t => clearTimeout(t));
  }

  get progressCurrent(): number {
    return 0;
  }

  get currentStepDisplay(): number {
    return this.progressCurrent + 1;
  }

  get showIconHeader(): boolean {
    return ['id', 'otp', 'ownerFail', 'delegate', 'smsSent'].includes(this.identityStep);
  }

  get isErrorStep(): boolean {
    return this.identityStep === 'ownerFail';
  }

  get iconCircleStyle(): Record<string, string> {
    if (this.isErrorStep) {
      return { background: 'linear-gradient(135deg, #f04438, #d92d20)' };
    }
    return { background: 'linear-gradient(135deg, #00af3d, #007a44)' };
  }

  get identityTitle(): string {
    switch (this.identityStep) {
      case 'id': return this.i18n.t('absher.verify_title');
      case 'otp': return this.i18n.t('absher.otp_title');
      case 'verifying': return this.i18n.t('absher.verifying');
      case 'ownerCheck': return this.i18n.t('absher.checking_ownership');
      case 'ownerFail': return this.i18n.t('absher.not_owner_title');
      case 'delegate': return this.i18n.t('absher.delegate_title');
      case 'smsSent': return '';
      case 'pending': return this.i18n.t('absher.pending_title');
      default: return '';
    }
  }

  get identitySubtitle(): string {
    switch (this.identityStep) {
      case 'id': return this.i18n.t('absher.verify_subtitle');
      case 'otp': return this.i18n.t('absher.otp_subtitle');
      case 'ownerFail': return this.i18n.t('absher.not_owner_subtitle');
      case 'delegate': return this.i18n.t('absher.delegate_subtitle');
      case 'pending': return this.i18n.t('absher.pending_subtitle');
      default: return '';
    }
  }

  isValidNid(nid: string): boolean {
    return /^[12]\d{9}$/.test(nid);
  }

  onIdSubmit(): void {
    this.identityStep = 'otp';
  }

  onOtpConfirm(): void {
    if (this.mode === 'login') {
      this.identityStep = 'verifying';
      const t = setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
      this.timers.push(t);
    } else {
      this.identityStep = 'ownerCheck';
      const t = setTimeout(() => {
        if (this.nid.startsWith('200')) {
          this.identityStep = 'ownerFail';
        } else {
          // Navigate to team invite
          this.router.navigate(['/onboarding/team']);
        }
      }, 1200);
      this.timers.push(t);
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.shareLink);
    this.copied = true;
    const t = setTimeout(() => { this.copied = false; }, 2000);
    this.timers.push(t);
  }

  sendSms(): void {
    this.identityStep = 'smsSent';
    const t = setTimeout(() => { this.identityStep = 'pending'; }, 2000);
    this.timers.push(t);
  }
}
