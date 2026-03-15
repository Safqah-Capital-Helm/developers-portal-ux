import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { NavComponent, BackLinkComponent, CardComponent, InputComponent, ButtonComponent, AvatarComponent, TranslatePipe, I18nService } from '../../shared';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent, BackLinkComponent, CardComponent, InputComponent, ButtonComponent, AvatarComponent, TranslatePipe],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard" [label]="('profile.back_to_dashboard' | t)"></app-back-link>

        <h1 class="page-title">{{ 'profile.title' | t }}</h1>
        <p class="page-subtitle">{{ 'profile.subtitle' | t }}</p>

        <app-card [padding]="28">
          <!-- Avatar area -->
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <app-avatar initials="A" size="xl" color="green"></app-avatar>
              <div class="camera-overlay">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
            <div class="avatar-info">
              <span class="avatar-name">Ahmed Al-Salem</span>
              <span class="avatar-role">{{ 'profile.developer_account' | t }}</span>
            </div>
          </div>

          <!-- Form fields -->
          <app-input
            [label]="'profile.full_name' | t"
            [value]="name"
            (valueChange)="name = $event"
            [placeholder]="('profile.full_name_placeholder' | t)"
            [helper]="'profile.full_name_helper' | t"
          ></app-input>

          <app-input
            [label]="'profile.email' | t"
            [value]="email"
            (valueChange)="email = $event"
            [placeholder]="('profile.email_placeholder' | t)"
            [helper]="'profile.email_helper' | t"
            [error]="email && email.length > 0 && !isValidEmail(email) ? i18n.t('validation.email_format') : ''"
            inputmode="email"
          ></app-input>

          <app-input
            [label]="'profile.phone' | t"
            [value]="phone"
            (valueChange)="phone = $event"
            placeholder="5x xxx xxxx"
            [helper]="'profile.phone_helper' | t"
            [error]="phone && phone.length > 1 && !isValidPhone(phone) ? i18n.t('validation.phone_format') : ''"
            inputmode="numeric"
            mask="digits"
            [maxlength]="9"
            prefix="+966"
          ></app-input>

          <!-- Language Preference -->
          <div class="section">
            <label class="section-label">{{ 'profile.language' | t }}</label>
            <div class="lang-buttons">
              <button
                class="lang-btn"
                [class.selected]="lang === 'en'"
                (click)="lang = 'en'"
              >{{ 'profile.english' | t }}</button>
              <button
                class="lang-btn"
                [class.selected]="lang === 'ar'"
                (click)="lang = 'ar'"
              >{{ 'profile.arabic' | t }}</button>
            </div>
          </div>

          <!-- Notifications -->
          <div class="section">
            <label class="section-label">{{ 'profile.notifications' | t }}</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input type="checkbox" [(ngModel)]="notifEmail" />
                <span class="checkmark"></span>
                {{ 'profile.notif_email' | t }}
              </label>
              <label class="checkbox-item">
                <input type="checkbox" [(ngModel)]="notifSms" />
                <span class="checkmark"></span>
                {{ 'profile.notif_sms' | t }}
              </label>
              <label class="checkbox-item">
                <input type="checkbox" [(ngModel)]="notifWhatsapp" />
                <span class="checkmark"></span>
                {{ 'profile.notif_whatsapp' | t }}
              </label>
            </div>
          </div>

          <!-- Success message -->
          <div class="success-msg" *ngIf="saved">
            <span>&#10003; {{ 'profile.saved' | t }}</span>
          </div>

          <!-- Save button -->
          <app-btn variant="primary" [full]="true" (clicked)="save()">{{ 'profile.save' | t }}</app-btn>
        </app-card>

        <!-- Delete account link -->
        <div class="delete-area">
          <button class="delete-link">{{ 'profile.delete_account' | t }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page {
      min-height: 100vh;
      background: ${C.bg};
    }

    .container {
      max-width: 520px;
      margin: 0 auto;
      padding: 32px;
    }

    .page-title {
      font-size: 22px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: ${C.g500};
      margin: 0 0 24px 0;
    }

    /* Avatar section */
    .avatar-section {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid ${C.g200};
    }

    .avatar-wrapper {
      position: relative;
      cursor: pointer;
    }

    .camera-overlay {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${C.green};
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid ${C.white};
    }

    .avatar-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .avatar-name {
      font-size: 15px;
      font-weight: 700;
      color: ${C.g900};
    }

    .avatar-role {
      font-size: 13px;
      color: ${C.g500};
    }

    /* Section styling */
    .section {
      margin-bottom: 20px;
    }

    .section-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      display: block;
      margin-bottom: 8px;
    }

    /* Language buttons */
    .lang-buttons {
      display: flex;
      gap: 8px;
    }

    .lang-btn {
      padding: 9px 20px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      border: 1.5px solid ${C.g200};
      background: ${C.white};
      color: ${C.g600};
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    .lang-btn.selected {
      background: ${C.greenLt};
      color: ${C.green};
      border-color: ${C.green};
      font-weight: 700;
    }

    /* Checkbox group */
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: ${C.g700};
      cursor: pointer;
      position: relative;
      padding-left: 30px;
    }

    .checkbox-item input[type="checkbox"] {
      position: absolute;
      left: 0;
      opacity: 0;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .checkmark {
      position: absolute;
      left: 0;
      width: 20px;
      height: 20px;
      border-radius: 6px;
      border: 1.5px solid ${C.g300};
      background: ${C.white};
      transition: all 0.2s;
    }

    .checkbox-item input:checked ~ .checkmark {
      background: ${C.green};
      border-color: ${C.green};
    }

    .checkbox-item input:checked ~ .checkmark::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid #fff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    /* Success message */
    .success-msg {
      background: ${C.greenLt};
      color: ${C.greenDk};
      font-size: 13px;
      font-weight: 600;
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 16px;
    }

    /* Delete link */
    .delete-area {
      text-align: center;
      padding: 20px 0;
    }

    .delete-link {
      background: none;
      border: none;
      color: ${C.red500};
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }

    .delete-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .container { padding: 24px 16px; }
      .page-title { font-size: 20px; }
    }

    @media (max-width: 480px) {
      .container { padding: 20px 12px; }
      .page-title { font-size: 18px; }
      .avatar-section { flex-direction: column; text-align: center; }
      .lang-buttons { flex-direction: column; }
      .lang-btn { width: 100%; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  name = 'Ahmed Al-Salem';
  email = 'ahmed@alomran.com';
  phone = '501234567';
  lang = 'en';
  notifEmail = true;
  notifSms = true;
  notifWhatsapp = true;
  saved = false;
  fromOnboarding = false;

  constructor(private router: Router, private route: ActivatedRoute, public i18n: I18nService) {}

  ngOnInit(): void {
    this.fromOnboarding = this.route.snapshot.queryParamMap.get('from') === 'onboarding';
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone: string): boolean {
    return /^5\d{8}$/.test(phone);
  }

  go(path: string) { this.router.navigateByUrl(path); }

  save() {
    this.saved = true;
    if (this.fromOnboarding) {
      setTimeout(() => {
        this.router.navigateByUrl('/dashboard?state=new');
      }, 1000);
    } else {
      setTimeout(() => this.saved = false, 3000);
    }
  }
}
