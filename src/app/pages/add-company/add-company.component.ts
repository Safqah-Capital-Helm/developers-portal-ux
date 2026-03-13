import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  PrevCredentialsFormComponent,
  AlertBannerComponent,
  ResultScreenComponent,
  TranslatePipe,
  I18nService,
} from '../../shared';

type Step =
  | 'cr'
  | 'crVerifying'
  | 'verify'
  | 'otp'
  | 'checking'
  | 'delegate'
  | 'smsSent'
  | 'pending'
  | 'details'
  | 'prevProjects'
  | 'uploadDocs'
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
    PrevCredentialsFormComponent,
    AlertBannerComponent,
    ResultScreenComponent,
    TranslatePipe,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard/companies" [label]="('nav.companies' | t)"></app-back-link>

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
              <h2 class="card-title">{{ 'add_company.step_verify' | t }}</h2>
              <p class="card-desc">{{ 'add_company.cr_helper' | t }}</p>
            </div>

            <div class="cr-input-row">
              <div class="cr-prefix">{{ 'add_company.cr_prefix' | t }}</div>
              <input
                class="cr-field"
                [class.cr-error]="crRes === 'bad'"
                [placeholder]="('add_company.cr_placeholder' | t)"
                [(ngModel)]="cr"
                [disabled]="step === 'crVerifying'"
                inputmode="numeric"
                maxlength="10"
              />
            </div>
            <p class="cr-helper" *ngIf="crRes !== 'bad'">{{ 'add_company.cr_helper' | t }}</p>

            <!-- Error state -->
            <app-alert-banner *ngIf="crRes === 'bad'" type="error" [title]="('add_company.cr_not_found_title' | t)" [message]="('add_company.cr_not_found_desc' | t)"></app-alert-banner>

            <!-- Verifying spinner -->
            <div *ngIf="step === 'crVerifying'" class="text-center" style="margin-top: 20px;">
              <div class="spinner" style="margin: 0 auto 10px;"></div>
              <p class="spinner-text">{{ 'absher.verifying' | t }}</p>
            </div>

            <div *ngIf="step === 'cr'" style="margin-top: 20px;">
              <app-btn variant="primary" [full]="true" size="lg" [disabled]="cr.length !== 10" (clicked)="onCrSubmit()">
                {{ 'add_company.verify_cr' | t }}
              </app-btn>
            </div>
          </app-card>
        </div>

        <!-- ═══════ Step: verify / otp ═══════ -->
        <div *ngIf="step === 'verify' || step === 'otp'">
          <div style="margin-bottom: 20px;">
            <app-badge color="green">{{ 'add_company.cr_verified' | t:{cr: cr} }}</app-badge>
          </div>

          <app-card [padding]="32">
            <div class="text-center" style="margin-bottom: 20px;">
              <div class="icon-circle green-gradient" style="width: 56px; height: 56px; margin: 0 auto 16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              </div>
              <h2 class="card-title">{{ 'absher.verify_title' | t }}</h2>
            </div>

            <!-- verify: National ID input -->
            <div *ngIf="step === 'verify'">
              <app-input
                [label]="('absher.nid_label' | t)"
                [placeholder]="('absher.nid_placeholder' | t)"
                [value]="nid"
                (valueChange)="nid = $event"
                inputmode="numeric"
                [maxlength]="10"
                mask="digits"
                [error]="nid && nid.length > 0 && !isValidNid(nid) ? i18n.t('validation.nid_format') : ''"
              ></app-input>
              <app-btn variant="primary" [full]="true" size="lg" [disabled]="!this.isValidNid(nid)" (clicked)="step = 'otp'">
                {{ 'absher.verify_btn' | t }}
              </app-btn>
              <div class="demo-bar" style="margin-top: 12px;">
                <button class="demo-advance" (click)="step = 'delegate'">{{ 'add_company.demo_owner_not_found' | t }} &rarr;</button>
              </div>
            </div>

            <!-- otp: verification code input -->
            <div *ngIf="step === 'otp'">
              <div class="nid-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{{ 'add_company.nid_label' | t }}: {{ nid }}</span>
              </div>
              <app-input
                [label]="('absher.otp_label' | t)"
                [placeholder]="('absher.otp_placeholder' | t)"
                [value]="otp"
                (valueChange)="otp = $event"
                [helper]="('absher.otp_helper' | t)"
                inputmode="numeric"
                [maxlength]="6"
                mask="digits"
              ></app-input>
              <app-btn variant="primary" [full]="true" size="lg" [disabled]="otp.length < 4" (clicked)="onOtpConfirm()">
                {{ 'common.confirm' | t }}
              </app-btn>
            </div>
          </app-card>

          <p class="form-footer">
            <span class="link" (click)="step = 'cr'; crRes = ''">{{ 'absher.back_to_id' | t }}</span>
          </p>
        </div>

        <!-- ═══════ Step: checking ═══════ -->
        <div *ngIf="step === 'checking'">
          <app-card [padding]="48">
            <div class="text-center">
              <div class="spinner" style="margin: 0 auto 16px;"></div>
              <p class="spinner-text">{{ 'absher.checking_ownership' | t }}</p>
            </div>
          </app-card>
        </div>

        <!-- ═══════ Step: delegate (owner not found + request authorization) ═══════ -->
        <div *ngIf="step === 'delegate'">
          <!-- Alert banner -->
          <app-alert-banner type="warning" [title]="('add_company.delegate_title' | t)" [message]="('add_company.delegate_desc' | t)"></app-alert-banner>

          <app-card [padding]="32" style="margin-top: 16px;">
            <div class="text-center" style="margin-bottom: 20px;">
              <div class="icon-circle" style="width: 56px; height: 56px; margin: 0 auto 16px; background: linear-gradient(135deg, ${C.blue500}, #1570ef);">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 class="card-title">{{ 'absher.delegate_title' | t }}</h2>
              <p class="card-desc" style="margin-top: 6px;">
                {{ 'absher.delegate_desc' | t }}
              </p>
            </div>

            <!-- How it works -->
            <div class="delegate-steps">
              <div class="delegate-step">
                <div class="delegate-step-num">1</div>
                <div class="delegate-step-text">{{ 'add_company.delegate_step_1' | t }}</div>
              </div>
              <div class="delegate-step">
                <div class="delegate-step-num">2</div>
                <div class="delegate-step-text">{{ 'add_company.delegate_step_2' | t }}</div>
              </div>
              <div class="delegate-step">
                <div class="delegate-step-num">3</div>
                <div class="delegate-step-text">{{ 'add_company.delegate_step_3' | t }}</div>
              </div>
            </div>
          </app-card>

          <!-- Option 1: Copy link -->
          <app-card [padding]="24" style="margin-top: 12px;">
            <div class="delegate-option-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
              <span class="delegate-option-label">{{ 'add_company.delegate_option_1' | t }}</span>
            </div>
            <div class="share-link-box" style="margin-top: 12px;">
              <span class="share-link-text">{{ shareLink }}</span>
              <button class="copy-btn" (click)="copyLink()">{{ copied ? ('common.copied' | t) : ('common.copy' | t) }}</button>
            </div>
          </app-card>

          <!-- Option 2: Send SMS -->
          <app-card [padding]="24" style="margin-top: 12px;">
            <div class="delegate-option-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span class="delegate-option-label">{{ 'add_company.delegate_option_2' | t }}</span>
            </div>
            <div style="margin-top: 12px;">
              <app-input
                [label]="('absher.owner_phone_label' | t)"
                [placeholder]="('absher.owner_phone_placeholder' | t)"
                [value]="ownerPhone"
                (valueChange)="ownerPhone = $event"
                inputmode="tel"
                mask="phone"
              ></app-input>
              <app-btn variant="primary" [full]="true" size="lg" [disabled]="ownerPhone.length < 10" (clicked)="sendSms()">
                {{ 'absher.send_sms' | t }}
              </app-btn>
            </div>
          </app-card>

          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <app-btn variant="ghost" [full]="true" size="md" (clicked)="go('/dashboard')">{{ 'nav.dashboard' | t }}</app-btn>
            <app-btn variant="ghost" [full]="true" size="md" (clicked)="go('/support')">{{ 'support.title' | t }}</app-btn>
          </div>
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
              <p [style.color]="C.g900" [style.font-weight]="700" [style.font-size.px]="17" [style.margin-bottom.px]="6">{{ 'absher.sms_sent' | t }}</p>
              <p [style.color]="C.g500" [style.font-size.px]="14">{{ 'add_company.link_sent_sms' | t:{phone: ownerPhone} }}</p>
            </div>
          </app-card>
        </div>

        <!-- ═══════ Step: pending ═══════ -->
        <div *ngIf="step === 'pending'">
          <!-- Confirmation banner -->
          <app-alert-banner type="success" [title]="('add_company.pending_confirm_title' | t)" [message]="('add_company.pending_confirm_desc' | t)"></app-alert-banner>

          <app-card [padding]="32" style="margin-top: 16px;">
            <div class="text-center">
              <div style="margin-bottom: 16px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <app-badge color="amber">{{ 'absher.pending_title' | t }}</app-badge>
              <p [style.color]="C.g600" [style.font-size.px]="14" [style.line-height]="'1.6'" [style.margin-top.px]="16">
                {{ 'absher.pending_desc' | t }}
              </p>
            </div>
          </app-card>

          <div style="margin-top: 20px;">
            <app-btn variant="secondary" [full]="true" size="md" (clicked)="step = 'delegate'">
              {{ 'absher.request_owner' | t }}
            </app-btn>
          </div>

          <p class="form-footer" style="margin-top: 20px;">
            <span class="link" (click)="go('/dashboard')">{{ 'nav.dashboard' | t }}</span>
          </p>

          <div class="demo-bar">
            <button class="demo-advance" (click)="go('/verify/owner/abc123')">{{ 'add_company.demo_owner_view' | t }} &rarr;</button>
          </div>
        </div>

        <!-- ═══════ Step: details ═══════ -->
        <div *ngIf="step === 'details'">
          <!-- Company info badge bar -->
          <div class="details-badge-bar">
            <div>
              <app-badge color="green">CR {{ cr || '1020304050607' }} &mdash; Al Jazeera Development Co.</app-badge>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <app-badge color="green">{{ 'add_company.eligible_badge' | t }}</app-badge>
              <app-badge color="green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ 'add_company.owner_verified_badge' | t }}
              </app-badge>
            </div>
          </div>

          <!-- Company Details card -->
          <app-card [padding]="32">
            <h2 class="card-title" style="margin-bottom: 20px;">{{ 'company.details' | t }}</h2>
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
                [label]="('company.online' | t)"
                [placeholder]="'add_company.website_placeholder' | t"
                [value]="website"
                (valueChange)="website = $event"
              ></app-input>
            </div>
          </app-card>

          <div style="margin-top: 24px;">
            <app-btn variant="primary" [full]="true" size="lg" (clicked)="onRegister()">
              {{ 'common.confirm' | t }} &rarr;
            </app-btn>
          </div>
        </div>

        <!-- ═══════ Step: prevProjects ═══════ -->
        <div *ngIf="step === 'prevProjects'">
          <app-prev-credentials-form
            [showHeader]="true"
            [initialData]="credentialsInitial"
          ></app-prev-credentials-form>

          <div style="display: flex; gap: 12px; margin-top: 24px;">
            <app-btn variant="ghost" [full]="true" size="lg" (clicked)="step = 'details'">&larr; {{ 'common.back' | t }}</app-btn>
            <app-btn variant="primary" [full]="true" size="lg" (clicked)="step = 'uploadDocs'">
              {{ 'common.next' | t }} &rarr;
            </app-btn>
          </div>
        </div>

        <!-- ═══════ Step: uploadDocs ═══════ -->
        <div *ngIf="step === 'uploadDocs'">
          <app-card [padding]="32">
            <div class="section-header">
              <div class="section-icon" [style.background]="C.amber50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h2 class="card-title" style="margin: 0;">{{ 'add_company.step_review' | t }}</h2>
            </div>

            <p class="card-desc" style="margin: 16px 0 20px;">{{ 'add_company.cr_helper' | t }}</p>

            <div class="doc-list">
              <div *ngFor="let doc of companyDocSlots" class="doc-row" [class.doc-uploaded]="doc.uploaded">
                <div class="doc-icon" [style.background]="doc.uploaded ? C.greenLt : C.g100">
                  <svg *ngIf="!doc.uploaded" width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <svg *ngIf="doc.uploaded" width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div class="doc-info">
                  <div class="doc-name">
                    {{ doc.name }}
                    <app-badge *ngIf="doc.required" color="red" style="margin-left: 6px;">{{ 'add_company.required' | t }}</app-badge>
                    <app-badge *ngIf="!doc.required" color="gray" style="margin-left: 6px;">{{ 'add_company.optional' | t }}</app-badge>
                  </div>
                  <div class="doc-desc">{{ doc.desc }}</div>
                  <div *ngIf="doc.uploaded" class="doc-file">{{ doc.fileName }}</div>
                </div>
                <div class="doc-actions">
                  <button *ngIf="!doc.uploaded" class="doc-upload-btn" (click)="simulateUpload(doc)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    {{ 'common.add' | t }}
                  </button>
                  <button *ngIf="doc.uploaded" class="doc-view-btn">{{ 'common.view_all' | t }}</button>
                  <button *ngIf="doc.uploaded" class="doc-remove-btn" (click)="removeDoc(doc)" aria-label="Remove document">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="doc-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>{{ 'add_company.doc_hint' | t }}</span>
            </div>
          </app-card>

          <div style="display: flex; gap: 12px; margin-top: 24px;">
            <app-btn variant="ghost" [full]="true" size="lg" (clicked)="step = 'prevProjects'">&larr; {{ 'common.back' | t }}</app-btn>
            <app-btn variant="primary" [full]="true" size="lg" [disabled]="!companyRequiredDocsDone" (clicked)="step = 'success'">
              {{ 'common.submit' | t }} &rarr;
            </app-btn>
          </div>
        </div>

        <!-- ═══════ Step: success ═══════ -->
        <div *ngIf="step === 'success'">
          <app-result-screen type="success" [title]="('add_company.success_title' | t)" [subtitle]="('add_company.success_desc' | t)">
            <!-- Company status card -->
            <app-card [padding]="24" style="margin-top: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <p [style.font-size.px]="15" [style.font-weight]="700" [style.color]="C.g900">Al Jazeera Development Co.</p>
                  <p [style.font-size.px]="13" [style.color]="C.g500" [style.margin-top.px]="2">CR {{ cr || '1020304050607' }}</p>
                </div>
                <app-badge color="amber">{{ 'dashboard.under_review' | t }}</app-badge>
              </div>
            </app-card>

            <div style="margin-top: 24px;">
              <app-btn variant="primary" [full]="true" size="lg" (clicked)="goToCompanyVerify()">
                {{ 'company.verify_btn' | t }} &rarr;
              </app-btn>
            </div>
            <div style="margin-top: 12px;">
              <app-btn variant="secondary" [full]="true" size="md" (clicked)="go('/dashboard')">
                &larr; {{ 'nav.dashboard' | t }}
              </app-btn>
            </div>
          </app-result-screen>
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

    .cr-helper {
      font-size: 12px;
      color: ${C.g400};
      margin: 6px 0 0 0;
      line-height: 1.4;
    }

    .cr-error {
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
      background: ${C.g50};
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
      font-family: 'SF Mono', 'Fira Code', monospace;
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

    /* Delegate steps */
    .delegate-steps {
      background: ${C.g50};
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .delegate-step {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .delegate-step-num {
      width: 24px;
      height: 24px;
      min-width: 24px;
      border-radius: 50%;
      background: ${C.green};
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .delegate-step-text {
      font-size: 13px;
      font-weight: 600;
      color: ${C.g700};
    }

    .delegate-option-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .delegate-option-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
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

    /* Section header for new steps */
    .section-header {
      display: flex; align-items: center; gap: 12px; margin-bottom: 4px;
    }
    .section-icon {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    /* Document upload */
    .doc-list { display: flex; flex-direction: column; gap: 8px; }
    .doc-row {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px; background: ${C.g50}; border-radius: 12px;
      border: 1.5px solid ${C.g100}; transition: all 0.15s;
    }
    .doc-row.doc-uploaded { background: ${C.greenLt}; border-color: ${C.greenMd}; }
    .doc-icon {
      width: 36px; height: 36px; min-width: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .doc-info { flex: 1; min-width: 0; }
    .doc-name {
      font-size: 13px; font-weight: 700; color: ${C.g800};
      display: flex; align-items: center;
    }
    .doc-desc { font-size: 11.5px; color: ${C.g400}; margin-top: 3px; line-height: 1.45; }
    .doc-file {
      font-size: 11px; color: ${C.g500}; margin-top: 2px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .doc-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .doc-upload-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 7px 14px; border: 1.5px solid ${C.green}; border-radius: 8px;
      background: #fff; color: ${C.green}; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.15s; font-family: inherit;
    }
    .doc-upload-btn:hover { background: ${C.greenLt}; }
    .doc-view-btn {
      padding: 7px 12px; border: 1.5px solid ${C.g200}; border-radius: 8px;
      background: #fff; color: ${C.g600}; font-size: 12px; font-weight: 700;
      cursor: pointer; font-family: inherit; transition: all 0.15s;
    }
    .doc-view-btn:hover { border-color: ${C.g300}; }
    .doc-remove-btn {
      padding: 7px 8px; border: 1.5px solid ${C.g200}; border-radius: 8px;
      background: #fff; color: ${C.g500}; cursor: pointer; font-family: inherit;
      display: flex; align-items: center; justify-content: center; transition: all 0.15s;
    }
    .doc-remove-btn:hover { border-color: ${C.red500}; color: ${C.red500}; }
    .doc-hint {
      display: flex; align-items: center; gap: 8px; margin-top: 14px;
      font-size: 12px; color: ${C.g400};
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

    /* ---- Demo buttons ---- */
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

    @media (max-width: 768px) {
      .container { padding: 24px 16px 48px; }
      .page-title { font-size: 18px; }
      .details-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .details-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AddCompanyComponent implements OnInit, OnDestroy {
  readonly C = C;

  step: Step = 'cr';
  cr = '';
  crRes = '';
  nid = '';
  otp = '';
  ownerPhone = '';
  copied = false;
  delegateMethod: 'link' | 'sms' = 'link';
  website = '';

  // Previous projects
  hasPrevProjects = true;
  prevCount = '';
  prevValue = '';
  finBank = 40;
  finFintech = 20;
  finFriends = 15;

  // Documents
  private _docSlots = [
    { nameKey: 'add_company.doc_owner_id', descKey: 'add_company.doc_owner_id_desc', required: true, uploaded: false, fileName: '' },
    { nameKey: 'add_company.doc_credit_history', descKey: 'add_company.doc_credit_history_desc', required: true, uploaded: false, fileName: '' },
  ];

  get companyDocSlots() {
    return this._docSlots.map(d => ({
      ...d,
      name: this.i18n.t(d.nameKey),
      desc: this.i18n.t(d.descKey),
    }));
  }

  shareLink = 'https://portal.safqah.com/verify/owner/def456';

  get progressSteps() {
    return [
      this.i18n.t('add_company.step_verify_cr'),
      this.i18n.t('add_company.step_verify_ownership'),
      this.i18n.t('add_company.step_review_register'),
      this.i18n.t('add_company.step_credentials'),
      this.i18n.t('add_company.step_documents'),
    ];
  }

  private _companyFieldValues = [
    'Al Jazeera Development Co.',
    '\u0634\u0631\u0643\u0629 \u0627\u0644\u062c\u0632\u064a\u0631\u0629 \u0644\u0644\u062a\u0637\u0648\u064a\u0631',
    '',
    'LLC',
    'Active',
    '30M SAR',
    'Small',
    'RE Development',
    '7009876543',
  ];

  get companyFields(): string[][] {
    return [
      [this.i18n.t('add_company.field_legal_name_en'), this._companyFieldValues[0]],
      [this.i18n.t('add_company.field_legal_name_ar'), this._companyFieldValues[1]],
      [this.i18n.t('add_company.field_cr_number'), this._companyFieldValues[2]],
      [this.i18n.t('add_company.field_legal_form'), this._companyFieldValues[3]],
      [this.i18n.t('add_company.field_status'), this._companyFieldValues[4]],
      [this.i18n.t('add_company.field_capital'), this._companyFieldValues[5]],
      [this.i18n.t('add_company.field_company_size'), this._companyFieldValues[6]],
      [this.i18n.t('add_company.field_activity_type'), this._companyFieldValues[7]],
      [this.i18n.t('add_company.field_unified_no'), this._companyFieldValues[8]],
    ];
  }

  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor(private router: Router, private route: ActivatedRoute, public i18n: I18nService) {}

  ngOnInit(): void {
    const startStep = this.route.snapshot.queryParamMap.get('step');
    if (startStep === 'prevProjects' || startStep === 'uploadDocs') {
      this.step = startStep;
    }
  }

  ngOnDestroy(): void {
    this.timers.forEach(t => clearTimeout(t));
  }

  get title(): string {
    switch (this.step) {
      case 'cr':
      case 'crVerifying':
        return this.i18n.t('add_company.title_register');
      case 'verify':
      case 'otp':
        return this.i18n.t('add_company.title_verify_ownership');
      case 'checking':
        return this.i18n.t('add_company.title_checking');
      case 'delegate':
        return this.i18n.t('add_company.title_request_owner');
      case 'smsSent':
        return this.i18n.t('add_company.title_sms_sent');
      case 'pending':
        return this.i18n.t('add_company.title_waiting_owner');
      case 'details':
        return this.i18n.t('add_company.title_review_register');
      case 'prevProjects':
        return this.i18n.t('add_company.title_prev_credentials');
      case 'uploadDocs':
        return this.i18n.t('add_company.title_upload_docs');
      case 'success':
        return this.i18n.t('add_company.title_complete');
      default:
        return '';
    }
  }

  get showProgress(): boolean {
    return !['delegate', 'smsSent', 'pending'].includes(this.step);
  }

  get progressCurrent(): number {
    if (this.step === 'cr' || this.step === 'crVerifying') return 0;
    if (this.step === 'verify' || this.step === 'otp' || this.step === 'checking') return 1;
    if (this.step === 'details') return 2;
    if (this.step === 'prevProjects') return 3;
    if (this.step === 'uploadDocs') return 4;
    if (this.step === 'success') return 5;
    return 0;
  }

  get crField(): string {
    return this.cr || '1020304050607';
  }

  isValidNid(nid: string): boolean {
    return /^[12]\d{9}$/.test(nid);
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
      // Update CR Number in companyFields
      this._companyFieldValues[2] = this.cr || '1020304050607';
      this.step = 'details';
    }, 1500);
    this.timers.push(t);
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.shareLink);
    this.copied = true;
    this.delegateMethod = 'link';
    const t = setTimeout(() => {
      this.copied = false;
      this.step = 'pending';
    }, 1500);
    this.timers.push(t);
  }

  sendSms(): void {
    this.delegateMethod = 'sms';
    this.step = 'smsSent';
    const t = setTimeout(() => { this.step = 'pending'; }, 2000);
    this.timers.push(t);
  }

  onRegister(): void {
    this.step = 'prevProjects';
  }

  get credentialsInitial() {
    return {
      hasPrevProjects: this.hasPrevProjects,
      prevCount: this.prevCount,
      prevValue: this.prevValue,
      finBank: this.finBank,
      finFintech: this.finFintech,
      finFriends: this.finFriends,
    };
  }

  get companyRequiredDocsDone(): boolean {
    return this._docSlots.filter(d => d.required).every(d => d.uploaded);
  }

  simulateUpload(doc: any): void {
    const slot = this._docSlots.find(d => d.nameKey === doc.nameKey);
    if (slot) {
      slot.uploaded = true;
      slot.fileName = doc.name.toLowerCase().replace(/\s+/g, '_') + '.pdf';
    }
  }

  removeDoc(doc: any): void {
    const slot = this._docSlots.find(d => d.nameKey === doc.nameKey);
    if (slot) {
      slot.uploaded = false;
      slot.fileName = '';
    }
  }

  goToCompanyVerify(): void {
    this.router.navigate(['/onboarding/company-verify'], { queryParams: { from: 'add-company' } });
  }

  go(path: string): void {
    this.router.navigateByUrl(path);
  }
}
