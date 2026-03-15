import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import {
  LogoComponent,
  ButtonComponent,
  ProgressStepsComponent,
  CardComponent,
  InputComponent,
  TranslatePipe,
  I18nService,
} from '../../shared';

@Component({
  selector: 'app-team-invite',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent, ButtonComponent, ProgressStepsComponent, CardComponent, InputComponent, TranslatePipe],
  template: `
    <!-- Header bar -->
    <div class="header-bar">
      <app-logo [size]="32"></app-logo>
      <span class="step-indicator">{{ 'common.step_of' | t:{current: '2', total: '2'} }}</span>
    </div>

    <div class="page">
      <div class="container">

        <!-- Progress Steps -->
        <app-progress-steps
          [steps]="[i18n.t('team_invite.step_verify'), i18n.t('team_invite.step_invite')]"
          [current]="1">
        </app-progress-steps>

        <!-- Icon header -->
        <div class="icon-header">
          <div class="icon-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
        </div>

        <!-- Welcome text -->
        <div class="welcome-section">
          <p class="welcome-name">{{ 'team_invite.welcome' | t:{name: 'Ahmed Al-Salem'} }}</p>
          <h1 class="welcome-title">{{ 'team_invite.title' | t }}</h1>
          <p class="welcome-subtitle">
            {{ 'team_invite.subtitle' | t }}
          </p>
        </div>

        <!-- Demo toggle -->
        <div class="demo-bar">
          <button class="demo-toggle" [class.active]="!noCrMode" (click)="setMode(false)">{{ 'team_invite.with_cr_owners' | t }}</button>
          <button class="demo-toggle" [class.active]="noCrMode" (click)="setMode(true)">{{ 'team_invite.no_cr_owners' | t }}</button>
        </div>

        <!-- CR Owners Section -->
        <ng-container *ngIf="crOwners.length > 0">
          <div class="list-section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
            </svg>
            <span>{{ 'team_invite.owners_from_cr' | t }} <strong>7012345678</strong></span>
            <span class="cr-badge">{{ 'team_invite.auto_detected' | t }}</span>
          </div>

          <app-card [padding]="28">
            <div class="invite-list">
              <div *ngFor="let owner of crOwners; let i = index" class="invite-row">
                <div class="invite-num">{{ i + 1 }}</div>
                <div class="invite-fields">
                  <div class="invite-field full-width">
                    <div class="field-locked">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      {{ owner.name }}
                      <span class="owner-role-tag">{{ translateCrRole(owner.crRole) }}</span>
                    </div>
                  </div>
                  <div class="invite-field">
                    <app-input [label]="('team_invite.email_label' | t)" [placeholder]="'e.g. ' + owner.name.split(' ')[0].toLowerCase() + '@company.com'" inputmode="email" type="email" [value]="owner.email" (valueChange)="owner.email = $event" [error]="owner.email && !isValidEmail(owner.email) ? ('team_invite.invalid_email' | t) : ''"></app-input>
                  </div>
                  <div class="invite-field">
                    <label class="field-label">{{ 'team_invite.role_label' | t }}</label>
                    <select class="field-select" [(ngModel)]="owner.role">
                      <option value="">{{ 'team_invite.select_role' | t }}</option>
                      <option value="Admin">{{ 'team_invite.role_admin' | t }}</option>
                      <option value="Editor">{{ 'team_invite.role_editor' | t }}</option>
                      <option value="Viewer">{{ 'team_invite.role_viewer' | t }}</option>
                    </select>
                  </div>
                </div>
                <button class="remove-btn" (click)="removeCrOwner(i)" aria-label="Remove team member">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </app-card>
        </ng-container>

        <!-- Invite Members Section -->
        <div class="list-section-label" [style.margin-top.px]="crOwners.length > 0 ? 24 : 0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
          <span>{{ crOwners.length > 0 ? ('team_invite.additional_members' | t) : ('team_invite.invite_members' | t) }}</span>
          <span *ngIf="crOwners.length > 0" class="optional-tag">{{ 'team_invite.optional' | t }}</span>
        </div>

        <app-card [padding]="28">
          <div class="invite-list">
            <div *ngFor="let inv of additionalInvites; let i = index" class="invite-row">
              <div class="invite-num extra">{{ crOwners.length + i + 1 }}</div>
              <div class="invite-fields">
                <div class="invite-field">
                  <app-input [label]="('team_invite.email_label' | t)" [placeholder]="('team_invite.email_placeholder' | t)" inputmode="email" type="email" [value]="inv.email" (valueChange)="inv.email = $event" [error]="inv.email && !isValidEmail(inv.email) ? ('team_invite.invalid_email' | t) : ''"></app-input>
                </div>
                <div class="invite-field">
                  <label class="field-label">{{ 'team_invite.role_label' | t }}</label>
                  <select class="field-select" [(ngModel)]="inv.role">
                    <option value="Admin">{{ 'team_invite.role_admin' | t }}</option>
                    <option value="Editor">{{ 'team_invite.role_editor' | t }}</option>
                    <option value="Viewer">{{ 'team_invite.role_viewer' | t }}</option>
                  </select>
                </div>
              </div>
              <button class="remove-btn" (click)="removeAdditional(i)" aria-label="Remove invite">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <button class="add-another" (click)="addAdditional()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {{ 'team_invite.add_another' | t }}
            </button>
          </div>
        </app-card>

        <!-- Actions -->
        <div class="actions">
          <app-btn variant="primary" size="lg" [disabled]="!hasValidInvite" (clicked)="sendAndContinue()">
            {{ 'team_invite.send_continue' | t }} <span class="dir-arrow">&rarr;</span>
          </app-btn>
          <button class="skip-btn" (click)="skip()">{{ 'team_invite.skip' | t }}</button>
        </div>

        <!-- Helper note -->
        <div class="helper-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>{{ 'team_invite.email_helper' | t }}</span>
        </div>

        <!-- Demo: view invite acceptance page -->
        <div class="demo-bar" style="margin-top: 28px">
          <button class="demo-toggle" (click)="goToInviteAccept()">{{ 'team_invite.demo_invite' | t }} <span class="dir-arrow">&rarr;</span></button>
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
      max-width: 620px;
      margin: 0 auto;
      padding: 32px 24px 60px;
    }

    .container { width: 100%; }

    .icon-header {
      display: flex;
      justify-content: center;
      margin: 24px 0 20px;
    }

    .icon-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${C.green}, #007a44);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .welcome-section {
      text-align: center;
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
      margin: 0 0 8px 0;
    }

    .welcome-subtitle {
      font-size: 14px;
      color: ${C.g500};
      margin: 0;
      line-height: 1.6;
      max-width: 440px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Section labels */
    .list-section-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      margin-bottom: 10px;
    }

    .cr-badge {
      font-size: 10px;
      font-weight: 700;
      color: ${C.blue500};
      background: ${C.blue50};
      padding: 2px 8px;
      border-radius: 8px;
    }

    .optional-tag {
      font-size: 10px;
      font-weight: 700;
      color: ${C.g400};
      background: ${C.g100};
      padding: 2px 8px;
      border-radius: 8px;
    }

    /* Invite list */
    .invite-list {}

    .invite-row {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 16px 0;
      border-bottom: 1px solid ${C.g100};
    }

    .invite-row:first-child { padding-top: 0; }
    .invite-row:last-of-type { border-bottom: none; }

    /* Demo controls */
    .demo-bar {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-bottom: 20px;
    }

    .demo-toggle {
      background: ${C.g50};
      border: 1px dashed ${C.g300};
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 600;
      color: ${C.g500};
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .demo-toggle:hover { background: ${C.g100}; color: ${C.g700}; }
    .demo-toggle.active { background: ${C.g200}; color: ${C.g700}; border-color: ${C.g400}; }

    .invite-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${C.blue50};
      color: ${C.blue500};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .invite-num.extra {
      background: ${C.g100};
      color: ${C.g500};
    }

    .invite-fields {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    /* Locked field (CR name) */
    .field-locked {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: ${C.g50};
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
    }

    .empty-cr {
      padding: 14px 0;
      font-size: 13px;
      color: ${C.g400};
      text-align: center;
    }

    .owner-role-tag {
      margin-left: auto;
      font-size: 10px;
      font-weight: 700;
      color: ${C.amber500};
      background: ${C.amber50};
      padding: 2px 8px;
      border-radius: 6px;
    }

    .field-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: ${C.g500};
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .field-select {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      font-size: 13px;
      font-family: inherit;
      color: ${C.g900};
      outline: none;
      background: ${C.white};
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
    }
    .field-select:focus { border-color: ${C.green}; }

    .remove-btn {
      background: none;
      border: none;
      color: ${C.g400};
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      margin-top: 2px;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .remove-btn:hover { color: ${C.red500}; background: ${C.red50}; }

    .add-another {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      color: ${C.green};
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      padding: 12px 0 4px;
      font-family: inherit;
      transition: opacity 0.15s;
    }
    .add-another:hover { opacity: 0.8; }

    /* Actions */
    .actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-top: 28px;
    }

    .skip-btn {
      background: none;
      border: none;
      color: ${C.g400};
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      padding: 8px 16px;
      font-family: inherit;
      transition: color 0.15s;
    }
    .skip-btn:hover { color: ${C.g600}; }

    /* Helper note */
    .helper-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
      font-size: 12px;
      color: ${C.g400};
    }

    @media (max-width: 768px) {
      .header-bar { padding: 14px 16px; }
      .page { padding: 24px 16px 48px; }
      .invite-fields { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .page { padding: 20px 12px 36px; }
      .welcome-title { font-size: 20px; }
      .welcome-subtitle { font-size: 13px; }
    }
  `]
})
export class TeamInviteComponent implements OnInit {
  C = C;
  noCrMode = false;

  // Pre-populated from CR API — names are locked, user fills email & role
  crOwners = [
    { name: 'Mohammad Al-Omran', crRole: 'Partner', email: '', role: '' },
    { name: 'Khalid Al-Salem', crRole: 'Partner', email: '', role: '' },
    { name: 'Faisal Al-Rajhi', crRole: 'Authorized Signatory', email: '', role: '' },
  ];

  private savedCrOwners = [...this.crOwners.map(o => ({ ...o }))];

  // Additional members added manually
  additionalInvites: { email: string; role: string }[] = [];

  private crRoleKeyMap: Record<string, string> = {
    Partner: 'common.role_partner',
    'Authorized Signatory': 'common.role_authorized_signatory',
  };

  private fromOnboarding = false;

  constructor(private router: Router, private route: ActivatedRoute, public i18n: I18nService) {}

  ngOnInit(): void {
    this.fromOnboarding = this.route.snapshot.queryParamMap.get('from') === 'onboarding';
  }

  translateCrRole(role: string): string {
    return this.crRoleKeyMap[role] ? this.i18n.t(this.crRoleKeyMap[role]) : role;
  }

  get hasValidInvite(): boolean {
    const hasCR = this.crOwners.some(o => o.email.trim() !== '');
    const hasExtra = this.additionalInvites.some(inv => inv.email.trim() !== '');
    return hasCR || hasExtra;
  }

  setMode(noCr: boolean) {
    this.noCrMode = noCr;
    if (noCr) {
      this.crOwners = [];
      this.additionalInvites = [{ email: '', role: 'Viewer' }];
    } else {
      this.crOwners = this.savedCrOwners.map(o => ({ ...o }));
      this.additionalInvites = [];
    }
  }

  removeCrOwner(index: number) {
    this.crOwners.splice(index, 1);
  }

  addAdditional() {
    this.additionalInvites.push({ email: '', role: 'Viewer' });
  }

  removeAdditional(index: number) {
    this.additionalInvites.splice(index, 1);
  }

  sendAndContinue() {
    if (this.fromOnboarding) {
      this.router.navigateByUrl('/dashboard?state=new');
    } else {
      this.router.navigateByUrl('/dashboard/teams');
    }
  }

  skip() {
    if (this.fromOnboarding) {
      this.router.navigateByUrl('/dashboard?state=new');
    } else {
      this.router.navigateByUrl('/dashboard/teams');
    }
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  goToInviteAccept() {
    this.router.navigate(['/invite/accept']);
  }
}
