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
  ProjectFormComponent,
  FinancingFormComponent,
} from '../../shared';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    BackLinkComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    ProjectFormComponent,
    FinancingFormComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard" label="Back to Dashboard"></app-back-link>

        <h1 class="page-title">Create a new project</h1>
        <p class="page-subtitle">Fill in the details below to submit your project for financing review.</p>

        <!-- 1. Company Selector -->
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
              (click)="sel = co.cr"
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

        <!-- 2. Project Details -->
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
          ></app-project-form>
        </app-card>

        <!-- 3. Financing Need -->
        <app-card [padding]="32">
          <div class="section-title">Financing Need</div>
          <div class="section-desc" style="margin-bottom: 20px;">Estimate the total project cost and how much financing you need.</div>

          <app-financing-form
            [(totalCost)]="totalCost"
            [(financingPct)]="financingPct"
            [(landCostPct)]="landCostPct"
            [(product)]="financingProduct"
            [(expectedRevenue)]="expectedRevenue"
            [expectedUnits]="expectedUnits"
            [totalSellingArea]="totalSellingArea"
          ></app-financing-form>
        </app-card>

        <!-- 4. Submit -->
        <div class="submit-section">
          <label class="checkbox-row" (click)="accuracy = !accuracy">
            <div class="checkbox" [class.checked]="accuracy">
              <svg *ngIf="accuracy" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span class="checkbox-label">I confirm that all information provided is accurate to the best of my knowledge.</span>
          </label>

          <app-btn
            variant="primary"
            size="lg"
            [full]="true"
            [disabled]="!canSubmit"
            (clicked)="go('/application/1/status')"
          >
            Submit Project for Review &rarr;
          </app-btn>

          <div class="cancel-row">
            <a class="cancel-link" (click)="go('/dashboard')">Cancel</a>
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

    /* Submit section */
    .submit-section {
      margin-top: 24px;
    }

    .checkbox-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      cursor: pointer;
      margin-bottom: 20px;
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
  `],
})
export class AddProjectComponent {
  C = C;

  // State
  sel = '';
  name = '';
  type = '';
  stage = '';
  expectedUnits = '';
  totalBuildingArea = '';
  totalSellingArea = '';
  projectPeriod = '';
  totalCost = '';
  financingPct = 60;
  landCostPct = 40;
  financingProduct = '';
  expectedRevenue = '';
  accuracy = false;

  // Data
  companies = [
    { name: 'Al Omran Real Estate Dev Co.', cr: '1551515151516515', st: 'Approved' },
    { name: 'Al Jazeera Development Co.', cr: '1020304050607', st: 'Under Review' },
  ];

  get canSubmit(): boolean {
    return !!(this.sel && this.name && this.type && this.stage && this.totalCost && this.financingProduct && this.accuracy);
  }

  constructor(private router: Router) {}

  go(path: string) {
    this.router.navigateByUrl(path);
  }
}
