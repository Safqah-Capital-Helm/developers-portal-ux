import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { I18nService } from '../../shared/i18n/i18n.service';
import {
  LogoComponent,
  ButtonComponent,
  CardComponent,
  ProgressStepsComponent,
  FinancingFormComponent,
  TranslatePipe,
} from '../../shared';

@Component({
  selector: 'app-financing-onboard',
  standalone: true,
  imports: [CommonModule, LogoComponent, ButtonComponent, CardComponent, ProgressStepsComponent, FinancingFormComponent, TranslatePipe],
  template: `
    <div class="page">
      <div class="container">

        <!-- Header -->
        <div class="header">
          <app-logo [size]="36"></app-logo>
          <span class="step-label">{{ 'common.step_of' | t:{current: '3', total: '3'} }}</span>
        </div>

        <!-- Progress Steps -->
        <app-progress-steps
          [steps]="onboardSteps"
          [current]="2">
        </app-progress-steps>

        <!-- Title -->
        <h1 class="title">{{ 'financing.need_title' | t }}</h1>
        <p class="subtitle">{{ 'financing.need_subtitle' | t }}</p>

        <!-- Single Card: Financing Form -->
        <app-card [padding]="28">
          <app-financing-form
            [(totalCost)]="totalCost"
            [(financingPct)]="financingPct"
            [(landCostPct)]="landCostPct"
            [(product)]="product"
            [(expectedRevenue)]="expectedRevenue"
          ></app-financing-form>
        </app-card>

        <!-- Navigation -->
        <div class="nav-row">
          <app-btn variant="ghost" (clicked)="go('/onboarding/project')">&#8592; {{ 'common.back' | t }}</app-btn>
          <app-btn variant="primary" [disabled]="!totalCost || !product" (clicked)="go('/onboarding/complete')">{{ 'financing.save_continue' | t }}</app-btn>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page {
      min-height: 100vh;
      background: ${C.bg};
      padding: 0 16px 60px;
    }

    .container {
      max-width: 700px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0 24px;
    }

    .step-label {
      font-size: 13px;
      font-weight: 600;
      color: ${C.g500};
    }

    .title {
      font-size: 24px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 6px;
    }

    .subtitle {
      font-size: 14px;
      color: ${C.g500};
      margin: 0 0 24px;
      line-height: 1.5;
    }

    .nav-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
    }

    @media (max-width: 768px) {
      .page { padding: 24px 16px 48px; }
    }
    @media (max-width: 480px) {
      .page { padding: 20px 12px 36px; }
      .title { font-size: 20px; }
    }
  `]
})
export class FinancingOnboardComponent {
  C = C;

  totalCost = '';
  financingPct = 60;
  landCostPct = 40;
  product = '';
  expectedRevenue = '';

  constructor(private router: Router, private i18n: I18nService) {}

  get onboardSteps() {
    return [this.i18n.t('add_project.step_verify'), this.i18n.t('add_project.step_project'), this.i18n.t('add_project.step_financing')];
  }

  go(path: string) {
    this.router.navigateByUrl(path);
  }
}
