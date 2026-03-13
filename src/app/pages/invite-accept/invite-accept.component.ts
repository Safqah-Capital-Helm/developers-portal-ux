import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import {
  LogoComponent,
  ButtonComponent,
  CardComponent,
  TranslatePipe,
} from '../../shared';

@Component({
  selector: 'app-invite-accept',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent, ButtonComponent, CardComponent, TranslatePipe],
  template: `
    <!-- Header bar -->
    <div class="header-bar">
      <app-logo [size]="32"></app-logo>
    </div>

    <div class="page">
      <div class="container">

        <!-- Icon header -->
        <div class="icon-header">
          <div class="icon-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
        </div>

        <!-- Welcome text -->
        <div class="welcome-section">
          <h1 class="welcome-title">{{ 'invite_accept.title' | t }}</h1>
          <p class="welcome-subtitle">
            {{ 'invite_accept.desc' | t }}
          </p>
          <div class="company-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
            </svg>
            <span>Al-Salem Development Co.</span>
          </div>
          <p class="role-info">
            {{ 'invite_accept.as_role' | t }} <span class="role-tag">Editor</span>
          </p>
        </div>

        <!-- Form -->
        <app-card [padding]="28">
          <div class="form-intro">{{ 'invite_accept.complete_profile' | t }}</div>

          <div class="form-fields">
            <div class="field-group">
              <label class="field-label">{{ 'invite_accept.full_name' | t }}</label>
              <input class="field-input" [placeholder]="('invite_accept.full_name_placeholder' | t)" [(ngModel)]="fullName" />
            </div>

            <div class="field-group">
              <label class="field-label">{{ 'invite_accept.phone' | t }}</label>
              <input class="field-input" [placeholder]="('invite_accept.phone_placeholder' | t)" [(ngModel)]="phone" />
            </div>
          </div>

          <div class="email-display">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>mohammad&#64;company.com</span>
            <span class="verified-tag">{{ 'invite_accept.verified_via_link' | t }}</span>
          </div>
        </app-card>

        <!-- Actions -->
        <div class="actions">
          <app-btn variant="primary" size="lg" [disabled]="!fullName.trim() || !phone.trim()" (clicked)="accept()">
            {{ 'invite_accept.accept' | t }} &rarr;
          </app-btn>
          <button class="decline-btn" (click)="showDecline = true">{{ 'invite_accept.decline_invitation' | t }}</button>
        </div>

        <!-- Decline confirmation -->
        <div *ngIf="showDecline" class="decline-confirm">
          <app-card [padding]="20">
            <div class="decline-content">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div>
                <p class="decline-text">{{ 'invite_accept.decline_confirm' | t }}</p>
                <div class="decline-actions">
                  <app-btn variant="danger" size="sm" (clicked)="0">{{ 'invite_accept.yes_decline' | t }}</app-btn>
                  <app-btn variant="secondary" size="sm" (clicked)="showDecline = false">Cancel</app-btn>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- Helper note -->
        <div class="helper-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>{{ 'invite_accept.terms_note' | t }}</span>
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
      padding: 14px 32px;
      background: ${C.white};
      border-bottom: 1px solid ${C.g200};
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .page {
      max-width: 480px;
      margin: 0 auto;
      padding: 32px 24px 60px;
    }

    .container { width: 100%; }

    .icon-header {
      display: flex;
      justify-content: center;
      margin: 32px 0 20px;
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

    /* Welcome */
    .welcome-section {
      text-align: center;
      margin-bottom: 28px;
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
      margin: 0 0 12px 0;
      line-height: 1.6;
    }

    .welcome-subtitle strong {
      color: ${C.g700};
    }

    .company-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: ${C.greenLt};
      border: 1.5px solid ${C.green}20;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 800;
      color: ${C.green};
    }

    .role-info {
      font-size: 13px;
      color: ${C.g500};
      margin: 12px 0 0 0;
    }

    .role-tag {
      font-weight: 700;
      color: ${C.purple};
      background: ${C.purpleLt};
      padding: 2px 10px;
      border-radius: 6px;
      font-size: 12px;
    }

    /* Form */
    .form-intro {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      margin-bottom: 16px;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 16px;
    }

    .field-group {}

    .field-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: ${C.g500};
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .field-input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      font-size: 13px;
      font-family: inherit;
      color: ${C.g900};
      outline: none;
      transition: border-color 0.2s;
      background: ${C.white};
    }
    .field-input:focus { border-color: ${C.green}; }
    .field-input::placeholder { color: ${C.g300}; }

    .email-display {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: ${C.g50};
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      font-size: 13px;
      color: ${C.g600};
    }

    .verified-tag {
      margin-left: auto;
      font-size: 10px;
      font-weight: 700;
      color: ${C.green};
      background: ${C.greenLt};
      padding: 2px 8px;
      border-radius: 6px;
    }

    /* Actions */
    .actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-top: 24px;
    }

    .decline-btn {
      background: none;
      border: none;
      color: ${C.g400};
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 16px;
      font-family: inherit;
      transition: color 0.15s;
    }
    .decline-btn:hover { color: ${C.red500}; }

    /* Decline confirmation */
    .decline-confirm {
      margin-top: 16px;
    }

    .decline-content {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .decline-text {
      font-size: 13px;
      color: ${C.g600};
      line-height: 1.5;
      margin: 0 0 12px 0;
    }

    .decline-actions {
      display: flex;
      gap: 8px;
    }

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
  `]
})
export class InviteAcceptComponent {
  C = C;
  fullName = '';
  phone = '';
  showDecline = false;

  constructor(private router: Router) {}

  accept() {
    this.router.navigate(['/dashboard']);
  }
}
