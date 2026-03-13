import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { LogoComponent, TranslatePipe } from '../../shared';
import { I18nService } from '../../shared/i18n/i18n.service';

@Component({
  selector: 'app-not-dev',
  standalone: true,
  imports: [CommonModule, LogoComponent, TranslatePipe],
  template: `
    <div class="page-white">
      <!-- Header -->
      <header class="top-bar">
        <app-logo [size]="32"></app-logo>
        <a class="help-link" (click)="go('/support')">{{ 'not_eligible.help' | t }}</a>
      </header>

      <div class="center-wrap animate-in">
        <!-- Red status icon -->
        <div class="status-icon">
          <div class="icon-ring">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        </div>

        <h1 class="title">{{ 'not_eligible.title' | t }}</h1>
        <p class="subtitle">{{ 'not_eligible.desc' | t }}</p>

        <!-- Reason card -->
        <div class="reason-card">
          <div class="reason-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.g500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ 'not_eligible.reasons_title' | t }}</span>
          </div>
          <div class="reason-list">
            <div class="reason-item" *ngFor="let r of reasons">
              <div class="reason-bullet"></div>
              <span>{{ r }}</span>
            </div>
          </div>
        </div>

        <!-- What you can do -->
        <div class="actions-section">
          <p class="actions-title">{{ 'not_eligible.what_you_can_do' | t }}</p>
          <div class="action-cards">
            <div class="action-card" (click)="go('/')">
              <div class="action-icon" [style.background]="C.greenLt">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  <polyline points="21 3 21 9 15 9"/>
                </svg>
              </div>
              <div class="action-text">
                <span class="action-label">{{ 'not_eligible.try_different_cr' | t }}</span>
                <span class="action-desc">{{ 'not_eligible.try_different_cr_desc' | t }}</span>
              </div>
              <svg class="action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>

            <div class="action-card" (click)="go('/support')">
              <div class="action-icon" [style.background]="C.blue50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div class="action-text">
                <span class="action-label">{{ 'not_eligible.contact_support' | t }}</span>
                <span class="action-desc">{{ 'not_eligible.contact_support_desc' | t }}</span>
              </div>
              <svg class="action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>

            <div class="action-card" (click)="openSafqah()">
              <div class="action-icon" [style.background]="C.purpleLt">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.purple}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div class="action-text">
                <span class="action-label">{{ 'not_eligible.learn_eligibility' | t }}</span>
                <span class="action-desc">{{ 'not_eligible.learn_eligibility_desc' | t }}</span>
              </div>
              <svg class="action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Footer note -->
        <p class="footer-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          {{ 'not_eligible.data_secure' | t }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .top-bar {
      max-width: 1200px; margin: 0 auto; padding: 20px 40px;
      display: flex; align-items: center; justify-content: space-between;
    }

    .help-link {
      font-size: 13px; color: ${C.g500}; cursor: pointer;
      font-weight: 600; text-decoration: none;
    }
    .help-link:hover { color: ${C.g600}; }

    .center-wrap {
      max-width: 520px;
      margin: 0 auto;
      padding: 20px 24px 80px;
      text-align: center;
    }

    /* Status icon */
    .status-icon {
      display: flex; justify-content: center; margin-bottom: 24px;
    }

    .icon-ring {
      width: 72px; height: 72px; border-radius: 50%;
      background: linear-gradient(135deg, ${C.red500}, #d92d20);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 28px rgba(240, 68, 56, 0.25);
      animation: iconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes iconPop {
      0%   { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .title {
      font-size: 28px; font-weight: 900; color: ${C.g900};
      margin-bottom: 12px; letter-spacing: -0.5px;
    }

    .subtitle {
      font-size: 15px; color: ${C.g500}; line-height: 1.7;
      max-width: 440px; margin: 0 auto 32px;
    }

    /* Reason card */
    .reason-card {
      background: ${C.red50}; border: 1px solid #fee4e2;
      border-radius: 16px; padding: 20px 24px;
      text-align: left; margin-bottom: 32px;
    }

    .reason-header {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 14px;
    }
    .reason-header span {
      font-size: 13px; font-weight: 700; color: ${C.g700};
      text-transform: uppercase; letter-spacing: 0.3px;
    }

    .reason-list {
      display: flex; flex-direction: column; gap: 10px;
    }

    .reason-item {
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 14px; color: ${C.g600}; line-height: 1.5;
    }

    .reason-bullet {
      width: 6px; height: 6px; border-radius: 50%;
      background: ${C.red500}; flex-shrink: 0;
      margin-top: 7px;
    }

    /* Actions section */
    .actions-section {
      text-align: left; margin-bottom: 32px;
    }

    .actions-title {
      font-size: 13px; font-weight: 700; color: ${C.g700};
      text-transform: uppercase; letter-spacing: 0.3px;
      margin-bottom: 12px; padding-left: 4px;
    }

    .action-cards {
      display: flex; flex-direction: column; gap: 8px;
    }

    .action-card {
      display: flex; align-items: center; gap: 14px;
      padding: 16px 18px; background: ${C.g50};
      border: 1px solid ${C.g200}; border-radius: 14px;
      cursor: pointer; transition: all 0.15s ease;
    }
    .action-card:hover {
      background: ${C.white}; border-color: ${C.g300};
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .action-icon {
      width: 42px; height: 42px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .action-text {
      flex: 1; display: flex; flex-direction: column; gap: 2px;
      text-align: left;
    }

    .action-label {
      font-size: 14px; font-weight: 700; color: ${C.g900};
    }

    .action-desc {
      font-size: 12px; color: ${C.g500}; line-height: 1.4;
    }

    .action-arrow {
      flex-shrink: 0; opacity: 0.4;
      transition: opacity 0.15s, transform 0.15s;
    }
    .action-card:hover .action-arrow {
      opacity: 0.7; transform: translateX(2px);
    }

    /* Footer */
    .footer-note {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; font-size: 12px; color: ${C.g400};
    }

    /* RTL */
    :host-context([dir="rtl"]) .notice-card { text-align: right; }
    :host-context([dir="rtl"]) .actions-section { text-align: right; }
    :host-context([dir="rtl"]) .resource-text { text-align: right; }

    @media (max-width: 768px) {
      .top-bar { padding: 16px 16px; }
      .hero-area { padding: 40px 16px 60px; }
    }
    @media (max-width: 480px) {
      .hero-area { padding: 28px 12px 40px; }
      .title { font-size: 22px; }
      .subtitle { font-size: 14px; }
    }
  `]
})
export class NotDevComponent {
  readonly C = C;

  get reasons() {
    return [
      this.i18n.t('not_eligible.reason_1'),
      this.i18n.t('not_eligible.reason_2'),
      this.i18n.t('not_eligible.reason_3'),
      this.i18n.t('not_eligible.reason_4'),
    ];
  }

  constructor(private router: Router, private i18n: I18nService) {}

  go(path: string) {
    this.router.navigateByUrl(path);
  }

  openSafqah() {
    // In a real app this would open an external link
    // For prototype, just stay on page
  }
}
