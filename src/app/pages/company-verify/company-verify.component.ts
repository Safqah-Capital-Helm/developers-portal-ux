import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import {
  NavComponent,
  BackLinkComponent,
  ProgressStepsComponent,
  CompanyVerifyFormComponent,
} from '../../shared';

@Component({
  selector: 'app-company-verify',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    BackLinkComponent,
    ProgressStepsComponent,
    CompanyVerifyFormComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard" label="Back to Dashboard"></app-back-link>

        <app-progress-steps
          [steps]="stepLabels"
          [current]="currentStep"
          (stepClick)="onStepClick($event)"
        ></app-progress-steps>

        <app-company-verify-form
          (stepChanged)="currentStep = $event"
          (completed)="onComplete()"
        ></app-company-verify-form>
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
      max-width: 620px;
      margin: 0 auto;
      padding: 32px 32px 60px;
    }
  `]
})
export class CompanyVerifyComponent implements OnInit {
  @ViewChild(CompanyVerifyFormComponent) form!: CompanyVerifyFormComponent;

  from = 'onboarding';
  currentStep = 0;

  stepLabels = [
    'Company Details',
    'Previous Projects',
    'Upload Documents',
    'Declaration',
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.from = this.route.snapshot.queryParamMap.get('from') || 'onboarding';
  }

  onStepClick(i: number): void {
    if (this.form) {
      this.form.jumpTo(i);
    }
  }

  onComplete(): void {
    if (this.from === 'onboarding') {
      this.router.navigate(['/onboarding/team']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
