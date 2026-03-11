import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  CardComponent,
  BadgeComponent,
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
    BadgeComponent,
    InputComponent,
    ProgressStepsComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard/applications" label="Back to Applications"></app-back-link>

        <h1 class="page-title">New Financing Application</h1>
        <p class="page-subtitle">Select a project and specify your financing needs to submit for review.</p>

        <!-- Progress Steps -->
        <div class="progress-bar">
          <app-progress-steps
            [steps]="stepLabels"
            [current]="step"
            (stepClick)="onStepClick($event)"
          ></app-progress-steps>
        </div>

        <!-- ============ STEP 0: Select Project ============ -->
        <div *ngIf="step === 0" class="animate-in">
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
                (click)="selectedProject = p.name"
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

        <!-- ============ STEP 1: Financing Request ============ -->
        <div *ngIf="step === 1" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Financing Request</div>
            <div class="section-desc" style="margin-bottom: 20px;">Select your financing product and specify the amount you need.</div>

            <!-- Financing Product -->
            <div class="field-label">Financing Product</div>
            <div class="product-grid">
              <div
                *ngFor="let p of products"
                class="product-btn"
                [style.borderColor]="financingProduct === p.id ? C.green : C.g200"
                [style.background]="financingProduct === p.id ? C.greenLt : C.white"
                (click)="financingProduct = p.id">
                <div class="product-icon-wrap" [style.color]="financingProduct === p.id ? C.green : C.g400">
                  <svg *ngIf="p.id==='land'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <svg *ngIf="p.id==='dev'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="16" rx="2"/><path d="M12 2v4m-4 8h8"/></svg>
                  <svg *ngIf="p.id==='rawland'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  <svg *ngIf="p.id==='bridge'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1.5-2 4-2 5.5 4 8 4 4-2 4-2V3s-1.5 2-4 2-5.5-4-8-4-4 2-4 2z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                </div>
                <div>
                  <div class="product-title" [style.color]="financingProduct === p.id ? C.greenDk : C.g800">{{ p.t }}</div>
                  <div class="product-desc" [style.color]="financingProduct === p.id ? C.green : C.g400">{{ p.d }}</div>
                </div>
              </div>
            </div>

            <!-- Financing Amount -->
            <div style="margin-top: 28px;">
              <app-input
                label="Financing Amount"
                placeholder="e.g. 30,000,000"
                suffix="SAR"
                helper="The total financing amount you are requesting"
                [value]="financingAmount"
                (valueChange)="financingAmount = $event"
              ></app-input>
            </div>
          </app-card>
        </div>

        <!-- ============ STEP 2: Review & Submit ============ -->
        <div *ngIf="step === 2" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Review Your Application</div>
            <div class="section-desc">Please review all details before submitting.</div>

            <!-- Project -->
            <div class="review-section">
              <div class="review-header">
                <span class="review-label">Project</span>
                <button class="edit-link" (click)="step = 0">Edit</button>
              </div>
              <div class="review-value">{{ selectedProject }}</div>
              <div class="review-sub">{{ getSelectedProjectType() }} &middot; {{ getSelectedProjectCompany() }}</div>
            </div>

            <!-- Financing -->
            <div class="review-section last">
              <div class="review-header">
                <span class="review-label">Financing Request</span>
                <button class="edit-link" (click)="step = 1">Edit</button>
              </div>
              <div class="review-grid">
                <div class="review-item">
                  <span class="review-item-label">Product</span>
                  <span class="review-item-value">{{ getProductName() }}</span>
                </div>
                <div class="review-item">
                  <span class="review-item-label">Amount</span>
                  <span class="review-item-value">{{ +financingAmount | number }} SAR</span>
                </div>
              </div>
            </div>
          </app-card>

          <!-- Accuracy checkbox -->
          <div class="submit-section">
            <label class="checkbox-row" (click)="accuracy = !accuracy">
              <div class="checkbox" [class.checked]="accuracy">
                <svg *ngIf="accuracy" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span class="checkbox-label">I confirm that all information provided is accurate to the best of my knowledge.</span>
            </label>
          </div>
        </div>

        <!-- ============ NAVIGATION BAR ============ -->
        <div class="wizard-nav">
          <app-btn *ngIf="step > 0" variant="ghost" (clicked)="prevStep()">
            &#8592; Back
          </app-btn>
          <div *ngIf="step === 0" class="nav-spacer"></div>

          <app-btn *ngIf="step < 2" variant="primary"
            [disabled]="!isStepValid(step)"
            (clicked)="nextStep()">
            Next: {{ stepLabels[step + 1] }} &rarr;
          </app-btn>
          <app-btn *ngIf="step === 2" variant="primary" size="lg"
            [disabled]="!canSubmit"
            (clicked)="submit()">
            Submit Application for Review &rarr;
          </app-btn>
        </div>

        <div class="cancel-row">
          <a class="cancel-link" (click)="go('/dashboard/applications')">Cancel</a>
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

    /* Financing Product */
    .field-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      margin-bottom: 12px;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .product-btn {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 16px 14px;
      border-radius: 12px;
      border: 2px solid ${C.g200};
      cursor: pointer;
      text-align: left;
      transition: all 0.15s;
      background: ${C.white};
    }

    .product-btn:hover {
      border-color: ${C.green};
    }

    .product-icon-wrap {
      flex-shrink: 0;
      margin-top: 2px;
      display: flex;
    }

    .product-title {
      font-size: 13px;
      font-weight: 700;
    }

    .product-desc {
      font-size: 11px;
      line-height: 1.4;
      margin-top: 2px;
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

    /* Review step */
    .review-section {
      padding: 18px 0;
      border-bottom: 1px solid ${C.g100};
    }

    .review-section.last {
      border-bottom: none;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .review-label {
      font-size: 14px;
      font-weight: 800;
      color: ${C.g800};
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

    .review-value {
      font-size: 15px;
      font-weight: 700;
      color: ${C.g900};
      margin-bottom: 2px;
    }

    .review-sub {
      font-size: 12px;
      color: ${C.g500};
    }

    .review-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 20px;
    }

    .review-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .review-item-label {
      font-size: 11px;
      font-weight: 700;
      color: ${C.g400};
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .review-item-value {
      font-size: 14px;
      font-weight: 600;
      color: ${C.g800};
    }

    /* Submit section */
    .submit-section {
      margin-top: 20px;
    }

    .checkbox-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .checkbox {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      border: 1.5px solid ${C.g300};
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s ease;
      margin-top: 1px;
    }

    .checkbox.checked {
      background: ${C.green};
      border-color: ${C.green};
    }

    .checkbox-label {
      font-size: 13px;
      color: ${C.g600};
      line-height: 1.5;
    }

    .cancel-row {
      text-align: center;
      margin-top: 14px;
    }

    .cancel-link {
      font-size: 13px;
      font-weight: 600;
      color: ${C.g500};
      cursor: pointer;
      text-decoration: none;
    }

    .cancel-link:hover {
      color: ${C.g700};
    }

    @media (max-width: 600px) {
      .review-grid {
        grid-template-columns: 1fr;
      }
      .product-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AddApplicationComponent {
  C = C;

  step = 0;
  stepLabels = ['Select Project', 'Financing Request', 'Review & Submit'];

  // Project selection
  selectedProject = '';
  projects = [
    { name: 'Al Noor Residential', type: 'Mixed Use', company: 'Al Omran Real Estate Dev Co.' },
    { name: 'Riyadh Commercial Plaza', type: 'Commercial', company: 'Al Omran Real Estate Dev Co.' },
    { name: 'Tabuk Residential Complex', type: 'Residential', company: 'Al Omran Real Estate Dev Co.' },
    { name: 'Khobar Mixed-Use Tower', type: 'Mixed Use', company: 'Al Omran Real Estate Dev Co.' },
    { name: 'Jeddah Waterfront Villas', type: 'Residential', company: 'Al Omran Real Estate Dev Co.' },
  ];

  // Financing state
  financingProduct = '';
  financingAmount = '';
  accuracy = false;

  products = [
    { id: 'land', t: 'Land Acquisition', d: 'Acquire a land for development purposes' },
    { id: 'dev', t: 'Development', d: 'Develop residential or commercial units' },
    { id: 'rawland', t: 'Raw Lands Development', d: 'Develop raw lands' },
    { id: 'bridge', t: 'Bridge Financing', d: 'Short-term financing < 9 months' },
  ];

  constructor(private router: Router) {}

  // Step validation
  get step1Valid(): boolean { return !!this.selectedProject; }
  get step2Valid(): boolean { return !!(this.financingAmount && this.financingProduct); }
  get canSubmit(): boolean { return this.step1Valid && this.step2Valid && this.accuracy; }

  isStepValid(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0: return this.step1Valid;
      case 1: return this.step2Valid;
      case 2: return this.canSubmit;
      default: return false;
    }
  }

  nextStep(): void {
    if (this.step < 2 && this.isStepValid(this.step)) {
      this.step++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.step > 0) {
      this.step--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onStepClick(index: number): void {
    if (index <= this.step) {
      this.step = index;
    }
  }

  submit(): void {
    this.router.navigateByUrl('/application/1/status');
  }

  go(path: string): void {
    this.router.navigateByUrl(path);
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
    const m: Record<string, string> = { land: 'Land Acquisition', dev: 'Development', rawland: 'Raw Lands Development', bridge: 'Bridge Financing' };
    return m[this.financingProduct] || this.financingProduct;
  }
}
