import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../theme';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { InputComponent } from '../input/input.component';
import { BadgeComponent } from '../badge/badge.component';

interface DocSlot {
  name: string;
  desc: string;
  required: boolean;
  uploaded: boolean;
  fileName: string;
}

@Component({
  selector: 'app-company-verify-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    InputComponent,
    BadgeComponent,
  ],
  template: `
    <!-- Title / Subtitle -->
    <div style="margin-bottom: 24px;">
      <h1 class="step-title">{{ title }}</h1>
      <p class="step-subtitle">{{ subtitle }}</p>
    </div>

    <!-- Step 0: Review Company Details & Authorize Credit Check -->
    <div *ngIf="step === 0" class="step-content animate-in">
      <app-card [padding]="32">
        <div class="section-header">
          <div class="section-icon" [style.background]="C.greenLt">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
          </div>
          <h2 class="section-title">Company Details</h2>
        </div>

        <div class="info-grid">
          <div class="info-item" *ngFor="let f of companyFields">
            <div class="info-label">{{ f[0] }}</div>
            <div class="info-value">
              {{ f[1] }}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px; flex-shrink: 0;">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>
        </div>

        <app-input
          label="Company Website (optional)"
          placeholder="https://www.example.com"
          [value]="companyWebsite"
          (valueChange)="companyWebsite = $event"
        ></app-input>
      </app-card>

      <!-- Credit Bureau Authorization -->
      <app-card [padding]="28" style="margin-top: 16px;">
        <div class="consent-card">
          <div class="consent-row">
            <input
              type="checkbox"
              class="consent-cb"
              [checked]="creditAuth"
              (change)="creditAuth = !creditAuth"
            />
            <div>
              <p class="consent-title">Credit Bureau Authorization</p>
              <p class="consent-desc">
                I authorize Safqah to obtain the company's credit report from SIMAH (Saudi Credit Bureau) for the purpose of evaluating financing eligibility.
              </p>
            </div>
          </div>
        </div>
      </app-card>

      <div class="nav-row" style="margin-top: 24px;">
        <div></div>
        <app-btn variant="primary" size="lg" [disabled]="!creditAuth" (clicked)="nextStep()">
          Next: Previous Projects &rarr;
        </app-btn>
      </div>
    </div>

    <!-- Step 1: Share Previous Projects -->
    <div *ngIf="step === 1" class="step-content animate-in">
      <app-card [padding]="32">
        <div class="section-header">
          <div class="section-icon" [style.background]="C.blue50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <h2 class="section-title">Previous Projects</h2>
        </div>

        <p class="section-desc">Tell us about your track record so we can better assess your application.</p>

        <div class="toggle-row">
          <div class="toggle-opt"
            [style.background]="hasPrevProjects ? C.greenLt : '#fff'"
            [style.borderColor]="hasPrevProjects ? C.green : C.g200"
            [style.color]="hasPrevProjects ? C.green : C.g500"
            (click)="hasPrevProjects = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Yes, we've completed projects
          </div>
          <div class="toggle-opt"
            [style.background]="!hasPrevProjects ? C.g50 : '#fff'"
            [style.borderColor]="!hasPrevProjects ? C.g400 : C.g200"
            [style.color]="!hasPrevProjects ? C.g700 : C.g500"
            (click)="hasPrevProjects = false">
            No previous projects
          </div>
        </div>

        <div *ngIf="hasPrevProjects" class="prev-details">
          <app-input label="Completed projects" placeholder="e.g. 5" [value]="prevCount" (valueChange)="prevCount = $event"></app-input>
          <app-input label="Combined value (SAR)" placeholder="e.g. 50,000,000" [value]="prevValue" (valueChange)="prevValue = $event"></app-input>

          <div class="src-section">
            <div class="src-label">Financing sources</div>

            <!-- Stacked bar -->
            <div class="src-bar">
              <div class="src-bar-seg" *ngIf="finBank > 0" [style.width.%]="finBank" [style.background]="C.green">{{ finBank }}%</div>
              <div class="src-bar-seg" *ngIf="finFintech > 0" [style.width.%]="finFintech" [style.background]="C.blue500">{{ finFintech }}%</div>
              <div class="src-bar-seg" *ngIf="finFriends > 0" [style.width.%]="finFriends" [style.background]="C.amber500">{{ finFriends }}%</div>
              <div class="src-bar-seg" *ngIf="finSelf > 0" [style.width.%]="finSelf" [style.background]="C.g300">{{ finSelf }}%</div>
            </div>

            <!-- Source rows -->
            <div class="src-row">
              <div class="src-dot" [style.background]="C.green"></div>
              <span class="src-name">Bank</span>
              <div class="src-stepper">
                <button class="src-btn" [disabled]="finBank <= 0" (click)="adjustSource('bank', -5)">-</button>
                <span class="src-pct">{{ finBank }}%</span>
                <button class="src-btn" [disabled]="finSelf <= 0" (click)="adjustSource('bank', 5)">+</button>
              </div>
            </div>
            <div class="src-row">
              <div class="src-dot" [style.background]="C.blue500"></div>
              <span class="src-name">Fintech</span>
              <div class="src-stepper">
                <button class="src-btn" [disabled]="finFintech <= 0" (click)="adjustSource('fintech', -5)">-</button>
                <span class="src-pct">{{ finFintech }}%</span>
                <button class="src-btn" [disabled]="finSelf <= 0" (click)="adjustSource('fintech', 5)">+</button>
              </div>
            </div>
            <div class="src-row">
              <div class="src-dot" [style.background]="C.amber500"></div>
              <span class="src-name">Friends &amp; Family</span>
              <div class="src-stepper">
                <button class="src-btn" [disabled]="finFriends <= 0" (click)="adjustSource('friends', -5)">-</button>
                <span class="src-pct">{{ finFriends }}%</span>
                <button class="src-btn" [disabled]="finSelf <= 0" (click)="adjustSource('friends', 5)">+</button>
              </div>
            </div>
            <div class="src-row src-row-auto">
              <div class="src-dot" [style.background]="C.g300"></div>
              <span class="src-name">Self-Funded</span>
              <span class="src-auto" [style.color]="C.green">{{ finSelf }}%</span>
            </div>
          </div>
        </div>
      </app-card>

      <div class="nav-row" style="margin-top: 24px;">
        <app-btn variant="ghost" size="lg" (clicked)="prevStep()">&larr; Back</app-btn>
        <app-btn variant="primary" size="lg" (clicked)="nextStep()">
          Next: Upload Documents &rarr;
        </app-btn>
      </div>
    </div>

    <!-- Step 2: Upload Company Documents -->
    <div *ngIf="step === 2" class="step-content animate-in">
      <app-card [padding]="32">
        <div class="section-header">
          <div class="section-icon" [style.background]="C.amber50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h2 class="section-title">Company Documents</h2>
        </div>

        <p class="section-desc">Upload the required company documents. These are necessary for verifying your company's eligibility.</p>

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
                <app-badge *ngIf="doc.required" color="red" style="margin-left: 6px;">Required</app-badge>
                <app-badge *ngIf="!doc.required" color="gray" style="margin-left: 6px;">Optional</app-badge>
              </div>
              <div class="doc-desc">{{ doc.desc }}</div>
              <div *ngIf="doc.uploaded" class="doc-file">{{ doc.fileName }}</div>
            </div>
            <div class="doc-actions">
              <button *ngIf="!doc.uploaded" class="doc-upload-btn" (click)="simulateUpload(doc)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload
              </button>
              <button *ngIf="doc.uploaded" class="doc-view-btn">View</button>
              <button *ngIf="doc.uploaded" class="doc-remove-btn" (click)="removeDoc(doc)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <span>Accepted formats: PDF, PNG, JPG. Max file size: 10MB.</span>
        </div>
      </app-card>

      <div class="nav-row" style="margin-top: 24px;">
        <app-btn variant="ghost" size="lg" (clicked)="prevStep()">&larr; Back</app-btn>
        <app-btn variant="primary" size="lg" [disabled]="!companyRequiredDocsDone" (clicked)="nextStep()">
          Next: Declaration &rarr;
        </app-btn>
      </div>
    </div>

    <!-- Step 3: Sign Declaration -->
    <div *ngIf="step === 3" class="step-content animate-in">
      <app-card [padding]="32">
        <div class="section-header">
          <div class="section-icon" [style.background]="C.g100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g600" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <h2 class="section-title">Declaration of No Legal Proceedings</h2>
        </div>

        <p class="section-desc">Please confirm whether your company is currently involved in any major litigations or legal proceedings.</p>

        <div class="decl-question">
          <div class="decl-q-label">Does your company have any major litigations or legal proceedings?</div>
          <div class="toggle-row">
            <div class="toggle-opt"
              [style.background]="hasLitigations === true ? C.amber50 : '#fff'"
              [style.borderColor]="hasLitigations === true ? C.amber500 : C.g200"
              [style.color]="hasLitigations === true ? C.amber600 : C.g500"
              (click)="hasLitigations = true; declarationSigned = false">
              Yes
            </div>
            <div class="toggle-opt"
              [style.background]="hasLitigations === false ? C.greenLt : '#fff'"
              [style.borderColor]="hasLitigations === false ? C.green : C.g200"
              [style.color]="hasLitigations === false ? C.green : C.g500"
              (click)="hasLitigations = false; declarationSigned = false">
              <svg *ngIf="hasLitigations === false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              No
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
            <span>Disclosing litigations will not automatically disqualify your application. Our team will review the details.</span>
          </div>
          <label class="field-label">Please describe the legal proceedings</label>
          <textarea class="textarea-field" [(ngModel)]="litigationDetails" placeholder="Describe the nature, status, and expected resolution of any major litigations..." rows="4"></textarea>
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
              <div class="decl-sign-title">Sign declaration letter</div>
              <div class="decl-sign-desc">You will be redirected to an external signing service to digitally sign the declaration confirming no major legal proceedings.</div>
            </div>
            <app-btn variant="primary" size="md" [full]="true" (clicked)="declarationSignPending = true">
              Sign Declaration &rarr;
            </app-btn>
          </div>

          <!-- Simulated signing -->
          <div *ngIf="declarationSignPending && !declarationSigned" class="decl-demo">
            <div class="decl-demo-label">Demo: Simulate signing result</div>
            <div class="decl-demo-row">
              <button class="decl-demo-btn decl-demo-success" (click)="declarationSigned = true; declarationSignPending = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Signed Successfully
              </button>
              <button class="decl-demo-btn decl-demo-fail" (click)="declarationSignPending = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Signing Failed
              </button>
            </div>
          </div>

          <!-- Signed success -->
          <div *ngIf="declarationSigned" class="decl-success">
            <div class="decl-success-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="decl-success-text">
              <div class="decl-success-title">Declaration signed successfully</div>
              <div class="decl-success-desc">Your declaration of no major legal proceedings has been digitally signed and recorded.</div>
            </div>
          </div>
        </div>
      </app-card>

      <div class="nav-row" style="margin-top: 24px;">
        <app-btn variant="ghost" size="lg" (clicked)="prevStep()">&larr; Back</app-btn>
        <app-btn variant="primary" size="lg" [disabled]="!canComplete" (clicked)="onComplete()">
          Complete Verification &rarr;
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

    /* Info grid */
    .info-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;
    }

    .info-item { background: ${C.g50}; border-radius: 10px; padding: 12px; }

    .info-label {
      font-size: 11px; font-weight: 700; color: ${C.g400};
      margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px;
    }

    .info-value {
      font-size: 13px; font-weight: 700; color: ${C.g800};
      display: flex; align-items: center;
    }

    /* Consent card */
    .consent-card { background: ${C.blue50}; border-radius: 12px; padding: 16px; }

    .consent-row { display: flex; align-items: flex-start; gap: 12px; }

    .consent-cb {
      width: 18px; height: 18px; margin-top: 2px;
      accent-color: ${C.green}; cursor: pointer; flex-shrink: 0;
    }

    .consent-title { font-size: 14px; font-weight: 700; color: ${C.g900}; margin: 0 0 4px 0; }
    .consent-desc { font-size: 13px; color: ${C.g500}; line-height: 1.5; margin: 0; }

    /* Toggle row */
    .toggle-row { display: flex; gap: 10px; margin-bottom: 20px; }

    .toggle-opt {
      flex: 1; padding: 12px; border-radius: 10px; border: 1.5px solid ${C.g200};
      font-size: 13px; font-weight: 700; cursor: pointer; text-align: center;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: all 0.15s ease;
    }

    .prev-details { margin-top: 4px; }

    /* Financing source section */
    .src-section { margin-top: 8px; }
    .src-label { font-size: 13px; font-weight: 700; color: ${C.g700}; margin-bottom: 12px; }

    .src-bar {
      display: flex; height: 28px; border-radius: 8px; overflow: hidden;
      margin-bottom: 16px; background: ${C.g100};
    }

    .src-bar-seg {
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; color: #fff; min-width: 0;
      transition: width 0.2s ease; overflow: hidden; white-space: nowrap;
    }

    .src-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; background: ${C.g50}; border-radius: 10px; margin-bottom: 6px;
    }

    .src-row-auto { background: transparent; border: 1.5px dashed ${C.g200}; }

    .src-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .src-name { font-size: 13px; font-weight: 700; color: ${C.g700}; flex: 1; }

    .src-stepper {
      display: flex; align-items: center; background: #fff;
      border: 1.5px solid ${C.g200}; border-radius: 8px; overflow: hidden;
    }

    .src-btn {
      width: 32px; height: 32px; border: none; background: transparent;
      font-size: 16px; font-weight: 700; color: ${C.g600}; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: background 0.1s ease;
    }
    .src-btn:hover:not(:disabled) { background: ${C.g100}; }
    .src-btn:disabled { color: ${C.g300}; cursor: default; }

    .src-pct {
      font-size: 13px; font-weight: 800; color: ${C.g900}; width: 40px; text-align: center;
      border-left: 1px solid ${C.g200}; border-right: 1px solid ${C.g200}; padding: 0 4px;
    }

    .src-auto { font-size: 14px; font-weight: 800; margin-left: auto; }

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
      background: #fff; color: ${C.g400}; cursor: pointer; font-family: inherit;
      display: flex; align-items: center; justify-content: center; transition: all 0.15s;
    }
    .doc-remove-btn:hover { border-color: ${C.red500}; color: ${C.red500}; }

    .doc-hint {
      display: flex; align-items: center; gap: 8px; margin-top: 14px;
      font-size: 12px; color: ${C.g400};
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

  // Company details
  companyFields: string[][] = [
    ['Legal Name (EN)', 'Al Omran Real Estate Dev Co.'],
    ['Legal Name (AR)', '\u0634\u0631\u0643\u0629 \u0627\u0644\u0639\u0645\u0631\u0627\u0646 \u0644\u0644\u062a\u0637\u0648\u064a\u0631 \u0627\u0644\u0639\u0642\u0627\u0631\u064a'],
    ['CR Number', '1010234567'],
    ['Legal Form', 'LLC'],
    ['Status', 'Active'],
    ['Capital', 'SAR 10,000,000'],
    ['Company Size', '50-100 employees'],
    ['Type', 'Real Estate Developer'],
    ['Unified No.', '7001234567'],
  ];
  companyWebsite = '';
  creditAuth = false;

  // Previous projects
  hasPrevProjects = true;
  prevCount = '';
  prevValue = '';
  finBank = 40;
  finFintech = 20;
  finFriends = 15;

  // Documents
  companyDocSlots: DocSlot[] = [
    { name: 'Owner ID', desc: 'National ID or Iqama of the company owner. Ensure the document is valid and not expired.', required: true, uploaded: false, fileName: '' },
    { name: 'Owner Credit History Report', desc: 'Recent credit report from SIMAH (Saudi Credit Bureau). The report must be issued within the last 3 months.', required: true, uploaded: false, fileName: '' },
  ];

  // Declaration
  hasLitigations: boolean | null = null;
  litigationDetails = '';
  declarationSigned = false;
  declarationSignPending = false;

  get title(): string {
    switch (this.step) {
      case 0: return 'Review Company Details';
      case 1: return 'Share Previous Projects';
      case 2: return 'Upload Company Documents';
      case 3: return 'Sign Declaration';
      default: return 'Company Verification';
    }
  }

  get subtitle(): string {
    switch (this.step) {
      case 0: return 'Please review your company information and authorize the credit bureau check.';
      case 1: return 'Tell us about your track record to strengthen your application.';
      case 2: return 'Upload the required documents for your company verification.';
      case 3: return 'Confirm whether your company has any major legal proceedings.';
      default: return '';
    }
  }

  get finSelf(): number {
    return Math.max(0, 100 - this.finBank - this.finFintech - this.finFriends);
  }

  get companyRequiredDocsDone(): boolean {
    return this.companyDocSlots.filter(d => d.required).every(d => d.uploaded);
  }

  get canComplete(): boolean {
    if (this.hasLitigations === null) return false;
    if (this.hasLitigations === true) return this.litigationDetails.trim().length > 0;
    return this.declarationSigned;
  }

  /** Allow parent to jump to a completed step (e.g. from progress bar click) */
  jumpTo(s: number): void {
    if (s >= 0 && s <= 3 && s < this.step) {
      this.step = s;
      this.stepChanged.emit(this.step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextStep(): void {
    if (this.step < 3) {
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

  adjustSource(source: 'bank' | 'fintech' | 'friends', delta: number): void {
    const used = this.finBank + this.finFintech + this.finFriends;
    const remaining = 100 - used;
    if (source === 'bank') {
      this.finBank = Math.max(0, Math.min(this.finBank + delta, this.finBank + remaining));
    } else if (source === 'fintech') {
      this.finFintech = Math.max(0, Math.min(this.finFintech + delta, this.finFintech + remaining));
    } else {
      this.finFriends = Math.max(0, Math.min(this.finFriends + delta, this.finFriends + remaining));
    }
  }

  simulateUpload(doc: DocSlot): void {
    doc.uploaded = true;
    doc.fileName = doc.name.toLowerCase().replace(/\s+/g, '_') + '.pdf';
  }

  removeDoc(doc: DocSlot): void {
    doc.uploaded = false;
    doc.fileName = '';
  }

  onComplete(): void {
    this.completed.emit();
  }
}
