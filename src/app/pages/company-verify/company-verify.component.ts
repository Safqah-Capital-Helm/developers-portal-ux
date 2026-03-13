import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { I18nService } from '../../shared/i18n/i18n.service';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  ProgressStepsComponent,
  CompanyVerifyFormComponent,
  AvatarComponent,
  TranslatePipe,
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
    TranslatePipe,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard" [label]="('company_verify.back_to_dashboard' | t)"></app-back-link>

        <!-- Demo toggles -->
        <div class="demo-bar">
          <button class="demo-toggle" [class.active]="demoRole === 'owner'" (click)="setDemoRole('owner')">{{ 'company_verify.demo_owner' | t }}</button>
          <button class="demo-toggle" [class.active]="demoRole === 'non-owner'" (click)="setDemoRole('non-owner')">{{ 'company_verify.demo_non_owner' | t }}</button>
        </div>

        <!-- Non-owner blocker -->
        <div *ngIf="demoRole === 'non-owner'" class="non-owner-block">
          <div class="non-owner-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h2 class="non-owner-title">{{ 'company_verify.non_owner_title' | t }}</h2>
          <p class="non-owner-desc">
            {{ 'company_verify.non_owner_desc' | t }}
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
                  {{ 'company_verify.invited' | t }}
                </span>
                <app-btn *ngIf="!owner.invited" variant="secondary" size="sm" (clicked)="inviteOwner(owner)">
                  {{ 'company_verify.invite_to_verify' | t }}
                </app-btn>
              </div>
            </div>
          </div>

          <p class="non-owner-help">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            {{ 'company_verify.non_owner_help' | t }}
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

  get stepLabels() {
    return [
      this.i18n.t('company_verify.step_details'),
      this.i18n.t('company_verify.step_declaration'),
    ];
  }

  private _crOwnersData = [
    { name: 'Mohammad Al-Omran', roleKey: 'common.role_partner', invited: false },
    { name: 'Khalid Al-Salem', roleKey: 'common.role_partner', invited: true },
    { name: 'Faisal Al-Rajhi', roleKey: 'common.role_authorized_signatory', invited: false },
  ];

  get crOwners() {
    return this._crOwnersData.map(o => ({
      ...o,
      crRole: this.i18n.t(o.roleKey),
    }));
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private i18n: I18nService,
  ) {}

  ngOnInit(): void {
    this.from = this.route.snapshot.queryParamMap.get('from') || 'onboarding';
  }

  setDemoRole(role: 'owner' | 'non-owner') {
    this.demoRole = role;
  }

  inviteOwner(owner: any) {
    const src = this._crOwnersData.find(o => o.name === owner.name);
    if (src) src.invited = true;
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
