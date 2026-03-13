import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { I18nService } from '../../shared/i18n/i18n.service';
import {
  LogoComponent,
  ButtonComponent,
  ProgressStepsComponent,
  CardComponent,
  ProjectFormComponent,
  TranslatePipe,
} from '../../shared';

@Component({
  selector: 'app-project-onboard',
  standalone: true,
  imports: [
    CommonModule,
    LogoComponent,
    ButtonComponent,
    ProgressStepsComponent,
    CardComponent,
    ProjectFormComponent,
    TranslatePipe,
  ],
  template: `
    <!-- Header bar -->
    <div class="header-bar">
      <app-logo [size]="32"></app-logo>
      <span class="step-indicator">{{ 'common.step_of' | t:{current: '2', total: '3'} }}</span>
    </div>

    <div class="page">
      <div class="container">
        <!-- Progress Steps -->
        <app-progress-steps
          [steps]="onboardSteps"
          [current]="1"
        ></app-progress-steps>

        <!-- Welcome text -->
        <div class="welcome-section">
          <p class="welcome-name">{{ 'add_project.welcome_name' | t:{name: 'Ahmed Al-Salem'} }}</p>
          <h1 class="welcome-title">{{ 'add_project.welcome_title' | t }}</h1>
          <p class="welcome-subtitle">
            {{ 'add_project.welcome_subtitle' | t }}
          </p>
        </div>

        <!-- Main card -->
        <app-card [padding]="32">
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

        <!-- Next button -->
        <div class="btn-row">
          <app-btn variant="primary" size="lg" (clicked)="go('/onboarding/financing')">
            {{ 'add_project.next_financing' | t }} &rarr;
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

    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 32px;
      background: ${C.white};
      border-bottom: 1px solid ${C.g200};
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .step-indicator {
      font-size: 13px;
      font-weight: 600;
      color: ${C.g500};
    }

    .page {
      max-width: 700px;
      margin: 0 auto;
      padding: 32px 24px 60px;
    }

    .container {
      width: 100%;
    }

    .welcome-section {
      margin-bottom: 28px;
    }

    .welcome-name {
      font-size: 13px;
      font-weight: 700;
      color: ${C.green};
      margin: 0 0 4px 0;
    }

    .welcome-title {
      font-size: 24px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 6px 0;
    }

    .welcome-subtitle {
      font-size: 14px;
      color: ${C.g500};
      margin: 0;
      line-height: 1.5;
    }

    .btn-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 28px;
    }
  `],
})
export class ProjectOnboardComponent {
  C = C;

  get onboardSteps() {
    return [
      this.i18n.t('add_project.step_verify'),
      this.i18n.t('add_project.step_project'),
      this.i18n.t('add_project.step_financing'),
    ];
  }

  name = '';
  type = '';
  stage = '';
  expectedUnits = '';
  totalBuildingArea = '';
  totalSellingArea = '';
  projectPeriod = '';

  constructor(private router: Router, private i18n: I18nService) {}

  go(path: string) {
    this.router.navigateByUrl(path);
  }
}
