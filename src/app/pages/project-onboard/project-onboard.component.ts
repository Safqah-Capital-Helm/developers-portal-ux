import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import {
  LogoComponent,
  ButtonComponent,
  ProgressStepsComponent,
  CardComponent,
  ProjectFormComponent,
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
  ],
  template: `
    <!-- Header bar -->
    <div class="header-bar">
      <app-logo [size]="32"></app-logo>
      <span class="step-indicator">Step 2 of 3</span>
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
          <p class="welcome-name">Welcome, Ahmed Al-Salem</p>
          <h1 class="welcome-title">Tell us about your project</h1>
          <p class="welcome-subtitle">
            Provide key details so we can match you with the right financing options.
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
            Next: Financing Need &rarr;
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

  onboardSteps = ['Verify identity', 'Project details', 'Financing need'];

  name = '';
  type = '';
  stage = '';
  expectedUnits = '';
  totalBuildingArea = '';
  totalSellingArea = '';
  projectPeriod = '';

  constructor(private router: Router) {}

  go(path: string) {
    this.router.navigateByUrl(path);
  }
}
