import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  CardComponent,
  BadgeComponent,
  ProgressStepsComponent,
  InputComponent,
  MapPickerComponent,
  ReviewGridComponent,
  getCompanyLogo,
} from '../../shared';
import type { MapLocation } from '../../shared';

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
    ProgressStepsComponent,
    InputComponent,
    MapPickerComponent,
    ReviewGridComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard/projects" label="Back to Projects"></app-back-link>

        <h1 class="page-title">Create a new project</h1>
        <p class="page-subtitle">Fill in the details below to register your project and prepare it for financing.</p>

        <!-- Progress Steps -->
        <app-progress-steps
          [steps]="visibleStepLabels"
          [current]="displayStep"
          (stepClick)="onStepClick($event)"
        ></app-progress-steps>
        <div class="draft-indicator" *ngIf="draftSaved">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Draft saved
        </div>

        <!-- Pre-selected company banner -->
        <div *ngIf="companyPreSelected && step >= 1" class="preselected-banner">
          <div class="preselected-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
          </div>
          <div class="preselected-info">
            <div class="preselected-label">Company</div>
            <div class="preselected-name">{{ getCompanyName() }}</div>
          </div>
          <div class="preselected-cr">CR {{ sel }}</div>
        </div>

        <!-- ============ STEP 0: Select Company ============ -->
        <div *ngIf="!companyPreSelected && step === 0" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Select Company</div>
            <div class="section-desc">Choose the company entity that owns or will develop this project.</div>

            <div class="company-list">
              <div
                *ngFor="let co of companies"
                class="company-row"
                [class.selected]="sel === co.cr"
                [style.borderColor]="sel === co.cr ? C.green : C.g200"
                [style.background]="sel === co.cr ? C.greenLt : '#fff'"
                (click)="selectCompany(co.cr)"
              >
                <div class="company-left">
                  <img *ngIf="co.logo" [src]="co.logo" class="company-logo-img" />
                  <div *ngIf="!co.logo" class="company-icon" [style.background]="sel === co.cr ? C.green : C.g100" [style.color]="sel === co.cr ? '#fff' : C.g500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
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
            <div class="section-desc">Tell us about your project — this helps us understand your development and match it to the right financing.</div>

            <!-- Project Name -->
            <app-input
              label="Project Name"
              placeholder="e.g. Al Noor Residential Compound"
              helper="Give your project a name that identifies it within your portfolio"
              [value]="name"
              (valueChange)="name = $event; onFieldChange()"
            ></app-input>

            <!-- Description -->
            <div class="field-group">
              <label class="field-label">Description</label>
              <textarea
                class="textarea"
                rows="3"
                placeholder="e.g. A gated residential compound with 120 villas targeting middle-income families..."
                [ngModel]="description"
                (ngModelChange)="description = $event; onFieldChange()"
              ></textarea>
              <p class="field-helper">Describe what you are building or developing — this helps us understand your vision</p>
            </div>

            <!-- Project Type -->
            <div class="field-group">
              <label class="field-label">Project Type</label>
              <p class="field-helper" style="margin-bottom: 10px;">Select the category that best describes your development</p>
              <div class="type-grid">
                <div
                  *ngFor="let t of types"
                  class="type-card"
                  [class.selected]="type === t.id"
                  (click)="type = t.id; onFieldChange()"
                >
                  <span class="type-emoji">{{ t.emoji }}</span>
                  <span class="type-label">{{ t.t }}</span>
                </div>
              </div>
            </div>

            <!-- Current Stage -->
            <div class="field-group">
              <label class="field-label">Current Stage</label>
              <p class="field-helper" style="margin-bottom: 10px;">Where is the project in its lifecycle right now?</p>
              <div class="stepper">
                <ng-container *ngFor="let s of stages; let i = index; let last = last">
                  <div class="stage-node" (click)="stage = s.id; onFieldChange()">
                    <div
                      class="stage-dot"
                      [style.width.px]="stage === s.id ? 22 : 14"
                      [style.height.px]="stage === s.id ? 22 : 14"
                      [style.background]="getDotBg(s, i)"
                      [style.borderColor]="getDotBorder(s, i)"
                      [style.borderWidth]="stage === s.id ? '3px' : (stageIdx(s.id) > selectedStageIdx ? '2px' : '0')"
                      [style.boxShadow]="stage === s.id ? '0 2px 8px ' + s.c + '40' : 'none'"
                    ></div>
                    <div
                      class="stage-label"
                      [style.color]="stage === s.id ? s.c : (i <= selectedStageIdx ? C.g700 : C.g400)"
                      [style.fontWeight]="stage === s.id ? '700' : '600'"
                    >{{ s.l }}</div>
                  </div>
                  <div
                    *ngIf="!last"
                    class="stage-line"
                    [style.background]="i < selectedStageIdx ? stages[i].c : C.g200"
                  ></div>
                </ng-container>
              </div>
            </div>

            <!-- Development Period -->
            <app-input
              label="Development Period"
              placeholder="e.g. 24"
              suffix="months"
              helper="Estimated total duration from project start to completion"
              [value]="projectPeriod"
              (valueChange)="projectPeriod = $event; onFieldChange()"
            ></app-input>
          </app-card>
        </div>

        <!-- ============ STEP 2: Land ============ -->
        <div *ngIf="step === 2" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Land Information</div>
            <div class="section-desc">Provide the location and size of the land plot for this project.</div>

            <!-- Map -->
            <div class="field-group">
              <label class="field-label">Project Location</label>
              <p class="field-helper" style="margin-bottom: 10px;">Pin the exact location of your project on the map</p>
              <app-map-picker (locationChange)="onMapChange($event)"></app-map-picker>
            </div>

            <!-- City & District (auto-populated) -->
            <div class="two-col">
              <div class="field-group">
                <label class="field-label">
                  City
                  <span class="auto-tag">Auto-detected</span>
                </label>
                <div class="readonly-field">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ city || 'Move pin to detect' }}
                </div>
                <p class="field-helper">Automatically detected based on map pin location</p>
              </div>
              <div class="field-group">
                <label class="field-label">
                  District
                  <span class="auto-tag">Auto-detected</span>
                </label>
                <div class="readonly-field">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  {{ district || 'Move pin to detect' }}
                </div>
                <p class="field-helper">Automatically detected based on map pin location</p>
              </div>
            </div>

            <!-- Total Land Area -->
            <app-input
              label="Total Land Area"
              placeholder="e.g. 25,000"
              suffix="m²"
              helper="Total area of the land plot in square meters, as per the title deed"
              [value]="totalLandArea"
              (valueChange)="totalLandArea = $event; onFieldChange()"
            ></app-input>
          </app-card>
        </div>

        <!-- ============ STEP 3: Specs ============ -->
        <div *ngIf="step === 3" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Project Specifications</div>
            <div class="section-desc">Provide the key metrics for your development. These help us assess the project scope and financing needs.</div>

            <app-input
              label="Number of Units"
              placeholder="e.g. 120"
              helper="Total number of sellable units planned — apartments, villas, plots, or commercial units"
              [value]="expectedUnits"
              (valueChange)="expectedUnits = $event; onFieldChange()"
            ></app-input>

            <app-input
              label="Building Area"
              placeholder="e.g. 15,000"
              suffix="m²"
              helper="Gross floor area including common areas, corridors, parking, and service rooms"
              [value]="totalBuildingArea"
              (valueChange)="totalBuildingArea = $event; onFieldChange()"
            ></app-input>

            <app-input
              label="Selling Area"
              placeholder="e.g. 12,000"
              suffix="m²"
              helper="Net sellable area — the portion buyers will actually own, excluding common spaces"
              [value]="totalSellingArea"
              (valueChange)="totalSellingArea = $event; onFieldChange()"
            ></app-input>

            <!-- Efficiency ratio chip -->
            <div *ngIf="parsedBuildingArea > 0 && parsedSellingArea > 0" class="efficiency-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="efficiencyColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Selling efficiency: <strong [style.color]="efficiencyColor">{{ efficiencyPct }}%</strong></span>
            </div>
          </app-card>
        </div>

        <!-- ============ STEP 4: Project Financials ============ -->
        <div *ngIf="step === 4" class="animate-in">
          <app-card [padding]="32">
            <div class="section-title">Project Financials</div>
            <div class="section-desc">Provide the financial details — these are critical for assessing financing eligibility and structuring offers.</div>

            <app-input
              label="Estimated Total Project Cost"
              placeholder="e.g. 50,000,000"
              suffix="SAR"
              helper="Total estimated project cost including land acquisition, construction, infrastructure, and soft costs"
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
                <div class="drag-hint">Drag to adjust the land vs. development cost split</div>
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
                helper="Total expected revenue from all unit sales upon project completion"
                [value]="expectedRevenue"
                (valueChange)="expectedRevenue = $event; onFieldChange()"
              ></app-input>

              <div *ngIf="parsedRevenue > 0 && (parsedUnits > 0 || parsedSellingArea > 0)" class="stat-row" style="margin-top: 16px;">
                <div *ngIf="parsedUnits > 0" class="stat-box" [style.borderColor]="C.greenMd" [style.background]="C.greenLt">
                  <div class="stat-label" [style.color]="C.green">Avg. Revenue per Unit</div>
                  <div class="stat-value">{{ fmt(revenuePerUnit) }} <span class="stat-unit">SAR</span></div>
                  <div class="stat-sub" [style.color]="C.green">Based on {{ expectedUnits }} units</div>
                </div>
                <div *ngIf="parsedSellingArea > 0" class="stat-box" [style.borderColor]="C.greenMd" [style.background]="C.greenLt">
                  <div class="stat-label" [style.color]="C.green">Avg. Revenue per m&sup2;</div>
                  <div class="stat-value">{{ fmt(revenuePerSqm) }} <span class="stat-unit">SAR/m&sup2;</span></div>
                  <div class="stat-sub" [style.color]="C.green">Based on {{ totalSellingArea }} m&sup2;</div>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- ============ STEP 5: Review & Submit ============ -->
        <div *ngIf="step === 5" class="animate-in">
          <!-- Review header -->
          <div class="rv-hero">
            <div class="rv-hero-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <div class="rv-hero-title">Review Your Project</div>
              <div class="rv-hero-desc">Please review all details before submitting. You can edit any section below.</div>
            </div>
          </div>

          <!-- Company card -->
          <div class="rv-card">
            <div class="rv-card-header">
              <div class="rv-card-icon" [style.background]="C.blue50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
              </div>
              <span class="rv-card-title">Company</span>
              <button *ngIf="!companyPreSelected" class="rv-edit" (click)="step = 0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Edit
              </button>
            </div>
            <div class="rv-company-body">
              <div class="rv-company-logo" *ngIf="getCompanyLogoUrl()">
                <img [src]="getCompanyLogoUrl()" alt="" />
              </div>
              <div class="rv-company-logo rv-company-fallback" *ngIf="!getCompanyLogoUrl()" [style.background]="C.greenLt" [style.color]="C.green">
                {{ getCompanyName().charAt(0) }}
              </div>
              <div>
                <div class="rv-company-name">{{ getCompanyName() }}</div>
                <div class="rv-company-cr">CR: {{ sel }}</div>
              </div>
            </div>
          </div>

          <!-- Details card -->
          <div class="rv-card">
            <div class="rv-card-header">
              <div class="rv-card-icon" [style.background]="C.greenLt">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <span class="rv-card-title">Project Details</span>
              <button class="rv-edit" (click)="step = 1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Edit
              </button>
            </div>
            <app-review-grid [items]="reviewDetailsItems"></app-review-grid>
          </div>

          <!-- Land card -->
          <div class="rv-card">
            <div class="rv-card-header">
              <div class="rv-card-icon" [style.background]="C.amber50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <span class="rv-card-title">Land Information</span>
              <button class="rv-edit" (click)="step = 2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Edit
              </button>
            </div>
            <app-review-grid [items]="reviewLandItems"></app-review-grid>
          </div>

          <!-- Specs card -->
          <div class="rv-card">
            <div class="rv-card-header">
              <div class="rv-card-icon" style="background: #ede9fe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </div>
              <span class="rv-card-title">Project Specifications</span>
              <button class="rv-edit" (click)="step = 3">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Edit
              </button>
            </div>
            <app-review-grid [items]="reviewSpecsItems"></app-review-grid>
          </div>

          <!-- Financials card -->
          <div class="rv-card">
            <div class="rv-card-header">
              <div class="rv-card-icon" style="background: #fff2ee">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              </div>
              <span class="rv-card-title">Project Financials</span>
              <button class="rv-edit" (click)="step = 4">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Edit
              </button>
            </div>
            <app-review-grid [items]="reviewFinancialItems"></app-review-grid>
          </div>

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
          <div class="nav-left">
            <app-btn *ngIf="step > firstStep" variant="ghost" (clicked)="prevStep()">
              &#8592; Back
            </app-btn>
          </div>

          <div class="nav-right">
            <!-- Save & continue later -->
            <button *ngIf="step > 0 && step < 5" class="save-later-btn" (click)="saveAndExit()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save & continue later
            </button>

            <app-btn *ngIf="step > 0 && step < 5" variant="primary"
              [disabled]="!isStepValid(step)"
              (clicked)="nextStep()">
              Next: {{ nextStepLabel }} &rarr;
            </app-btn>
            <app-btn *ngIf="step === 5" variant="primary" size="lg"
              [disabled]="!canSubmit"
              (clicked)="submit()">
              Create Project &rarr;
            </app-btn>
          </div>
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
    .draft-indicator {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 5px;
      font-size: 12px;
      font-weight: 600;
      color: ${C.green};
      margin-top: -4px;
      margin-bottom: 8px;
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
      margin-bottom: 24px;
      line-height: 1.5;
    }

    /* Field groups */
    .field-group {
      margin-bottom: 20px;
    }

    .field-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .field-helper {
      font-size: 11px;
      color: ${C.g400};
      margin: 4px 0 0 0;
      line-height: 1.4;
    }

    .auto-tag {
      font-size: 10px;
      font-weight: 700;
      color: ${C.green};
      background: ${C.greenLt};
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* Textarea */
    .textarea {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      background: #fff;
      color: ${C.g900};
      box-sizing: border-box;
      font-family: inherit;
      resize: vertical;
      line-height: 1.5;
    }
    .textarea:focus { border-color: ${C.green}; }
    .textarea::placeholder { color: ${C.g400}; }

    /* Two column layout */
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    /* Readonly field */
    .readonly-field {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      background: ${C.g50};
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      font-size: 14px;
      color: ${C.g700};
      font-weight: 600;
    }

    /* Project Type Grid */
    .type-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .type-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 14px 8px;
      border: 1.5px solid ${C.g200};
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
      background: #fff;
    }
    .type-card:hover { border-color: ${C.g300}; background: ${C.g50}; }
    .type-card.selected {
      border-color: ${C.green};
      background: ${C.greenLt};
    }

    .type-emoji { font-size: 24px; line-height: 1; }
    .type-label { font-size: 12px; font-weight: 700; color: ${C.g800}; text-align: center; }

    /* Stage Stepper */
    .stepper {
      display: flex;
      align-items: flex-start;
      padding: 8px 0;
    }

    .stage-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      min-width: 0;
      flex: 0 0 auto;
    }

    .stage-dot {
      border-radius: 50%;
      border-style: solid;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .stage-label {
      font-size: 11px;
      margin-top: 8px;
      white-space: nowrap;
      transition: color 0.15s ease;
    }

    .stage-line {
      flex: 1;
      height: 3px;
      border-radius: 2px;
      margin-top: 10px;
      min-width: 20px;
      transition: background 0.2s ease;
    }

    /* Efficiency chip */
    .efficiency-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      background: ${C.g50};
      border: 1px solid ${C.g200};
      border-radius: 10px;
      font-size: 13px;
      color: ${C.g600};
      margin-top: 4px;
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

    .company-row:hover { border-color: ${C.g300}; }

    .company-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .company-logo-img {
      width: 42px; height: 42px; border-radius: 10px;
      object-fit: cover; flex-shrink: 0;
    }
    .company-icon {
      width: 42px; height: 42px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; flex-shrink: 0;
    }

    .company-info { display: flex; flex-direction: column; gap: 4px; }
    .company-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }
    .company-cr {
      font-size: 12px; color: ${C.g500};
      display: flex; align-items: center; gap: 8px;
    }

    .company-check {
      width: 28px; height: 28px; border-radius: 50%;
      background: ${C.green};
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    /* Wizard navigation */
    .wizard-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      gap: 12px;
    }

    .nav-left { display: flex; align-items: center; }
    .nav-right { display: flex; align-items: center; gap: 12px; margin-left: auto; }

    .save-later-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      background: none;
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      color: ${C.g500};
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .save-later-btn:hover {
      border-color: ${C.g300};
      color: ${C.g700};
      background: ${C.g50};
    }

    /* Review hero */
    .rv-hero {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 20px;
    }
    .rv-hero-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: ${C.greenLt}; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
    }
    .rv-hero-title {
      font-size: 18px; font-weight: 900; color: ${C.g900}; margin-bottom: 2px;
    }
    .rv-hero-desc {
      font-size: 13px; color: ${C.g500}; line-height: 1.4;
    }

    /* Review cards */
    .rv-card {
      background: #fff; border: 1px solid ${C.g200};
      border-radius: 14px; padding: 20px; margin-bottom: 12px;
    }
    .rv-card-header {
      display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
    }
    .rv-card-icon {
      width: 32px; height: 32px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .rv-card-title {
      font-size: 14px; font-weight: 800; color: ${C.g800}; flex: 1;
    }
    .rv-edit {
      display: inline-flex; align-items: center; gap: 5px;
      background: none; border: 1.5px solid ${C.g200};
      font-size: 12px; font-weight: 700; color: ${C.g500};
      cursor: pointer; font-family: inherit;
      padding: 5px 12px; border-radius: 8px;
      transition: all 0.15s;
    }
    .rv-edit:hover { border-color: ${C.green}; color: ${C.green}; background: ${C.greenLt}; }

    /* Company card body */
    .rv-company-body {
      display: flex; align-items: center; gap: 12px;
      margin-top: 14px; padding: 12px 14px;
      background: ${C.g50}; border-radius: 10px;
    }
    .rv-company-logo { width: 36px; height: 36px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
    .rv-company-logo img { width: 100%; height: 100%; object-fit: cover; }
    .rv-company-fallback {
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 800;
    }
    .rv-company-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }
    .rv-company-cr { font-size: 12px; color: ${C.g400}; margin-top: 1px; }

    /* Submit section */
    .submit-section { margin-top: 20px; }

    .checkbox-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .checkbox {
      width: 20px; height: 20px; border-radius: 6px;
      border: 1.5px solid ${C.g300};
      background: #fff;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.15s ease; margin-top: 1px;
    }
    .checkbox.checked { background: ${C.green}; border-color: ${C.green}; }

    .checkbox-label {
      font-size: 13px;
      color: ${C.g600};
      line-height: 1.5;
    }

    /* Pre-selected company banner */
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
    .preselected-cr { font-size: 12px; color: ${C.g500}; flex-shrink: 0; }

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

    .breakdown-slider { margin-bottom: 20px; }

    .slider-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .slider-tag { font-size: 12px; font-weight: 700; }

    .dual-track {
      position: relative;
      height: 14px;
      border-radius: 7px;
      background: ${C.g100};
      margin-bottom: 4px;
      cursor: pointer;
    }

    .track-fill-land {
      position: absolute; top: 0; left: 0; height: 100%;
      background: ${C.amber500}; border-radius: 7px 0 0 7px; pointer-events: none;
    }

    .track-fill-dev {
      position: absolute; top: 0; height: 100%;
      background: ${C.blue500}; border-radius: 0 7px 7px 0; pointer-events: none;
    }

    .track-thumb {
      position: absolute; top: 50%; transform: translate(-50%, -50%);
      width: 26px; height: 26px; border-radius: 50%;
      background: ${C.g700}; border: 3px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      display: flex; align-items: center; justify-content: center;
      pointer-events: none; z-index: 2;
    }

    .dual-track .range-input {
      position: absolute; top: -10px; left: 0;
      width: 100%; height: 34px; opacity: 0; cursor: pointer; z-index: 3;
    }

    .drag-hint {
      font-size: 11px; color: ${C.g400}; text-align: center; margin-top: 6px;
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
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 8px;
    }

    .stat-value {
      font-size: 20px; font-weight: 900; color: ${C.g900}; line-height: 1.2;
    }

    .stat-unit { font-size: 13px; font-weight: 600; color: ${C.g400}; }

    .stat-sub { font-size: 11px; font-weight: 600; margin-top: 6px; }

    @media (max-width: 600px) {
      .draft-indicator {
        position: static; transform: none; margin-top: 8px;
      }
      .stat-row { grid-template-columns: 1fr; }
      .type-grid { grid-template-columns: repeat(2, 1fr); }
      .two-col { grid-template-columns: 1fr; }
    }
  `],
})
export class AddProjectComponent implements OnInit, OnDestroy {
  C = C;

  // Wizard state — 6 steps: 0=Company, 1=Details, 2=Land, 3=Specs, 4=Financials, 5=Review
  step = 0;
  companyPreSelected = false;
  private readonly DRAFT_KEY = 'safqah_project_draft';
  draftSaved = false;
  private draftTimeout: any;

  // Step 0: Company
  sel = '';

  // Step 1: Details
  name = '';
  description = '';
  type = '';
  stage = '';
  projectPeriod = '';

  // Step 2: Land
  city = 'Dammam';
  district = 'Al Shatea';
  totalLandArea = '';

  // Step 3: Specs
  expectedUnits = '';
  totalBuildingArea = '';
  totalSellingArea = '';

  // Step 4: Financials
  totalCost = '';
  landCostPct = 40;
  expectedRevenue = '';

  // Step 5: Review
  accuracy = false;

  // Data
  companies = [
    { name: 'Al Omran Real Estate Dev Co.', cr: '1551515151516515', st: 'Approved', logo: getCompanyLogo('1551515151516515') },
    { name: 'Al Jazeera Development Co.', cr: '1020304050607', st: 'Under Review', logo: getCompanyLogo('1020304050607') },
  ];

  types = [
    { id: 'warehouse', t: 'Warehouse', emoji: '🏭' },
    { id: 'residential', t: 'Residential', emoji: '🏘️' },
    { id: 'offices', t: 'Offices', emoji: '🏢' },
    { id: 'commercial', t: 'Commercial', emoji: '🏬' },
    { id: 'hospitality', t: 'Hospitality', emoji: '🏨' },
    { id: 'rawland', t: 'Raw Land', emoji: '🌾' },
    { id: 'infrastructure', t: 'Infrastructure', emoji: '🏗️' },
  ];

  stages = [
    { id: 'plan', l: 'Planning', c: '#2e90fa' },
    { id: 'design', l: 'Design', c: '#8b5cf6' },
    { id: 'permit', l: 'Permits', c: '#f79009' },
    { id: 'build', l: 'Construction', c: '#00a15a' },
    { id: 'sale', l: 'Pre-Sale', c: '#ec4899' },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const fresh = this.route.snapshot.queryParamMap.get('fresh');
    const companyParam = this.route.snapshot.queryParamMap.get('company');

    if (fresh) {
      this.clearDraft();
    } else {
      this.loadDraft();
    }

    if (companyParam) {
      const match = this.companies.find(c => c.cr === companyParam);
      if (match) {
        this.sel = match.cr;
        this.companyPreSelected = true;
        if (this.step < 1) this.step = 1;
      }
    }
  }

  /** Step labels shown in the progress bar */
  get visibleStepLabels(): string[] {
    return this.companyPreSelected
      ? ['Details', 'Land', 'Specs', 'Financials', 'Review']
      : ['Company', 'Details', 'Land', 'Specs', 'Financials', 'Review'];
  }

  /** Maps internal step to display step for progress bar */
  get displayStep(): number {
    return this.companyPreSelected ? this.step - 1 : this.step;
  }

  /** First navigable step */
  get firstStep(): number {
    return this.companyPreSelected ? 1 : 0;
  }

  /** Label for next step button */
  get nextStepLabel(): string {
    const labels: Record<number, string> = {
      0: 'Details', 1: 'Land', 2: 'Specs', 3: 'Financials', 4: 'Review',
    };
    return labels[this.step] || '';
  }

  ngOnDestroy(): void {
    clearTimeout(this.draftTimeout);
  }

  // ── Stage stepper helpers ──
  get selectedStageIdx(): number {
    return this.stages.findIndex(s => s.id === this.stage);
  }

  stageIdx(id: string): number {
    return this.stages.findIndex(s => s.id === id);
  }

  getDotBg(s: { id: string; c: string }, i: number): string {
    if (this.stage === s.id) return '#fff';
    if (i <= this.selectedStageIdx) return s.c;
    return '#fff';
  }

  getDotBorder(s: { id: string; c: string }, i: number): string {
    if (this.stage === s.id) return s.c;
    if (i <= this.selectedStageIdx) return s.c;
    return C.g300;
  }

  // ── Validation ──
  get step0Valid(): boolean { return !!this.sel; }
  get step1Valid(): boolean { return !!(this.name && this.type); }
  get step2Valid(): boolean { return true; } // map auto-provides defaults
  get step3Valid(): boolean { return true; } // specs are optional
  get step4Valid(): boolean { return !!this.totalCost; }
  get canSubmit(): boolean { return this.step0Valid && this.step1Valid && this.step4Valid && this.accuracy; }

  isStepValid(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0: return this.step0Valid;
      case 1: return this.step1Valid;
      case 2: return this.step2Valid;
      case 3: return this.step3Valid;
      case 4: return this.step4Valid;
      case 5: return this.canSubmit;
      default: return false;
    }
  }

  // ── Navigation ──
  selectCompany(cr: string): void {
    this.sel = cr;
    this.onFieldChange();
    setTimeout(() => {
      this.step = 1;
      this.saveDraft();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  }

  nextStep(): void {
    if (this.step < 5 && this.isStepValid(this.step)) {
      this.step++;
      this.saveDraft();
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
    const internalStep = this.companyPreSelected ? index + 1 : index;
    if (internalStep <= this.step) {
      this.step = internalStep;
    }
  }

  // ── Map location callback ──
  onMapChange(loc: MapLocation): void {
    this.city = loc.city;
    this.district = loc.district;
    this.onFieldChange();
  }

  // ── Efficiency ──
  get parsedBuildingArea(): number { return this.parseNum(this.totalBuildingArea); }
  get parsedSellingArea(): number { return this.parseNum(this.totalSellingArea); }

  get efficiencyPct(): number {
    if (this.parsedBuildingArea <= 0) return 0;
    return Math.round((this.parsedSellingArea / this.parsedBuildingArea) * 100);
  }

  get efficiencyColor(): string {
    const pct = this.efficiencyPct;
    if (pct >= 75) return C.green;
    if (pct >= 50) return C.amber500;
    return C.red500;
  }

  // ── Save & Continue Later ──
  saveAndExit(): void {
    this.saveDraft();
    this.draftSaved = true;
    setTimeout(() => {
      this.router.navigateByUrl('/dashboard/projects');
    }, 600);
  }

  // ── Auto-save ──
  saveDraft(): void {
    clearTimeout(this.draftTimeout);
    const draft = {
      step: this.step, sel: this.sel,
      name: this.name, description: this.description,
      type: this.type, stage: this.stage, projectPeriod: this.projectPeriod,
      city: this.city, district: this.district, totalLandArea: this.totalLandArea,
      expectedUnits: this.expectedUnits, totalBuildingArea: this.totalBuildingArea,
      totalSellingArea: this.totalSellingArea,
      totalCost: this.totalCost, landCostPct: this.landCostPct,
      expectedRevenue: this.expectedRevenue,
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
      this.description = d.description || '';
      this.type = d.type || '';
      this.stage = d.stage || '';
      this.projectPeriod = d.projectPeriod || '';
      this.city = d.city || 'Dammam';
      this.district = d.district || 'Al Shatea';
      this.totalLandArea = d.totalLandArea || '';
      this.expectedUnits = d.expectedUnits || '';
      this.totalBuildingArea = d.totalBuildingArea || '';
      this.totalSellingArea = d.totalSellingArea || '';
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

  // ── Financial helpers ──
  private parseNum(s: string): number {
    return parseFloat(s.replace(/,/g, '')) || 0;
  }

  get parsedCost(): number { return this.parseNum(this.totalCost); }
  get parsedRevenue(): number { return this.parseNum(this.expectedRevenue); }
  get parsedUnits(): number { return this.parseNum(this.expectedUnits); }

  get landCostVal(): number { return Math.round(this.parsedCost * this.landCostPct / 100); }
  get devCostVal(): number { return Math.round(this.parsedCost * (100 - this.landCostPct) / 100); }

  get revenuePerUnit(): number {
    return this.parsedUnits > 0 ? Math.round(this.parsedRevenue / this.parsedUnits) : 0;
  }

  get revenuePerSqm(): number {
    return this.parsedSellingArea > 0 ? Math.round(this.parsedRevenue / this.parsedSellingArea) : 0;
  }

  fmt(n: number): string {
    return n.toLocaleString('en-US');
  }

  // ── Review computed items ──
  get reviewDetailsItems(): Array<{ label: string; value: string }> {
    const items: Array<{ label: string; value: string }> = [
      { label: 'Name', value: this.name },
    ];
    if (this.description) items.push({ label: 'Description', value: this.description.length > 80 ? this.description.substring(0, 80) + '...' : this.description });
    items.push({ label: 'Type', value: this.getTypeName() });
    if (this.stage) items.push({ label: 'Stage', value: this.getStageName() });
    if (this.projectPeriod) items.push({ label: 'Period', value: this.projectPeriod + ' months' });
    return items;
  }

  get reviewLandItems(): Array<{ label: string; value: string }> {
    const items: Array<{ label: string; value: string }> = [];
    if (this.city) items.push({ label: 'City', value: this.city });
    if (this.district) items.push({ label: 'District', value: this.district });
    if (this.totalLandArea) items.push({ label: 'Total Land Area', value: this.totalLandArea + ' m²' });
    if (items.length === 0) items.push({ label: 'Location', value: 'Not specified' });
    return items;
  }

  get reviewSpecsItems(): Array<{ label: string; value: string }> {
    const items: Array<{ label: string; value: string }> = [];
    if (this.expectedUnits) items.push({ label: 'Number of Units', value: this.expectedUnits });
    if (this.totalBuildingArea) items.push({ label: 'Building Area', value: this.totalBuildingArea + ' m²' });
    if (this.totalSellingArea) items.push({ label: 'Selling Area', value: this.totalSellingArea + ' m²' });
    if (this.parsedBuildingArea > 0 && this.parsedSellingArea > 0) {
      items.push({ label: 'Selling Efficiency', value: this.efficiencyPct + '%' });
    }
    if (items.length === 0) items.push({ label: 'Specifications', value: 'Not specified' });
    return items;
  }

  get reviewFinancialItems(): Array<{ label: string; value: string }> {
    const items: Array<{ label: string; value: string }> = [
      { label: 'Total Cost', value: this.fmt(this.parseNum(this.totalCost)) + ' SAR' },
      { label: 'Land / Dev Split', value: this.landCostPct + '% / ' + (100 - this.landCostPct) + '%' },
    ];
    if (this.expectedRevenue) items.push({ label: 'Expected Revenue', value: this.fmt(this.parseNum(this.expectedRevenue)) + ' SAR' });
    return items;
  }

  // Review helpers
  getCompanyName(): string {
    return this.companies.find(c => c.cr === this.sel)?.name || '';
  }

  getCompanyLogoUrl(): string {
    return this.companies.find(c => c.cr === this.sel)?.logo || '';
  }

  getTypeName(): string {
    return this.types.find(t => t.id === this.type)?.t || this.type;
  }

  getStageName(): string {
    return this.stages.find(s => s.id === this.stage)?.l || this.stage;
  }
}
