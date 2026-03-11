import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  CardComponent,
  BadgeComponent,
  ProjectFormComponent,
  ProgressStepsComponent,
  InputComponent,
  ReviewGridComponent,
} from '../../shared';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavComponent,
    BackLinkComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    ProjectFormComponent,
    ProgressStepsComponent,
    InputComponent,
    ReviewGridComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard" label="Back to Dashboard"></app-back-link>

        <h1 class="page-title">Create a new project</h1>
        <p class="page-subtitle">Fill in the details below to submit your project for financing review.</p>

        <!-- Progress Steps -->
        <div class="progress-bar">
          <app-progress-steps
            [steps]="stepLabels"
            [current]="step"
            (stepClick)="onStepClick($event)"
          ></app-progress-steps>
          <div class="draft-indicator" *ngIf="draftSaved">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Draft saved
          </div>
        </div>

        <!-- ============ STEP 0: Select Company ============ -->
        <div *ngIf="step === 0" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Select Company</div>
            <div class="section-desc">Choose the company entity for this project.</div>

            <div class="company-list">
              <div
                *ngFor="let co of companies"
                class="company-row"
                [class.selected]="sel === co.cr"
                [style.borderColor]="sel === co.cr ? C.green : C.g200"
                [style.background]="sel === co.cr ? C.greenLt : '#fff'"
                (click)="sel = co.cr; onFieldChange()"
              >
                <div class="company-left">
                  <div class="company-icon" [style.background]="sel === co.cr ? C.green : C.g100" [style.color]="sel === co.cr ? '#fff' : C.g500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                      <line x1="9" y1="6" x2="9" y2="6.01"/>
                      <line x1="15" y1="6" x2="15" y2="6.01"/>
                      <line x1="9" y1="10" x2="9" y2="10.01"/>
                      <line x1="15" y1="10" x2="15" y2="10.01"/>
                      <line x1="9" y1="14" x2="9" y2="14.01"/>
                      <line x1="15" y1="14" x2="15" y2="14.01"/>
                      <path d="M9 18h6"/>
                    </svg>
                  </div>
                  <div class="company-info">
                    <div class="company-name">{{ co.name }}</div>
                    <div class="company-cr">
                      CR: {{ co.cr }}
                      <app-badge [color]="co.st === 'Approved' ? 'green' : 'amber'">{{ co.st }}</app-badge>
                    </div>
                  </div>
                </div>
                <div class="company-check" *ngIf="sel === co.cr">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- ============ STEP 1: Project Details ============ -->
        <div *ngIf="step === 1" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Project Details</div>
            <div class="section-desc" style="margin-bottom: 20px;">Describe your project to help us find the right financing.</div>

            <app-project-form
              [(name)]="name"
              [(type)]="type"
              [(stage)]="stage"
              [(expectedUnits)]="expectedUnits"
              [(totalBuildingArea)]="totalBuildingArea"
              [(totalSellingArea)]="totalSellingArea"
              [(projectPeriod)]="projectPeriod"
              (nameChange)="onFieldChange()"
              (typeChange)="onFieldChange()"
              (stageChange)="onFieldChange()"
              (expectedUnitsChange)="onFieldChange()"
              (totalBuildingAreaChange)="onFieldChange()"
              (totalSellingAreaChange)="onFieldChange()"
              (projectPeriodChange)="onFieldChange()"
            ></app-project-form>
          </app-card>
        </div>

        <!-- ============ STEP 2: Project Financials ============ -->
        <div *ngIf="step === 2" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Project Financials</div>
            <div class="section-desc" style="margin-bottom: 20px;">Provide the financial details for your project.</div>

            <app-input
              label="Estimated Total Project Cost"
              placeholder="e.g. 50,000,000"
              suffix="SAR"
              helper="Total estimated project cost including land, construction, and other expenses"
              [value]="totalCost"
              (valueChange)="totalCost = $event; onFieldChange()"
            ></app-input>

            <div *ngIf="parsedCost > 0" class="fin-section">
              <div class="fin-label">Cost Breakdown</div>
              <div class="breakdown-slider">
                <div class="slider-header">
                  <span class="slider-tag" [style.color]="C.amber600">Land {{ landCostPct }}%</span>
                  <span class="slider-tag" [style.color]="C.blue500">Development {{ 100 - landCostPct }}%</span>
                </div>
                <div class="dual-track">
                  <div class="track-fill-land" [style.width.%]="landCostPct"></div>
                  <div class="track-fill-dev" [style.width.%]="100 - landCostPct" [style.left.%]="landCostPct"></div>
                  <div class="track-thumb" [style.left.%]="landCostPct">
                    <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                      <line x1="3" y1="3" x2="3" y2="11" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
                      <line x1="7" y1="3" x2="7" y2="11" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <input
                    type="range"
                    min="0" max="100" step="1"
                    class="range-input"
                    [ngModel]="landCostPct"
                    (ngModelChange)="landCostPct = $event; onFieldChange()"
                  />
                </div>
                <div class="drag-hint">Drag to adjust split</div>
              </div>
              <div class="stat-row">
                <div class="stat-box" [style.borderColor]="C.amber100" [style.background]="C.amber50">
                  <div class="stat-label" [style.color]="C.amber600">Land Cost</div>
                  <div class="stat-value">{{ fmt(landCostVal) }} <span class="stat-unit">SAR</span></div>
                  <div class="stat-sub" [style.color]="C.amber500">{{ landCostPct }}% of total</div>
                </div>
                <div class="stat-box" [style.borderColor]="C.blue100" [style.background]="C.blue50">
                  <div class="stat-label" [style.color]="C.blue500">Development Cost</div>
                  <div class="stat-value">{{ fmt(devCostVal) }} <span class="stat-unit">SAR</span></div>
                  <div class="stat-sub" [style.color]="C.blue500">{{ 100 - landCostPct }}% of total</div>
                </div>
              </div>
            </div>

            <div class="fin-section">
              <app-input
                label="Expected Revenue"
                placeholder="e.g. 75,000,000"
                suffix="SAR"
                helper="Total expected revenue from sales"
                [value]="expectedRevenue"
                (valueChange)="expectedRevenue = $event; onFieldChange()"
              ></app-input>

              <div *ngIf="parsedRevenue > 0 && (parsedUnits > 0 || parsedArea > 0)" class="stat-row" style="margin-top: 16px;">
                <div *ngIf="parsedUnits > 0" class="stat-box" [style.borderColor]="C.greenMd" [style.background]="C.greenLt">
                  <div class="stat-label" [style.color]="C.green">Avg. Revenue per Unit</div>
                  <div class="stat-value">{{ fmt(revenuePerUnit) }} <span class="stat-unit">SAR</span></div>
                  <div class="stat-sub" [style.color]="C.green">Based on {{ expectedUnits }} units</div>
                </div>
                <div *ngIf="parsedArea > 0" class="stat-box" [style.borderColor]="C.greenMd" [style.background]="C.greenLt">
                  <div class="stat-label" [style.color]="C.green">Avg. Revenue per m&sup2;</div>
                  <div class="stat-value">{{ fmt(revenuePerSqm) }} <span class="stat-unit">SAR/m&sup2;</span></div>
                  <div class="stat-sub" [style.color]="C.green">Based on {{ totalSellingArea }} m&sup2;</div>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- ============ STEP 3: Review & Submit ============ -->
        <div *ngIf="step === 3" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Review Your Application</div>
            <div class="section-desc">Please review all details before submitting.</div>

            <!-- Company -->
            <div class="review-section">
              <div class="review-header">
                <span class="review-label">Company</span>
                <button class="edit-link" (click)="step = 0">Edit</button>
              </div>
              <div class="review-value">{{ getCompanyName() }}</div>
              <div class="review-sub">CR: {{ sel }}</div>
            </div>

            <!-- Project Details -->
            <div class="review-section">
              <div class="review-header">
                <span class="review-label">Project Details</span>
                <button class="edit-link" (click)="step = 1">Edit</button>
              </div>
              <app-review-grid [items]="reviewProjectItems"></app-review-grid>
            </div>

            <!-- Project Financials -->
            <div class="review-section last">
              <div class="review-header">
                <span class="review-label">Project Financials</span>
                <button class="edit-link" (click)="step = 2">Edit</button>
              </div>
              <app-review-grid [items]="reviewFinancialItems"></app-review-grid>
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

          <app-btn *ngIf="step < 3" variant="primary"
            [disabled]="!isStepValid(step)"
            (clicked)="nextStep()">
            Next: {{ stepLabels[step + 1] }} &rarr;
          </app-btn>
          <app-btn *ngIf="step === 3" variant="primary" size="lg"
            [disabled]="!canSubmit"
            (clicked)="submit()">
            Create Project &rarr;
          </app-btn>
        </div>

        <div class="cancel-row">
          <a class="cancel-link" (click)="go('/dashboard')">Cancel</a>
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

    /* Progress bar */
    .progress-bar {
      position: relative;
      margin-bottom: 8px;
    }

    .draft-indicator {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      font-weight: 600;
      color: ${C.green};
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-50%) translateX(4px); }
      to { opacity: 1; transform: translateY(-50%) translateX(0); }
    }

    /* Step animation */
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

    /* Company Selector */
    .company-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .company-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border: 1.5px solid ${C.g200};
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .company-row:hover {
      border-color: ${C.g300};
    }

    .company-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .company-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }

    .company-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .company-name {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g900};
    }

    .company-cr {
      font-size: 12px;
      color: ${C.g500};
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .company-check {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${C.green};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
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

    /* Project Financials */
    .fin-section {
      padding-top: 24px;
      margin-top: 24px;
      border-top: 1px solid ${C.g100};
    }

    .fin-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      margin-bottom: 12px;
    }

    .breakdown-slider {
      margin-bottom: 20px;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .slider-tag {
      font-size: 12px;
      font-weight: 700;
    }

    .dual-track {
      position: relative;
      height: 14px;
      border-radius: 7px;
      background: ${C.g100};
      margin-bottom: 4px;
      cursor: pointer;
    }

    .track-fill-land {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: ${C.amber500};
      border-radius: 7px 0 0 7px;
      pointer-events: none;
    }

    .track-fill-dev {
      position: absolute;
      top: 0;
      height: 100%;
      background: ${C.blue500};
      border-radius: 0 7px 7px 0;
      pointer-events: none;
    }

    .track-thumb {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: ${C.g700};
      border: 3px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 2;
      transition: box-shadow 0.15s;
    }

    .dual-track:hover .track-thumb {
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
    }

    .dual-track .range-input {
      position: absolute;
      top: -10px;
      left: 0;
      width: 100%;
      height: 34px;
      opacity: 0;
      cursor: pointer;
      z-index: 3;
    }

    .drag-hint {
      font-size: 11px;
      color: ${C.g400};
      text-align: center;
      margin-top: 6px;
    }

    .stat-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    .stat-box {
      border: 1.5px solid ${C.g200};
      border-radius: 14px;
      padding: 18px 20px;
    }

    .stat-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 900;
      color: ${C.g900};
      line-height: 1.2;
    }

    .stat-unit {
      font-size: 13px;
      font-weight: 600;
      color: ${C.g400};
    }

    .stat-sub {
      font-size: 11px;
      font-weight: 600;
      margin-top: 6px;
    }

    @media (max-width: 600px) {
      .draft-indicator {
        position: static;
        transform: none;
        margin-top: 8px;
      }
      .stat-row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AddProjectComponent implements OnInit, OnDestroy {
  C = C;

  // Wizard state
  step = 0;
  stepLabels = ['Company', 'Project Details', 'Project Financials', 'Review & Submit'];
  private readonly DRAFT_KEY = 'safqah_project_draft';
  draftSaved = false;
  private draftTimeout: any;

  // Form state
  sel = '';
  name = '';
  type = '';
  stage = '';
  expectedUnits = '';
  totalBuildingArea = '';
  totalSellingArea = '';
  projectPeriod = '';
  totalCost = '';
  landCostPct = 40;
  expectedRevenue = '';
  accuracy = false;

  // Data
  companies = [
    { name: 'Al Omran Real Estate Dev Co.', cr: '1551515151516515', st: 'Approved' },
    { name: 'Al Jazeera Development Co.', cr: '1020304050607', st: 'Under Review' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDraft();
  }

  ngOnDestroy(): void {
    clearTimeout(this.draftTimeout);
  }

  // Step validation
  get step1Valid(): boolean { return !!this.sel; }
  get step2Valid(): boolean { return !!(this.name && this.type && this.stage); }
  get step3Valid(): boolean { return !!this.totalCost; }
  get canSubmit(): boolean { return this.step1Valid && this.step2Valid && this.step3Valid && this.accuracy; }

  isStepValid(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0: return this.step1Valid;
      case 1: return this.step2Valid;
      case 2: return this.step3Valid;
      case 3: return this.canSubmit;
      default: return false;
    }
  }

  // Navigation
  nextStep(): void {
    if (this.step < 3 && this.isStepValid(this.step)) {
      this.step++;
      this.saveDraft();
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

  // Auto-save
  saveDraft(): void {
    clearTimeout(this.draftTimeout);
    const draft = {
      step: this.step, sel: this.sel, name: this.name, type: this.type,
      stage: this.stage, expectedUnits: this.expectedUnits,
      totalBuildingArea: this.totalBuildingArea, totalSellingArea: this.totalSellingArea,
      projectPeriod: this.projectPeriod, totalCost: this.totalCost,
      landCostPct: this.landCostPct, expectedRevenue: this.expectedRevenue,
    };
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));
    this.draftSaved = true;
    this.draftTimeout = setTimeout(() => this.draftSaved = false, 2000);
  }

  loadDraft(): void {
    const raw = localStorage.getItem(this.DRAFT_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      this.step = d.step || 0;
      this.sel = d.sel || '';
      this.name = d.name || '';
      this.type = d.type || '';
      this.stage = d.stage || '';
      this.expectedUnits = d.expectedUnits || '';
      this.totalBuildingArea = d.totalBuildingArea || '';
      this.totalSellingArea = d.totalSellingArea || '';
      this.projectPeriod = d.projectPeriod || '';
      this.totalCost = d.totalCost || '';
      this.landCostPct = d.landCostPct ?? 40;
      this.expectedRevenue = d.expectedRevenue || '';
    } catch {
      // Corrupt draft — ignore
    }
  }

  clearDraft(): void {
    localStorage.removeItem(this.DRAFT_KEY);
  }

  onFieldChange(): void {
    this.saveDraft();
  }

  submit(): void {
    this.clearDraft();
    this.router.navigateByUrl('/dashboard/projects');
  }

  go(path: string): void {
    this.router.navigateByUrl(path);
  }

  // Financial helpers
  private parseNum(s: string): number {
    return parseFloat(s.replace(/,/g, '')) || 0;
  }

  get parsedCost(): number { return this.parseNum(this.totalCost); }
  get parsedRevenue(): number { return this.parseNum(this.expectedRevenue); }
  get parsedUnits(): number { return this.parseNum(this.expectedUnits); }
  get parsedArea(): number { return this.parseNum(this.totalSellingArea); }

  get landCostVal(): number { return Math.round(this.parsedCost * this.landCostPct / 100); }
  get devCostVal(): number { return Math.round(this.parsedCost * (100 - this.landCostPct) / 100); }

  get revenuePerUnit(): number {
    return this.parsedUnits > 0 ? Math.round(this.parsedRevenue / this.parsedUnits) : 0;
  }

  get revenuePerSqm(): number {
    return this.parsedArea > 0 ? Math.round(this.parsedRevenue / this.parsedArea) : 0;
  }

  fmt(n: number): string {
    return n.toLocaleString('en-US');
  }

  // Review computed items
  get reviewProjectItems(): Array<{ label: string; value: string }> {
    const items = [
      { label: 'Name', value: this.name },
      { label: 'Type', value: this.getTypeName() },
      { label: 'Stage', value: this.getStageName() },
    ];
    if (this.expectedUnits) items.push({ label: 'Expected Units', value: this.expectedUnits });
    if (this.totalBuildingArea) items.push({ label: 'Building Area', value: this.totalBuildingArea + ' m²' });
    if (this.totalSellingArea) items.push({ label: 'Selling Area', value: this.totalSellingArea + ' m²' });
    if (this.projectPeriod) items.push({ label: 'Period', value: this.projectPeriod + ' months' });
    return items;
  }

  get reviewFinancialItems(): Array<{ label: string; value: string }> {
    const items = [
      { label: 'Total Cost', value: (+this.totalCost).toLocaleString() + ' SAR' },
      { label: 'Land / Dev Split', value: this.landCostPct + '% / ' + (100 - this.landCostPct) + '%' },
    ];
    if (this.expectedRevenue) items.push({ label: 'Expected Revenue', value: (+this.expectedRevenue).toLocaleString() + ' SAR' });
    return items;
  }

  // Review helpers
  getCompanyName(): string {
    return this.companies.find(c => c.cr === this.sel)?.name || '';
  }

  getTypeName(): string {
    const m: Record<string, string> = { res: 'Residential', com: 'Commercial', mix: 'Mixed Use', ind: 'Industrial', land: 'Land Development' };
    return m[this.type] || this.type;
  }

  getStageName(): string {
    const m: Record<string, string> = { plan: 'Planning', design: 'Design', permit: 'Permits', build: 'Construction', sale: 'Pre-Sale' };
    return m[this.stage] || this.stage;
  }

}
