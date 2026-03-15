import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { I18nService } from '../../shared/i18n/i18n.service';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  ProgressStepsComponent,
  CompanyVerifyFormComponent,
  AvatarComponent,
  ModalComponent,
  InputComponent,
  TranslatePipe,
} from '../../shared';

@Component({
  selector: 'app-company-verify',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    BackLinkComponent,
    ButtonComponent,
    ProgressStepsComponent,
    CompanyVerifyFormComponent,
    AvatarComponent,
    ModalComponent,
    InputComponent,
    TranslatePipe,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link [to]="backLink" [label]="backLabel"></app-back-link>

        <!-- Demo toggles -->
        <div class="demo-bar">
          <button class="demo-toggle" [class.active]="demoRole === 'owner'" (click)="setDemoRole('owner')">{{ 'company_verify.demo_owner' | t }}</button>
          <button class="demo-toggle" [class.active]="demoRole === 'non-owner'" (click)="setDemoRole('non-owner')">{{ 'company_verify.demo_non_owner' | t }}</button>
        </div>

        <!-- Non-owner blocker -->
        <div *ngIf="demoRole === 'non-owner'" class="non-owner-block">
          <div class="non-owner-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h2 class="non-owner-title">{{ 'company_verify.non_owner_title' | t }}</h2>
          <p class="non-owner-desc">
            {{ 'company_verify.non_owner_desc' | t }}
          </p>

          <div class="owners-list">
            <div *ngFor="let owner of crOwners" class="owner-row">
              <div class="owner-left">
                <app-avatar [initials]="owner.name.charAt(0)" size="md" color="green"></app-avatar>
                <div>
                  <div class="owner-name">{{ owner.name }}</div>
                  <div class="owner-role">{{ owner.crRole }}</div>
                </div>
              </div>
              <div class="owner-right">
                <span *ngIf="owner.invited" class="invited-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ 'company_verify.invited' | t }}
                </span>
                <app-btn *ngIf="!owner.invited" variant="secondary" size="sm" (clicked)="openInviteModal(owner)">
                  {{ 'company_verify.invite_to_verify' | t }}
                </app-btn>
              </div>
            </div>
          </div>

          <p class="non-owner-help">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            {{ 'company_verify.non_owner_help' | t }}
          </p>
        </div>

        <!-- Owner flow -->
        <ng-container *ngIf="demoRole === 'owner'">
          <app-progress-steps
            [steps]="stepLabels"
            [current]="currentStep"
            (stepClick)="onStepClick($event)"
          ></app-progress-steps>

          <app-company-verify-form
            (stepChanged)="currentStep = $event"
            (completed)="onComplete()"
          ></app-company-verify-form>
        </ng-container>
      </div>
    </div>

    <!-- Invite Owner Modal -->
    <app-modal *ngIf="inviteModalOwner" [title]="'company_verify.invite_modal_title' | t" (closed)="closeInviteModal()">
      <div class="invite-modal-body">
        <div class="invite-modal-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <div class="invite-modal-heading">{{ 'company_verify.invite_modal_heading' | t:{name: inviteModalOwner.name} }}</div>
        <div class="invite-modal-desc">{{ 'company_verify.invite_modal_desc' | t }}</div>

        <div class="invite-link-section">
          <div class="invite-link-label">{{ 'company_verify.invite_modal_link_label' | t }}</div>
          <div class="invite-link-row">
            <div class="invite-link-url">{{ inviteLink }}</div>
            <app-btn variant="primary" size="sm" (clicked)="copyLink()">
              {{ linkCopied ? ('company_verify.invite_modal_copied' | t) : ('company_verify.invite_modal_copy' | t) }}
            </app-btn>
          </div>
        </div>

        <div class="invite-phone-section">
          <app-input
            [label]="'company_verify.invite_modal_phone_label' | t"
            placeholder="5x xxx xxxx"
            [value]="invitePhone"
            (valueChange)="invitePhone = $event"
            inputmode="numeric"
            mask="digits"
            [maxlength]="9"
            prefix="+966"
            [error]="invitePhone && invitePhone.length > 1 && !isValidPhone(invitePhone) ? ('validation.phone_format' | t) : ''"
          ></app-input>
        </div>

        <app-btn variant="primary" size="lg" [full]="true" [disabled]="smsSent || !isValidPhone(invitePhone)" (clicked)="sendSms()">
          <span *ngIf="!smsSent">{{ 'company_verify.invite_modal_send_sms' | t }}</span>
          <span *ngIf="smsSent" style="display: flex; align-items: center; gap: 6px; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {{ 'company_verify.invite_modal_sms_sent' | t }}
          </span>
        </app-btn>
      </div>
    </app-modal>
  `,
  styles: [`
    :host { display: block; }

    .page {
      background: ${C.bg};
      min-height: 100vh;
    }

    .container {
      max-width: 620px;
      margin: 0 auto;
      padding: 32px 32px 60px;
    }

    /* Demo controls */
    .demo-bar {
      display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;
    }
    .demo-toggle {
      background: ${C.g50}; border: 1px dashed ${C.g300}; border-radius: 8px;
      padding: 8px 16px; font-size: 12px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit; transition: all 0.15s;
    }
    .demo-toggle:hover { background: ${C.g100}; color: ${C.g700}; }
    .demo-toggle.active { background: ${C.g200}; color: ${C.g700}; border-color: ${C.g400}; }

    /* Non-owner block */
    .non-owner-block {
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-radius: 16px;
      padding: 40px 32px;
      text-align: center;
    }

    .non-owner-icon {
      width: 64px; height: 64px; border-radius: 50%;
      background: ${C.amber50};
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }

    .non-owner-title {
      font-size: 20px; font-weight: 900; color: ${C.g900};
      margin: 0 0 8px 0;
    }

    .non-owner-desc {
      font-size: 14px; color: ${C.g500}; line-height: 1.6;
      margin: 0 0 24px 0;
      max-width: 440px; margin-left: auto; margin-right: auto;
    }

    /* Owner list */
    .owners-list {
      text-align: left;
      border: 1px solid ${C.g200};
      border-radius: 12px;
      overflow: hidden;
    }

    .owner-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1px solid ${C.g100};
    }
    .owner-row:last-child { border-bottom: none; }

    .owner-left { display: flex; align-items: center; gap: 12px; }
    .owner-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }
    .owner-role { font-size: 12px; color: ${C.g400}; }
    .owner-right { display: flex; align-items: center; }

    .invited-tag {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 12px; font-weight: 700; color: ${C.green};
      background: ${C.greenLt};
      padding: 4px 12px; border-radius: 8px;
    }

    .non-owner-help {
      display: flex; align-items: center; justify-content: center;
      gap: 8px; margin-top: 20px;
      font-size: 12px; color: ${C.g400};
    }

    /* Invite modal */
    .invite-modal-body { text-align: center; }
    .invite-modal-icon {
      width: 56px; height: 56px; border-radius: 50%;
      background: ${C.greenLt};
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
    }
    .invite-modal-heading {
      font-size: 18px; font-weight: 900; color: ${C.g900}; margin-bottom: 6px;
    }
    .invite-modal-desc {
      font-size: 13px; color: ${C.g500}; line-height: 1.55; margin-bottom: 24px;
      max-width: 380px; margin-left: auto; margin-right: auto;
    }
    .invite-link-section {
      text-align: left; margin-bottom: 20px;
    }
    .invite-link-label {
      font-size: 13px; font-weight: 700; color: ${C.g700}; margin-bottom: 8px;
    }
    .invite-link-row {
      display: flex; align-items: center; gap: 10px;
      background: ${C.g50}; border: 1.5px solid ${C.g200};
      border-radius: 10px; padding: 10px 12px;
    }
    .invite-link-url {
      flex: 1; font-size: 13px; color: ${C.g600}; font-weight: 500;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .invite-phone-section {
      text-align: left; margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .container { padding: 24px 16px 40px; }
      .non-owner-block { padding: 28px 16px; }
    }
    @media (max-width: 480px) {
      .container { padding: 20px 12px 32px; }
      .page-title { font-size: 20px; }
      .owner-row { flex-direction: column; gap: 12px; }
    }
  `]
})
export class CompanyVerifyComponent implements OnInit {
  C = C;
  @ViewChild(CompanyVerifyFormComponent) form!: CompanyVerifyFormComponent;

  from = 'onboarding';
  backLink = '/dashboard';
  backLabel = '';
  currentStep = 0;
  demoRole: 'owner' | 'non-owner' = 'owner';

  // Invite modal state
  inviteModalOwner: any = null;
  invitePhone = '';
  linkCopied = false;
  smsSent = false;

  get inviteLink(): string {
    return 'https://portal.safqah.com/verify/owner/abc123';
  }

  get stepLabels() {
    return [
      this.i18n.t('company_verify.step_details'),
      this.i18n.t('company_verify.step_declaration'),
    ];
  }

  private _crOwnersData = [
    { name: 'Mohammad Al-Omran', roleKey: 'common.role_partner', invited: false },
    { name: 'Khalid Al-Salem', roleKey: 'common.role_partner', invited: true },
    { name: 'Faisal Al-Rajhi', roleKey: 'common.role_authorized_signatory', invited: false },
  ];

  get crOwners() {
    return this._crOwnersData.map(o => ({
      ...o,
      crRole: this.i18n.t(o.roleKey),
    }));
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private i18n: I18nService,
  ) {}

  ngOnInit(): void {
    this.from = this.route.snapshot.queryParamMap.get('from') || 'onboarding';

    // Context-aware back link
    if (this.from === 'dashboard') {
      this.backLink = '/dashboard';
      this.backLabel = this.i18n.t('company_verify.back_to_dashboard');
    } else if (this.from === 'add-company') {
      this.backLink = '/company/new';
      this.backLabel = this.i18n.t('company_verify.back_to_company');
    } else if (this.from === 'owner-verify') {
      this.backLink = '/dashboard';
      this.backLabel = this.i18n.t('company_verify.back_to_dashboard');
    } else if (this.from === 'onboarding') {
      this.backLink = '/dashboard?state=new';
      this.backLabel = this.i18n.t('company_verify.back_to_dashboard');
    } else {
      this.backLink = '/verify';
      this.backLabel = this.i18n.t('common.back');
    }
  }

  setDemoRole(role: 'owner' | 'non-owner') {
    this.demoRole = role;
  }

  openInviteModal(owner: any) {
    this.inviteModalOwner = owner;
    this.invitePhone = '';
    this.linkCopied = false;
    this.smsSent = false;
  }

  closeInviteModal() {
    this.inviteModalOwner = null;
  }

  copyLink() {
    navigator.clipboard.writeText(this.inviteLink).catch(() => {});
    this.linkCopied = true;
    setTimeout(() => this.linkCopied = false, 2000);
  }

  sendSms() {
    this.smsSent = true;
    // Mark the owner as invited
    const src = this._crOwnersData.find(o => o.name === this.inviteModalOwner?.name);
    if (src) src.invited = true;
    // Auto-close modal after brief delay
    setTimeout(() => this.closeInviteModal(), 1500);
  }

  isValidPhone(phone: string): boolean {
    return /^5\d{8}$/.test(phone);
  }

  onStepClick(i: number): void {
    if (this.form) {
      this.form.jumpTo(i);
    }
  }

  onComplete(): void {
    this.router.navigate(['/dashboard'], { queryParams: { state: 'new' } });
  }
}
