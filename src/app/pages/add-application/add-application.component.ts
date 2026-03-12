import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  CardComponent,
  InputComponent,
  ProgressStepsComponent,
} from '../../shared';

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    BackLinkComponent,
    ButtonComponent,
    CardComponent,
    InputComponent,
    ProgressStepsComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>

      <!-- ============ SUCCESS PAGE ============ -->
      <div *ngIf="submitted" class="success-page animate-in">
        <div class="success-card">
          <!-- Animated check circle -->
          <div class="success-icon-wrap">
            <div class="success-ring"></div>
            <div class="success-check-circle">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>

          <h1 class="success-title">Application Submitted!</h1>
          <p class="success-desc">Your financing application has been submitted successfully and is now under review by our team.</p>

          <!-- Summary card -->
          <div class="success-summary">
            <div class="summary-row">
              <div class="summary-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
              </div>
              <div class="summary-info">
                <div class="summary-label">Project</div>
                <div class="summary-value">{{ selectedProject }}</div>
              </div>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row">
              <div class="summary-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div class="summary-info">
                <div class="summary-label">Product</div>
                <div class="summary-value">{{ getProductName() }}</div>
              </div>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row">
              <div class="summary-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              </div>
              <div class="summary-info">
                <div class="summary-label">Amount</div>
                <div class="summary-value">{{ formatAmount(financingAmount) }} SAR</div>
              </div>
            </div>
          </div>

          <!-- What happens next -->
          <div class="next-steps">
            <div class="next-steps-title">What happens next?</div>
            <div class="next-step-item">
              <div class="next-step-num" [style.background]="C.greenLt" [style.color]="C.green">1</div>
              <span>Our team will review your project and company details</span>
            </div>
            <div class="next-step-item">
              <div class="next-step-num" [style.background]="C.greenLt" [style.color]="C.green">2</div>
              <span>You'll receive a term-sheet within 48 hours</span>
            </div>
            <div class="next-step-item">
              <div class="next-step-num" [style.background]="C.greenLt" [style.color]="C.green">3</div>
              <span>Accept the terms and sign the agreement to proceed</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="success-actions">
            <app-btn variant="primary" size="lg" (clicked)="goToStatus()">
              View Application Status &rarr;
            </app-btn>
            <app-btn variant="ghost" (clicked)="go('/dashboard')">
              Back to Dashboard
            </app-btn>
          </div>
        </div>
      </div>

      <!-- ============ FORM WIZARD ============ -->
      <div *ngIf="!submitted" class="container">
        <app-back-link to="/dashboard/applications" label="Back to Applications"></app-back-link>

        <h1 class="page-title">New Financing Application</h1>
        <p class="page-subtitle">Select a project and specify your financing needs to submit for review.</p>

        <!-- Progress Steps -->
        <div class="progress-bar">
          <app-progress-steps
            [steps]="stepLabels"
            [current]="displayStep"
            (stepClick)="onStepClick($event)"
          ></app-progress-steps>
        </div>

        <!-- Pre-selected project info banner -->
        <div *ngIf="projectPreSelected && step >= 1 && step <= 2" class="preselected-banner">
          <div class="preselected-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
          </div>
          <div class="preselected-info">
            <div class="preselected-label">Applying for</div>
            <div class="preselected-name">{{ selectedProject }}</div>
          </div>
          <div class="preselected-sub">{{ getSelectedProjectType() }} &middot; {{ getSelectedProjectCompany() }}</div>
        </div>

        <!-- ============ STEP 0: Select Project (only when no pre-selection) ============ -->
        <div *ngIf="!projectPreSelected && step === 0" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Select Project</div>
            <div class="section-desc">Choose the project you want to apply financing for.</div>

            <div class="project-list">
              <div
                *ngFor="let p of projects"
                class="project-row"
                [class.selected]="selectedProject === p.name"
                [style.borderColor]="selectedProject === p.name ? C.green : C.g200"
                [style.background]="selectedProject === p.name ? C.greenLt : '#fff'"
                (click)="selectProject(p.name)"
              >
                <div class="project-left">
                  <div class="project-icon" [style.background]="selectedProject === p.name ? C.green : C.g100" [style.color]="selectedProject === p.name ? '#fff' : C.g500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 3h7l2 2h9v16H3z"/>
                    </svg>
                  </div>
                  <div class="project-info">
                    <div class="project-name">{{ p.name }}</div>
                    <div class="project-detail">
                      {{ p.type }} &middot; {{ p.company }}
                    </div>
                  </div>
                </div>
                <div class="project-check" *ngIf="selectedProject === p.name">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- ============ STEP 1: Financing Product (single-select, auto-advance) ============ -->
        <div *ngIf="step === 1" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Select Financing Product</div>
            <div class="section-desc">Choose the type of financing that best suits your project needs.</div>

            <div class="product-list">
              <div
                *ngFor="let p of products"
                class="product-card"
                [class.selected]="financingProduct === p.id"
                [style.borderColor]="financingProduct === p.id ? C.green : C.g200"
                [style.background]="financingProduct === p.id ? C.greenLt : '#fff'"
                (click)="selectProduct(p.id)"
              >
                <div class="product-card-left">
                  <div class="product-card-icon" [style.background]="financingProduct === p.id ? C.green : C.g100" [style.color]="financingProduct === p.id ? '#fff' : C.g500">
                    <svg *ngIf="p.id==='land'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <svg *ngIf="p.id==='residential'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <svg *ngIf="p.id==='commercial'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="16" rx="2"/><path d="M12 2v4m-4 8h8m-8 4h4"/></svg>
                    <svg *ngIf="p.id==='rawland'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                    <svg *ngIf="p.id==='bridge'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div class="product-card-info">
                    <div class="product-card-name" [style.color]="financingProduct === p.id ? C.greenDk : C.g900">{{ p.t }}</div>
                    <div class="product-card-desc" [style.color]="financingProduct === p.id ? C.green : C.g500">{{ p.d }}</div>
                  </div>
                </div>
                <div class="product-card-check" *ngIf="financingProduct === p.id">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- ============ STEP 2: Financing Amount with Ratio Visualizations ============ -->
        <div *ngIf="step === 2" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Financing Amount</div>
            <div class="section-desc">Enter the financing amount you need and see how it compares to your project metrics.</div>

            <app-input
              label="Financing Amount"
              placeholder="e.g. 30,000,000"
              suffix="SAR"
              helper="The total financing amount you are requesting"
              [value]="financingAmount"
              (valueChange)="financingAmount = $event"
            ></app-input>
          </app-card>

          <!-- Ratio Visualizations -->
          <div *ngIf="parsedAmount > 0" class="ratio-section animate-in">
            <div class="ratio-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span>Financing Ratios</span>
            </div>

            <!-- Ratio: Financing / Total Project Cost -->
            <div class="ratio-card">
              <div class="ratio-card-top">
                <div class="ratio-label">
                  <div class="ratio-label-icon" [style.background]="C.blue50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <span>Financing to Total Project Cost</span>
                </div>
                <div class="ratio-value" [style.color]="getRatioColor(financingToProjectCost)">{{ financingToProjectCost }}%</div>
              </div>
              <div class="ratio-bar-track">
                <div class="ratio-bar-fill" [style.width.%]="Math.min(financingToProjectCost, 100)" [style.background]="getRatioColor(financingToProjectCost)"></div>
              </div>
              <div class="ratio-amounts">
                <span>{{ formatShort(parsedAmount) }} of {{ formatShort(selectedProjectData?.cost || 0) }}</span>
              </div>
            </div>

            <!-- Ratio: Financing / Land Value -->
            <div class="ratio-card">
              <div class="ratio-card-top">
                <div class="ratio-label">
                  <div class="ratio-label-icon" [style.background]="C.amber50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <span>Financing to Land Value</span>
                </div>
                <div class="ratio-value" [style.color]="getRatioColor(financingToLandValue)">{{ financingToLandValue }}%</div>
              </div>
              <div class="ratio-bar-track">
                <div class="ratio-bar-fill" [style.width.%]="Math.min(financingToLandValue, 100)" [style.background]="getRatioColor(financingToLandValue)"></div>
              </div>
              <div class="ratio-amounts">
                <span>{{ formatShort(parsedAmount) }} of {{ formatShort(selectedProjectData?.land || 0) }}</span>
              </div>
            </div>

            <!-- Ratio: Financing / Revenue -->
            <div class="ratio-card">
              <div class="ratio-card-top">
                <div class="ratio-label">
                  <div class="ratio-label-icon" [style.background]="C.greenLt">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                  </div>
                  <span>Financing to Projected Revenue</span>
                </div>
                <div class="ratio-value" [style.color]="getRatioColor(financingToRevenue)">{{ financingToRevenue }}%</div>
              </div>
              <div class="ratio-bar-track">
                <div class="ratio-bar-fill" [style.width.%]="Math.min(financingToRevenue, 100)" [style.background]="getRatioColor(financingToRevenue)"></div>
              </div>
              <div class="ratio-amounts">
                <span>{{ formatShort(parsedAmount) }} of {{ formatShort(selectedProjectData?.revenue || 0) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ============ STEP 3: Enhanced Review & Submit ============ -->
        <div *ngIf="step === 3" class="animate-in">
          <app-card [padding]="0">
            <!-- Review header -->
            <div class="review-top">
              <div class="review-top-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="16 13 12 17 9 14"/></svg>
              </div>
              <div class="review-top-text">
                <div class="review-top-title">Review Your Application</div>
                <div class="review-top-desc">Please verify all details before submitting.</div>
              </div>
            </div>

            <div class="review-body">
              <!-- Project section -->
              <div class="review-block">
                <div class="review-block-header">
                  <div class="review-block-icon" [style.background]="C.blue50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
                  </div>
                  <span class="review-block-title">Project</span>
                  <button *ngIf="!projectPreSelected" class="edit-link" (click)="step = 0">Edit</button>
                </div>
                <div class="review-block-content">
                  <div class="review-block-value">{{ selectedProject }}</div>
                  <div class="review-block-sub">{{ getSelectedProjectType() }} &middot; {{ getSelectedProjectCompany() }}</div>
                </div>
              </div>

              <!-- Product section -->
              <div class="review-block">
                <div class="review-block-header">
                  <div class="review-block-icon" [style.background]="C.amber50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <span class="review-block-title">Financing Product</span>
                  <button class="edit-link" (click)="step = 1">Edit</button>
                </div>
                <div class="review-block-content">
                  <div class="review-block-value">{{ getProductName() }}</div>
                  <div class="review-block-sub">{{ getProductDescription() }}</div>
                </div>
              </div>

              <!-- Amount section -->
              <div class="review-block last">
                <div class="review-block-header">
                  <div class="review-block-icon" [style.background]="C.greenLt">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                  </div>
                  <span class="review-block-title">Financing Amount</span>
                  <button class="edit-link" (click)="step = 2">Edit</button>
                </div>
                <div class="review-block-content">
                  <div class="review-block-value">{{ formatAmount(financingAmount) }} SAR</div>
                  <div class="review-ratios-mini">
                    <span class="ratio-chip" [style.background]="C.blue50" [style.color]="C.blue500">{{ financingToProjectCost }}% of project cost</span>
                    <span class="ratio-chip" [style.background]="C.amber50" [style.color]="C.amber600">{{ financingToLandValue }}% of land value</span>
                    <span class="ratio-chip" [style.background]="C.greenLt" [style.color]="C.green">{{ financingToRevenue }}% of revenue</span>
                  </div>
                </div>
              </div>
            </div>
          </app-card>

          <!-- Confirmation card -->
          <div class="confirm-card" [class.confirmed]="accuracy" (click)="accuracy = !accuracy">
            <div class="confirm-check" [class.checked]="accuracy">
              <svg *ngIf="accuracy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="confirm-text">
              <div class="confirm-title">Confirm accuracy</div>
              <div class="confirm-desc">I confirm that all information provided is accurate to the best of my knowledge and I authorize Safqah to review my application.</div>
            </div>
          </div>
        </div>

        <!-- ============ NAVIGATION BAR ============ -->
        <div class="wizard-nav">
          <app-btn *ngIf="step > firstStep" variant="ghost" (clicked)="prevStep()">
            &#8592; Back
          </app-btn>
          <div *ngIf="step === firstStep" class="nav-spacer"></div>

          <app-btn *ngIf="step === 2" variant="primary"
            [disabled]="!isStepValid(step)"
            (clicked)="nextStep()">
            Next: Review &amp; Submit &rarr;
          </app-btn>
          <app-btn *ngIf="step === 3" variant="primary" size="lg"
            [disabled]="!canSubmit"
            (clicked)="submit()">
            Submit Application for Review &rarr;
          </app-btn>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: ${C.bg};
      min-height: 100vh;
    }

    .container {
      max-width: 700px;
      margin: 0 auto;
      padding: 32px 32px 60px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 6px 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: ${C.g500};
      margin: 0 0 28px 0;
      line-height: 1.5;
    }

    .progress-bar {
      position: relative;
      margin-bottom: 8px;
    }

    .animate-in {
      animation: slideIn 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    app-card {
      display: block;
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: ${C.g900};
      margin-bottom: 4px;
    }

    .section-desc {
      font-size: 13px;
      color: ${C.g500};
      margin-bottom: 20px;
      line-height: 1.5;
    }

    /* Pre-selected project banner */
    .preselected-banner {
      display: flex; align-items: center; gap: 12px;
      background: ${C.greenLt}; border: 1.5px solid ${C.greenMd};
      border-radius: 12px; padding: 14px 16px;
      margin-bottom: 20px;
    }
    .preselected-icon {
      width: 36px; height: 36px; border-radius: 9px;
      background: ${C.green}1a;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .preselected-info { flex: 1; }
    .preselected-label {
      font-size: 10px; font-weight: 700; color: ${C.green};
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .preselected-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }
    .preselected-sub { font-size: 12px; color: ${C.g500}; flex-shrink: 0; }

    /* Project Selector */
    .project-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .project-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border: 1.5px solid ${C.g200};
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .project-row:hover {
      border-color: ${C.g300};
    }

    .project-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .project-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }

    .project-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .project-name {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g900};
    }

    .project-detail {
      font-size: 12px;
      color: ${C.g500};
    }

    .project-check {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${C.green};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* ===== Financing Product Cards (Step 1) ===== */
    .product-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .product-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 16px;
      border: 1.5px solid ${C.g200};
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .product-card:hover {
      border-color: ${C.green}80;
    }

    .product-card-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .product-card-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }

    .product-card-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .product-card-name {
      font-size: 14px;
      font-weight: 700;
    }

    .product-card-desc {
      font-size: 12px;
      line-height: 1.5;
    }

    .product-card-check {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: ${C.green};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* ===== Ratio Visualizations (Step 2) ===== */
    .ratio-section {
      margin-top: 4px;
    }

    .ratio-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 800;
      color: ${C.g700};
      margin-bottom: 14px;
    }

    .ratio-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 12px;
    }

    .ratio-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .ratio-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 600;
      color: ${C.g700};
    }

    .ratio-label-icon {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .ratio-value {
      font-size: 20px;
      font-weight: 900;
    }

    .ratio-bar-track {
      width: 100%;
      height: 8px;
      background: ${C.g100};
      border-radius: 4px;
      overflow: hidden;
    }

    .ratio-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease, background 0.3s ease;
      min-width: 2px;
    }

    .ratio-amounts {
      margin-top: 8px;
      font-size: 12px;
      color: ${C.g400};
      font-weight: 600;
    }

    /* ===== Enhanced Review (Step 3) ===== */
    .review-top {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 28px;
      background: ${C.green};
      border-radius: 14px 14px 0 0;
    }

    .review-top-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .review-top-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .review-top-title {
      font-size: 17px;
      font-weight: 800;
      color: #fff;
    }

    .review-top-desc {
      font-size: 13px;
      color: rgba(255,255,255,0.8);
    }

    .review-body {
      padding: 8px 28px 20px;
    }

    .review-block {
      padding: 20px 0;
      border-bottom: 1px solid ${C.g100};
    }

    .review-block.last {
      border-bottom: none;
      padding-bottom: 8px;
    }

    .review-block-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .review-block-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .review-block-title {
      font-size: 12px;
      font-weight: 800;
      color: ${C.g400};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex: 1;
    }

    .edit-link {
      background: none;
      border: none;
      font-size: 13px;
      font-weight: 700;
      color: ${C.green};
      cursor: pointer;
      font-family: inherit;
      padding: 4px 10px;
      border-radius: 6px;
      transition: background 0.15s;
    }

    .edit-link:hover {
      background: ${C.greenLt};
    }

    .review-block-content {
      padding-left: 38px;
    }

    .review-block-value {
      font-size: 15px;
      font-weight: 700;
      color: ${C.g900};
      margin-bottom: 3px;
    }

    .review-block-sub {
      font-size: 12px;
      color: ${C.g500};
    }

    .review-ratios-mini {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    .ratio-chip {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
    }

    /* ===== Confirmation Card ===== */
    .confirm-card {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 20px;
      background: #fff;
      border: 2px solid ${C.g200};
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }

    .confirm-card:hover {
      border-color: ${C.g300};
    }

    .confirm-card.confirmed {
      border-color: ${C.green};
      background: ${C.greenLt};
    }

    .confirm-check {
      width: 22px;
      height: 22px;
      border-radius: 7px;
      border: 2px solid ${C.g300};
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
      transition: all 0.15s ease;
    }

    .confirm-check.checked {
      background: ${C.green};
      border-color: ${C.green};
    }

    .confirm-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .confirm-title {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g900};
    }

    .confirm-desc {
      font-size: 13px;
      color: ${C.g500};
      line-height: 1.5;
    }

    /* Wizard navigation */
    .wizard-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      gap: 12px;
    }

    .nav-spacer { flex: 1; }

    /* ===== Success Page ===== */
    .success-page {
      max-width: 560px;
      margin: 0 auto;
      padding: 48px 32px 60px;
    }

    .success-card {
      text-align: center;
    }

    .success-icon-wrap {
      position: relative;
      width: 88px;
      height: 88px;
      margin: 0 auto 28px;
    }

    .success-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid ${C.green}20;
      animation: ringPulse 1.5s ease-out;
    }

    @keyframes ringPulse {
      0% { transform: scale(0.5); opacity: 0; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }

    .success-check-circle {
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      background: ${C.green};
      display: flex;
      align-items: center;
      justify-content: center;
      animation: checkPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 8px 24px ${C.green}30;
    }

    @keyframes checkPop {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .success-title {
      font-size: 24px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 8px 0;
    }

    .success-desc {
      font-size: 14px;
      color: ${C.g500};
      line-height: 1.6;
      margin: 0 0 32px 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .success-summary {
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 14px;
      padding: 6px 0;
      margin-bottom: 28px;
      text-align: left;
    }

    .summary-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 20px;
    }

    .summary-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: ${C.g50};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .summary-info { flex: 1; min-width: 0; }

    .summary-label {
      font-size: 11px;
      font-weight: 700;
      color: ${C.g400};
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 1px;
    }

    .summary-value {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g900};
    }

    .summary-divider {
      height: 1px;
      background: ${C.g100};
      margin: 0 20px;
    }

    .next-steps {
      background: ${C.greenLt};
      border: 1.5px solid ${C.greenMd};
      border-radius: 14px;
      padding: 20px 24px;
      margin-bottom: 32px;
      text-align: left;
    }

    .next-steps-title {
      font-size: 13px;
      font-weight: 800;
      color: ${C.g800};
      margin-bottom: 14px;
    }

    .next-step-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: ${C.g600};
      line-height: 1.5;
    }

    .next-step-item + .next-step-item {
      margin-top: 10px;
    }

    .next-step-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      flex-shrink: 0;
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    @media (max-width: 600px) {
      .success-page { padding: 32px 20px 40px; }
      .review-top { padding: 20px; }
      .review-body { padding: 8px 20px 16px; }
      .review-block-content { padding-left: 0; }
    }

    @media (max-width: 768px) {
      .container { padding: 24px 16px 48px; }
      .page-title { font-size: 20px; }
    }

    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .page-title { font-size: 18px; }
      .section-title { font-size: 15px; }
    }
  `],
})
export class AddApplicationComponent implements OnInit {
  C = C;
  Math = Math;

  step = 0;
  submitted = false;
  projectPreSelected = false;

  // Project selection
  selectedProject = '';
  projects = [
    { name: 'Al Noor Residential', type: 'Mixed Use', company: 'Al Omran Real Estate Dev Co.', cost: 85_000_000, land: 32_000_000, revenue: 120_000_000 },
    { name: 'Riyadh Commercial Plaza', type: 'Commercial', company: 'Al Omran Real Estate Dev Co.', cost: 150_000_000, land: 60_000_000, revenue: 210_000_000 },
    { name: 'Tabuk Residential Complex', type: 'Residential', company: 'Al Omran Real Estate Dev Co.', cost: 42_000_000, land: 18_000_000, revenue: 58_000_000 },
    { name: 'Khobar Mixed-Use Tower', type: 'Mixed Use', company: 'Al Omran Real Estate Dev Co.', cost: 200_000_000, land: 75_000_000, revenue: 280_000_000 },
    { name: 'Jeddah Waterfront Villas', type: 'Residential', company: 'Al Omran Real Estate Dev Co.', cost: 95_000_000, land: 45_000_000, revenue: 135_000_000 },
    { name: 'Abha Mountain Villas', type: 'Residential', company: 'Al Omran Real Estate Dev Co.', cost: 38_000_000, land: 14_000_000, revenue: 52_000_000 },
    { name: 'Al Rawdah Gardens', type: 'Residential', company: 'Al Omran Real Estate Dev Co.', cost: 65_000_000, land: 25_000_000, revenue: 90_000_000 },
    { name: 'Eastern Industrial Park', type: 'Industrial', company: 'Al Jazeera Development Co.', cost: 110_000_000, land: 40_000_000, revenue: 160_000_000 },
    { name: 'Madinah Commercial Hub', type: 'Commercial', company: 'Al Jazeera Development Co.', cost: 72_000_000, land: 28_000_000, revenue: 105_000_000 },
  ];

  // Financing state
  financingProduct = '';
  financingAmount = '';
  accuracy = false;

  products = [
    { id: 'land', t: 'Land Acquisition Financing', d: 'Acquire the right land at the right time.' },
    { id: 'residential', t: 'Residential Development Financing', d: 'Develop residential communities and contribute to increasing the localization rate.' },
    { id: 'commercial', t: 'Commercial Development Financing', d: 'Expand the range of projects available, including modern office spaces, retail, and industrial developments.' },
    { id: 'rawland', t: 'Raw Land Development Financing', d: 'Transform raw land; successful investment starts from the ground up.' },
    { id: 'bridge', t: 'Bridging Financing', d: 'Quick, short-term, low-cost financing that protects you from liquidity delays.' },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const projectParam = this.route.snapshot.queryParamMap.get('project');
    if (projectParam) {
      this.selectedProject = projectParam;
      this.projectPreSelected = true;
      this.step = 1; // Skip project selection, go straight to product
    }
  }

  /** The step labels shown in the progress bar */
  get stepLabels(): string[] {
    return this.projectPreSelected
      ? ['Financing Product', 'Financing Amount', 'Review & Submit']
      : ['Select Project', 'Financing Product', 'Financing Amount', 'Review & Submit'];
  }

  /** Maps internal step (0-3) to display step for the progress bar */
  get displayStep(): number {
    return this.projectPreSelected ? this.step - 1 : this.step;
  }

  /** The first step the user can navigate back to */
  get firstStep(): number {
    return this.projectPreSelected ? 1 : 0;
  }

  // Step validation
  get step0Valid(): boolean { return !!this.selectedProject; }
  get step1Valid(): boolean { return !!this.financingProduct; }
  get step2Valid(): boolean { return !!this.financingAmount && this.parsedAmount > 0; }
  get canSubmit(): boolean { return this.step0Valid && this.step1Valid && this.step2Valid && this.accuracy; }

  isStepValid(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0: return this.step0Valid;
      case 1: return this.step1Valid;
      case 2: return this.step2Valid;
      case 3: return this.canSubmit;
      default: return false;
    }
  }

  selectProject(name: string): void {
    this.selectedProject = name;
    // Auto-advance since this is a single-select step
    setTimeout(() => {
      this.step = 1;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  }

  selectProduct(id: string): void {
    this.financingProduct = id;
    // Auto-advance since this is a single-select step
    setTimeout(() => {
      this.step = 2;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  }

  nextStep(): void {
    if (this.step < 3 && this.isStepValid(this.step)) {
      this.step++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.step > this.firstStep) {
      this.step--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onStepClick(index: number): void {
    // Map display index back to internal step
    const internalStep = this.projectPreSelected ? index + 1 : index;
    if (internalStep <= this.step) {
      this.step = internalStep;
    }
  }

  submit(): void {
    this.submitted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToStatus(): void {
    this.router.navigateByUrl('/application/1/status');
  }

  go(path: string): void {
    this.router.navigateByUrl(path);
  }

  // ===== Ratio calculations =====
  get selectedProjectData(): any {
    return this.projects.find(p => p.name === this.selectedProject) || null;
  }

  get parsedAmount(): number {
    return parseFloat(this.financingAmount.replace(/,/g, '')) || 0;
  }

  get financingToProjectCost(): number {
    const p = this.selectedProjectData;
    if (!p || !p.cost) return 0;
    return Math.round((this.parsedAmount / p.cost) * 100);
  }

  get financingToLandValue(): number {
    const p = this.selectedProjectData;
    if (!p || !p.land) return 0;
    return Math.round((this.parsedAmount / p.land) * 100);
  }

  get financingToRevenue(): number {
    const p = this.selectedProjectData;
    if (!p || !p.revenue) return 0;
    return Math.round((this.parsedAmount / p.revenue) * 100);
  }

  getRatioColor(percent: number): string {
    if (percent <= 50) return C.green;
    if (percent <= 75) return C.amber500;
    return C.red500;
  }

  formatShort(val: number): string {
    if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B SAR';
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M SAR';
    if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K SAR';
    return val.toLocaleString() + ' SAR';
  }

  // Helpers
  private getSelectedProject(): any {
    return this.projects.find(p => p.name === this.selectedProject);
  }

  getSelectedProjectType(): string {
    return this.getSelectedProject()?.type || '';
  }

  getSelectedProjectCompany(): string {
    return this.getSelectedProject()?.company || '';
  }

  getProductName(): string {
    return this.products.find(p => p.id === this.financingProduct)?.t || this.financingProduct;
  }

  getProductDescription(): string {
    return this.products.find(p => p.id === this.financingProduct)?.d || '';
  }

  formatAmount(val: string): string {
    const n = parseFloat(val.replace(/,/g, ''));
    return isNaN(n) ? val : n.toLocaleString('en-US');
  }
}
