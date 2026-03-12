import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  ProgressStepsComponent,
  CompanyVerifyFormComponent,
  AvatarComponent,
} from '../../shared';

@Component({
  selector: 'app-company-verify',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    BackLinkComponent,
    ButtonComponent,
    ProgressStepsComponent,
    CompanyVerifyFormComponent,
    AvatarComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard" label="Back to Dashboard"></app-back-link>

        <!-- Demo toggles -->
        <div class="demo-bar">
          <button class="demo-toggle" [class.active]="demoRole === 'owner'" (click)="setDemoRole('owner')">I am an Owner</button>
          <button class="demo-toggle" [class.active]="demoRole === 'non-owner'" (click)="setDemoRole('non-owner')">I am not an Owner</button>
        </div>

        <!-- Non-owner blocker -->
        <div *ngIf="demoRole === 'non-owner'" class="non-owner-block">
          <div class="non-owner-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h2 class="non-owner-title">Owner verification required</h2>
          <p class="non-owner-desc">
            Only registered company owners can complete the verification process.
            Ask one of the following owners to verify.
          </p>

          <div class="owners-list">
            <div *ngFor="let owner of crOwners" class="owner-row">
              <div class="owner-left">
                <app-avatar [initials]="owner.name.charAt(0)" size="md" color="green"></app-avatar>
                <div>
                  <div class="owner-name">{{ owner.name }}</div>
                  <div class="owner-role">{{ owner.crRole }}</div>
                </div>
              </div>
              <div class="owner-right">
                <span *ngIf="owner.invited" class="invited-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Invited
                </span>
                <app-btn *ngIf="!owner.invited" variant="secondary" size="sm" (clicked)="inviteOwner(owner)">
                  Invite to verify
                </app-btn>
              </div>
            </div>
          </div>

          <p class="non-owner-help">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            They will receive an email with a link to complete the verification.
          </p>
        </div>

        <!-- Owner flow -->
        <ng-container *ngIf="demoRole === 'owner'">
          <app-progress-steps
            [steps]="stepLabels"
            [current]="currentStep"
            (stepClick)="onStepClick($event)"
          ></app-progress-steps>

          <app-company-verify-form
            (stepChanged)="currentStep = $event"
            (completed)="onComplete()"
          ></app-company-verify-form>
        </ng-container>
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

    /* Demo controls */
    .demo-bar {
      display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;
    }
    .demo-toggle {
      background: ${C.g50}; border: 1px dashed ${C.g300}; border-radius: 8px;
      padding: 8px 16px; font-size: 12px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit; transition: all 0.15s;
    }
    .demo-toggle:hover { background: ${C.g100}; color: ${C.g700}; }
    .demo-toggle.active { background: ${C.g200}; color: ${C.g700}; border-color: ${C.g400}; }

    /* Non-owner block */
    .non-owner-block {
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-radius: 16px;
      padding: 40px 32px;
      text-align: center;
    }

    .non-owner-icon {
      width: 64px; height: 64px; border-radius: 50%;
      background: ${C.amber50};
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }

    .non-owner-title {
      font-size: 20px; font-weight: 900; color: ${C.g900};
      margin: 0 0 8px 0;
    }

    .non-owner-desc {
      font-size: 14px; color: ${C.g500}; line-height: 1.6;
      margin: 0 0 24px 0;
      max-width: 440px; margin-left: auto; margin-right: auto;
    }

    /* Owner list */
    .owners-list {
      text-align: left;
      border: 1px solid ${C.g200};
      border-radius: 12px;
      overflow: hidden;
    }

    .owner-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1px solid ${C.g100};
    }
    .owner-row:last-child { border-bottom: none; }

    .owner-left { display: flex; align-items: center; gap: 12px; }
    .owner-name { font-size: 14px; font-weight: 700; color: ${C.g900}; }
    .owner-role { font-size: 12px; color: ${C.g400}; }
    .owner-right { display: flex; align-items: center; }

    .invited-tag {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 12px; font-weight: 700; color: ${C.green};
      background: ${C.greenLt};
      padding: 4px 12px; border-radius: 8px;
    }

    .non-owner-help {
      display: flex; align-items: center; justify-content: center;
      gap: 8px; margin-top: 20px;
      font-size: 12px; color: ${C.g400};
    }
  `]
})
export class CompanyVerifyComponent implements OnInit {
  C = C;
  @ViewChild(CompanyVerifyFormComponent) form!: CompanyVerifyFormComponent;

  from = 'onboarding';
  currentStep = 0;
  demoRole: 'owner' | 'non-owner' = 'owner';

  stepLabels = [
    'Company Details',
    'Declaration',
  ];

  crOwners = [
    { name: 'Mohammad Al-Omran', crRole: 'Partner', invited: false },
    { name: 'Khalid Al-Salem', crRole: 'Partner', invited: true },
    { name: 'Faisal Al-Rajhi', crRole: 'Authorized Signatory', invited: false },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.from = this.route.snapshot.queryParamMap.get('from') || 'onboarding';
  }

  setDemoRole(role: 'owner' | 'non-owner') {
    this.demoRole = role;
  }

  inviteOwner(owner: any) {
    owner.invited = true;
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
      this.router.navigate(['/dashboard'], { queryParams: { state: 'new' } });
    }
  }
}
