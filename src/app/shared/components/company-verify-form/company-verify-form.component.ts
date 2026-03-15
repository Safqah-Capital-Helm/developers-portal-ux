import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../theme';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { InputComponent } from '../input/input.component';
import { ReviewGridComponent } from '../review-grid/review-grid.component';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-company-verify-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    InputComponent,
    ReviewGridComponent,
    TranslatePipe,
  ],
  template: `
    <!-- Title / Subtitle -->
    <div style="margin-bottom: 24px;">
      <h1 class="step-title">{{ title }}</h1>
      <p class="step-subtitle">{{ subtitle }}</p>
    </div>

    <!-- Step 0: Review Company Details -->
    <div *ngIf="step === 0" class="step-content animate-in">

      <!-- Review Hero -->
      <div class="rv-hero">
        <div class="rv-hero-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18"/>
            <path d="M9 21V9"/>
          </svg>
        </div>
        <div class="rv-hero-title">{{ 'company_verify.review_hero_title' | t }}</div>
        <div class="rv-hero-desc">{{ 'company_verify.review_hero_desc' | t }}</div>
      </div>

      <!-- Company Identity -->
      <div class="rv-card">
        <div class="rv-card-header">
          <div class="rv-card-icon" [style.background]="C.greenLt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
          </div>
          <div class="rv-card-title">{{ 'company_verify.company_identity' | t }}</div>
          <div class="rv-card-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {{ 'company_verify.verified' | t }}
          </div>
        </div>
        <app-review-grid [items]="identityItems"></app-review-grid>
      </div>

      <!-- Business Details -->
      <div class="rv-card">
        <div class="rv-card-header">
          <div class="rv-card-icon" [style.background]="C.blue50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
            </svg>
          </div>
          <div class="rv-card-title">{{ 'company_verify.business_details' | t }}</div>
          <div class="rv-card-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {{ 'company_verify.verified' | t }}
          </div>
        </div>
        <app-review-grid [items]="businessItems"></app-review-grid>
      </div>

      <!-- Financial -->
      <div class="rv-card">
        <div class="rv-card-header">
          <div class="rv-card-icon" [style.background]="C.orangeLt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div class="rv-card-title">{{ 'company_verify.financial' | t }}</div>
          <div class="rv-card-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {{ 'company_verify.verified' | t }}
          </div>
        </div>
        <app-review-grid [items]="financialItems"></app-review-grid>
      </div>

      <!-- Online Presence -->
      <div class="rv-card">
        <div class="rv-card-header">
          <div class="rv-card-icon" [style.background]="C.purpleLt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.purple" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
          </div>
          <div class="rv-card-title">{{ 'company_verify.online_presence' | t }}</div>
        </div>
        <div style="padding: 4px 0 0;">
          <app-input
            [label]="'company_verify.website_label' | t"
            [placeholder]="'company_verify.website_placeholder' | t"
            prefix="https://"
            [value]="companyWebsite"
            (valueChange)="companyWebsite = $event"
            [error]="companyWebsite && !isValidWebsite(companyWebsite) ? ('validation.website_format' | t) : ''"
          ></app-input>
        </div>
      </div>

      <div class="nav-row" style="margin-top: 24px;">
        <div></div>
        <app-btn variant="primary" size="lg" (clicked)="nextStep()">
          {{ 'company_verify.next_declaration' | t }} <span class="dir-arrow">&rarr;</span>
        </app-btn>
      </div>
    </div>

    <!-- Step 1: Sign Declaration -->
    <div *ngIf="step === 1" class="step-content animate-in">
      <app-card [padding]="32">
        <div class="section-header">
          <div class="section-icon" [style.background]="C.g100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g600" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <h2 class="section-title">{{ 'company_verify.decl_title' | t }}</h2>
        </div>

        <p class="section-desc">{{ 'company_verify.decl_desc' | t }}</p>

        <div class="decl-question">
          <div class="decl-q-label">{{ 'company_verify.decl_question' | t }}</div>
          <div class="toggle-row">
            <div class="toggle-opt"
              [style.background]="hasLitigations === true ? C.amber50 : '#fff'"
              [style.borderColor]="hasLitigations === true ? C.amber500 : C.g200"
              [style.color]="hasLitigations === true ? C.amber600 : C.g500"
              (click)="hasLitigations = true; declarationSigned = false">
              {{ 'company_verify.decl_yes' | t }}
            </div>
            <div class="toggle-opt"
              [style.background]="hasLitigations === false ? C.greenLt : '#fff'"
              [style.borderColor]="hasLitigations === false ? C.green : C.g200"
              [style.color]="hasLitigations === false ? C.green : C.g500"
              (click)="hasLitigations = false; declarationSigned = false">
              <svg *ngIf="hasLitigations === false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {{ 'company_verify.decl_no' | t }}
            </div>
          </div>
        </div>

        <!-- Yes: describe litigations -->
        <div *ngIf="hasLitigations === true" class="decl-details">
          <div class="decl-warn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>{{ 'company_verify.decl_warn' | t }}</span>
          </div>
          <label class="field-label">{{ 'company_verify.decl_textarea_label' | t }}</label>
          <textarea class="textarea-field" [(ngModel)]="litigationDetails" [placeholder]="'company_verify.decl_textarea_placeholder' | t" rows="4"></textarea>
        </div>

        <!-- No: sign the declaration -->
        <div *ngIf="hasLitigations === false" class="decl-sign-section">
          <div *ngIf="!declarationSigned" class="decl-sign-card">
            <div class="decl-sign-icon" [style.background]="C.greenLt">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <div class="decl-sign-text">
              <div class="decl-sign-title">{{ 'company_verify.sign_decl_title' | t }}</div>
              <div class="decl-sign-desc">{{ 'company_verify.sign_decl_desc' | t }}</div>
            </div>
            <app-btn variant="primary" size="md" [full]="true" (clicked)="declarationSignPending = true">
              {{ 'company_verify.sign_decl_btn' | t }} <span class="dir-arrow">&rarr;</span>
            </app-btn>
          </div>

          <!-- Simulated signing -->
          <div *ngIf="declarationSignPending && !declarationSigned" class="decl-demo">
            <div class="decl-demo-label">{{ 'company_verify.demo_sign_label' | t }}</div>
            <div class="decl-demo-row">
              <button class="decl-demo-btn decl-demo-success" (click)="declarationSigned = true; declarationSignPending = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ 'company_verify.demo_signed_ok' | t }}
              </button>
              <button class="decl-demo-btn decl-demo-fail" (click)="declarationSignPending = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                {{ 'company_verify.demo_signed_fail' | t }}
              </button>
            </div>
          </div>

          <!-- Signed success -->
          <div *ngIf="declarationSigned" class="decl-success">
            <div class="decl-success-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="decl-success-text">
              <div class="decl-success-title">{{ 'company_verify.signed_title' | t }}</div>
              <div class="decl-success-desc">{{ 'company_verify.signed_desc' | t }}</div>
            </div>
          </div>
        </div>
      </app-card>

      <div class="nav-row" style="margin-top: 24px;">
        <app-btn variant="ghost" size="lg" (clicked)="prevStep()"><span class="dir-arrow">&larr;</span> {{ 'common.back' | t }}</app-btn>
        <app-btn variant="primary" size="lg" [disabled]="!canComplete" (clicked)="onComplete()">
          {{ 'company_verify.complete_btn' | t }} <span class="dir-arrow">&rarr;</span>
        </app-btn>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .step-title {
      font-size: 22px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 6px 0;
    }

    .step-subtitle {
      font-size: 14px;
      color: ${C.g500};
      margin: 0;
      line-height: 1.5;
    }

    /* Animations */
    .animate-in {
      animation: fadeUp 0.3s ease-out both;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Section header */
    .section-header {
      display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
    }

    .section-icon {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .section-title {
      font-size: 17px; font-weight: 800; color: ${C.g900}; margin: 0;
    }

    .section-desc {
      font-size: 13px; color: ${C.g500}; line-height: 1.5; margin: 0 0 20px 0;
    }

    /* Review hero */
    .rv-hero {
      text-align: center; padding: 28px 20px 24px;
      background: ${C.white}; border: 1px solid ${C.g200};
      border-radius: 16px; margin-bottom: 12px;
    }
    .rv-hero-icon {
      width: 56px; height: 56px; border-radius: 16px;
      background: ${C.greenLt};
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 14px;
    }
    .rv-hero-title {
      font-size: 18px; font-weight: 900; color: ${C.g900}; margin-bottom: 6px;
    }
    .rv-hero-desc {
      font-size: 13px; color: ${C.g500}; line-height: 1.55;
      max-width: 420px; margin: 0 auto;
    }

    /* Review cards */
    .rv-card {
      background: ${C.white}; border: 1px solid ${C.g200};
      border-radius: 14px; padding: 20px 22px 16px;
      margin-bottom: 10px;
    }
    .rv-card-header {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 14px;
    }
    .rv-card-icon {
      width: 32px; height: 32px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .rv-card-title {
      font-size: 14px; font-weight: 800; color: ${C.g900}; flex: 1;
    }
    .rv-card-badge {
      display: flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 700; color: ${C.green};
      background: ${C.greenLt}; padding: 4px 10px; border-radius: 8px;
    }

    /* Toggle row */
    .toggle-row { display: flex; gap: 10px; margin-bottom: 20px; }

    .toggle-opt {
      flex: 1; padding: 12px; border-radius: 10px; border: 1.5px solid ${C.g200};
      font-size: 13px; font-weight: 700; cursor: pointer; text-align: center;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: all 0.15s ease;
    }

    /* Declaration */
    .decl-question { margin-bottom: 20px; }

    .decl-q-label { font-size: 14px; font-weight: 700; color: ${C.g800}; margin-bottom: 12px; }

    .decl-details { margin-top: 4px; }

    .decl-warn {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 14px; background: ${C.amber50}; border: 1px solid ${C.amber100};
      border-radius: 10px; margin-bottom: 16px;
      font-size: 12px; color: ${C.g600}; line-height: 1.5;
    }
    .decl-warn svg { flex-shrink: 0; margin-top: 1px; }

    .field-label { font-size: 13px; font-weight: 700; color: ${C.g700}; display: block; margin-bottom: 6px; }

    .textarea-field {
      width: 100%; padding: 12px 14px; border: 1.5px solid ${C.g200};
      border-radius: 10px; font-size: 14px; color: ${C.g900};
      background: #fff; font-family: inherit; outline: none;
      resize: vertical; box-sizing: border-box;
    }

    .decl-sign-section { margin-top: 4px; }

    .decl-sign-card {
      padding: 20px; background: ${C.g50}; border-radius: 14px;
      display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;
    }

    .decl-sign-icon {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }

    .decl-sign-text { margin-bottom: 4px; }
    .decl-sign-title { font-size: 14px; font-weight: 800; color: ${C.g900}; margin-bottom: 4px; }

    .decl-sign-desc {
      font-size: 12px; color: ${C.g500}; line-height: 1.5; max-width: 380px;
    }

    .decl-demo {
      margin-top: 16px; padding: 16px; border: 2px dashed ${C.g300};
      border-radius: 12px; text-align: center;
    }

    .decl-demo-label {
      font-size: 11px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
    }

    .decl-demo-row { display: flex; gap: 10px; }

    .decl-demo-btn {
      flex: 1; padding: 10px 14px; border: none; border-radius: 10px;
      font-size: 13px; font-weight: 700; color: #fff; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: opacity 0.15s; font-family: inherit;
    }
    .decl-demo-btn:hover { opacity: 0.85; }
    .decl-demo-success { background: ${C.green}; }
    .decl-demo-fail { background: ${C.red500}; }

    .decl-success {
      display: flex; align-items: center; gap: 14px;
      padding: 16px 18px; background: ${C.greenLt}; border: 1.5px solid ${C.greenMd};
      border-radius: 14px;
    }

    .decl-success-icon {
      width: 40px; height: 40px; min-width: 40px; border-radius: 50%; background: ${C.green};
      display: flex; align-items: center; justify-content: center;
    }

    .decl-success-title { font-size: 14px; font-weight: 800; color: ${C.g900}; margin-bottom: 2px; }
    .decl-success-desc { font-size: 12px; color: ${C.g500}; line-height: 1.4; }

    /* Navigation row */
    .nav-row {
      display: flex; justify-content: space-between; align-items: center; gap: 12px;
    }
  `]
})
export class CompanyVerifyFormComponent {
  readonly C = C;

  @Output() completed = new EventEmitter<void>();
  @Output() stepChanged = new EventEmitter<number>();

  step = 0;

  constructor(private i18n: I18nService) {}

  // Company details — split into review sections
  get identityItems() {
    return [
      { label: this.i18n.t('company_verify.label_legal_name_en'), value: 'Al Omran Real Estate Dev Co.' },
      { label: this.i18n.t('company_verify.label_legal_name_ar'), value: '\u0634\u0631\u0643\u0629 \u0627\u0644\u0639\u0645\u0631\u0627\u0646 \u0644\u0644\u062a\u0637\u0648\u064a\u0631 \u0627\u0644\u0639\u0642\u0627\u0631\u064a' },
      { label: this.i18n.t('company_verify.label_cr_number'), value: '1010234567' },
      { label: this.i18n.t('company_verify.label_unified_no'), value: '7001234567' },
    ];
  }
  get businessItems() {
    return [
      { label: this.i18n.t('company_verify.label_legal_form'), value: 'LLC' },
      { label: this.i18n.t('company_verify.label_status'), value: this.i18n.t('company_verify.value_active') },
      { label: this.i18n.t('company_verify.label_type'), value: this.i18n.t('company_verify.value_re_developer') },
      { label: this.i18n.t('company_verify.label_company_size'), value: this.i18n.t('company_verify.value_employees') },
    ];
  }
  get financialItems() {
    return [
      { label: this.i18n.t('company_verify.label_capital'), value: 'SAR 10,000,000' },
    ];
  }
  companyWebsite = '';

  isValidWebsite(url: string): boolean {
    // Accept with or without protocol
    const pattern = /^(https?:\/\/)?([\w-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    return pattern.test(url.trim());
  }

  // Declaration
  hasLitigations: boolean | null = null;
  litigationDetails = '';
  declarationSigned = false;
  declarationSignPending = false;

  get title(): string {
    switch (this.step) {
      case 0: return this.i18n.t('company_verify.review_title');
      case 1: return this.i18n.t('company_verify.sign_title');
      default: return this.i18n.t('company_verify.title');
    }
  }

  get subtitle(): string {
    switch (this.step) {
      case 0: return this.i18n.t('company_verify.review_subtitle');
      case 1: return this.i18n.t('company_verify.decl_subtitle');
      default: return '';
    }
  }

  get canComplete(): boolean {
    if (this.hasLitigations === null) return false;
    if (this.hasLitigations === true) return this.litigationDetails.trim().length > 0;
    return this.declarationSigned;
  }

  /** Allow parent to jump to a completed step (e.g. from progress bar click) */
  jumpTo(s: number): void {
    if (s >= 0 && s <= 1 && s < this.step) {
      this.step = s;
      this.stepChanged.emit(this.step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextStep(): void {
    if (this.step < 1) {
      this.step++;
      this.stepChanged.emit(this.step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.step > 0) {
      this.step--;
      this.stepChanged.emit(this.step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onComplete(): void {
    this.completed.emit();
  }
}
