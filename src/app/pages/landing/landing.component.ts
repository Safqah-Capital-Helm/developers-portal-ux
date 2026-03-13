import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TranslatePipe } from '../../shared';
import { I18nService } from '../../shared/i18n/i18n.service';
import { C } from '../../shared/theme';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, LogoComponent, ButtonComponent, FormsModule, TranslatePipe],
  template: `
    <!-- ═══ DARK HERO ═══ -->
    <div class="hero-section">
      <!-- Decorative gradient orbs -->
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>

      <header class="top-bar">
        <app-logo [size]="36" [light]="true"></app-logo>
        <div class="top-links">
          <span class="link lang-switch" (click)="toggleLang()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            {{ i18n.lang === 'en' ? 'العربية' : 'English' }}
          </span>
        </div>
      </header>

      <div class="hero">
        <div class="hero-left">
          <div class="hero-logo">
            <app-logo [size]="72" [light]="true"></app-logo>
          </div>
          <div class="tag"><span>{{ 'landing.tag_line' | t }}</span></div>
          <h1>{{ 'landing.hero_title' | t }}</h1>
          <p class="subtitle">{{ 'landing.hero_subtitle' | t }}</p>
          <div class="stats">
            <div class="stat">
              <div class="stat-num">{{ 'landing.stat_time' | t }}</div>
              <div class="stat-label">{{ 'landing.stat_time_label' | t }}</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <div class="stat-num">{{ 'landing.stat_financed' | t }}</div>
              <div class="stat-label">{{ 'landing.stat_financed_label' | t }}</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <div class="stat-num">{{ 'landing.stat_termsheet' | t }}</div>
              <div class="stat-label">{{ 'landing.stat_termsheet_label' | t }}</div>
            </div>
          </div>
        </div>

        <div class="hero-right">
          <div class="form-card">
            <h2>{{ 'landing.cta_register' | t }}</h2>
            <p class="form-sub">{{ 'landing.hero_subtitle' | t }}</p>
            <label class="input-label">{{ 'landing.cr_number' | t }}</label>
            <div class="cr-input-wrap">
              <div class="cr-prefix"><span>{{ 'landing.cr_prefix' | t }}</span></div>
              <input [(ngModel)]="cr" placeholder="1010XXXXXX" (keydown.enter)="doCheck()" (input)="onCrInput($event)" inputmode="numeric" maxlength="10" class="cr-input"/>
            </div>
            <p *ngIf="cr && cr.length !== 10" class="cr-error-text">{{ 'validation.cr_format' | t }}</p>
            <app-btn variant="primary" [full]="true" size="lg" [disabled]="cr.length !== 10 || checking" (clicked)="doCheck()">
              {{ checking ? ('landing.verifying' | t) : ('landing.cta_button' | t) }} {{ checking ? '' : '→' }}
            </app-btn>
            <button class="demo-reject" (click)="doReject()">{{ 'landing.demo_not_eligible' | t }}</button>
            <div class="absher-trust">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00af3d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>{{ 'landing.absher_trust' | t }}</span>
            </div>
            <div class="signin-link">
              <p>{{ 'landing.already_account' | t }} <a (click)="router.navigate(['/sign-in'])">{{ 'landing.cta_sign_in' | t }}</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ HOW IT WORKS ═══ -->
    <div class="section how-section">
      <div class="section-inner">
        <div class="section-header-centered">
          <h2 class="section-title">{{ 'landing.how_title' | t }}</h2>
          <p class="section-subtitle">{{ 'landing.how_subtitle' | t }}</p>
        </div>
        <div class="steps-row">
          <div class="step-card" *ngFor="let step of steps; let i = index">
            <div class="step-num-circle">{{ i + 1 }}</div>
            <div class="step-connector" *ngIf="i < steps.length - 1"></div>
            <h3 class="step-title">{{ step.title | t }}</h3>
            <p class="step-desc">{{ step.desc | t }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ FEATURES ═══ -->
    <div class="section features-section">
      <div class="section-inner">
        <div class="section-header-centered">
          <h2 class="section-title">{{ 'landing.features_title' | t }}</h2>
        </div>
        <div class="features-grid">
          <div class="feature-card" *ngFor="let f of features">
            <div class="feature-icon" [style.background]="f.iconBg">
              <svg *ngIf="f.icon==='apply'" width="22" height="22" viewBox="0 0 24 24" fill="none" [attr.stroke]="f.iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              <svg *ngIf="f.icon==='track'" width="22" height="22" viewBox="0 0 24 24" fill="none" [attr.stroke]="f.iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <svg *ngIf="f.icon==='manage'" width="22" height="22" viewBox="0 0 24 24" fill="none" [attr.stroke]="f.iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <h3 class="feature-title">{{ f.title | t }}</h3>
            <p class="feature-desc">{{ f.desc | t }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ TRUST BADGES ═══ -->
    <div class="section trust-section">
      <div class="section-inner">
        <h2 class="trust-heading">{{ 'landing.trust_title' | t }}</h2>
        <div class="trust-row">
          <div class="trust-badge" *ngFor="let b of trustBadges">
            <div class="trust-icon">
              <svg *ngIf="b.icon==='shield'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00af3d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <svg *ngIf="b.icon==='shield-check'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5034fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <svg *ngIf="b.icon==='building'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e90fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
              <svg *ngIf="b.icon==='monitor'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff825c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <span class="trust-label">{{ b.key | t }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ FOOTER ═══ -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-left">
          <app-logo [size]="28"></app-logo>
          <span class="footer-desc">{{ 'landing.footer_desc' | t }}</span>
        </div>
        <div class="footer-right">
          <span class="footer-link">{{ 'landing.footer_terms' | t }}</span>
          <span class="footer-link">{{ 'landing.footer_privacy' | t }}</span>
          <span class="footer-link">{{ 'landing.help' | t }}</span>
        </div>
      </div>
      <div class="footer-bottom">
        <span>{{ 'landing.footer_copy' | t }}</span>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }

    /* ═══ HERO SECTION (Dark) ═══ */
    .hero-section {
      background: linear-gradient(160deg, #0c1523 0%, #111827 40%, #0f1d2e 100%);
      position: relative; overflow: hidden;
    }
    .hero-orb {
      position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.15;
      pointer-events: none;
    }
    .hero-orb-1 {
      width: 500px; height: 500px; top: -100px; right: -100px;
      background: ${C.purple};
    }
    .hero-orb-2 {
      width: 400px; height: 400px; bottom: -80px; left: -80px;
      background: ${C.green};
    }

    .top-bar {
      max-width: 1200px; margin: 0 auto; padding: 20px 40px;
      display: flex; align-items: center; justify-content: space-between;
      position: relative; z-index: 2;
    }
    .top-links { display: flex; gap: 16px; align-items: center; }
    .link {
      font-size: 13px; color: rgba(255,255,255,0.55); cursor: pointer;
      font-weight: 600; transition: color 0.15s;
    }
    .link:hover { color: rgba(255,255,255,0.9); }
    .lang-switch {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 5px 10px; border-radius: 8px; transition: all 0.15s;
    }
    .lang-switch:hover { background: rgba(255,255,255,0.08); }

    .hero-logo { margin-bottom: 24px; }

    .hero {
      max-width: 1200px; margin: 0 auto; padding: 32px 40px 56px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 72px;
      align-items: center; position: relative; z-index: 2;
    }
    .hero-left { }
    .tag {
      display: inline-flex; padding: 6px 14px; border-radius: 20px;
      background: rgba(0,175,61,0.12); margin-bottom: 24px;
      border: 1px solid rgba(0,175,61,0.2);
    }
    .tag span { font-size: 12px; color: ${C.green}; font-weight: 700; }
    h1 {
      font-family: var(--font-title); font-size: 46px; font-weight: 700; color: #fff;
      line-height: 1.1; letter-spacing: -1.5px; margin: 0 0 20px;
    }
    .subtitle {
      font-size: 16px; color: rgba(255,255,255,0.5); line-height: 1.7;
      max-width: 440px; margin-bottom: 40px;
    }

    .stats { display: flex; align-items: center; gap: 0; }
    .stat { text-align: center; padding: 0 24px; }
    .stat:first-child { padding-left: 0; }
    .stat:last-child { padding-right: 0; }
    .stat-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.12); }
    .stat-num { font-size: 22px; font-weight: 900; color: ${C.green}; }
    .stat-label { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }

    /* Form card (elevated on dark bg) */
    .form-card {
      background: #fff; border-radius: 24px; padding: 40px 36px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05);
    }
    h2 { font-family: var(--font-title); font-size: 22px; font-weight: 700; color: ${C.g900}; margin: 0 0 8px; }
    .form-sub { font-size: 13px; color: ${C.g500}; margin-bottom: 28px; line-height: 1.5; }
    .input-label {
      font-size: 11px; font-weight: 700; color: ${C.g500}; display: block;
      margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .cr-input-wrap {
      display: flex; background: #fff; border-radius: 14px;
      border: 1.5px solid ${C.g200}; overflow: hidden; margin-bottom: 8px;
      transition: border-color 0.15s;
    }
    .cr-input-wrap:focus-within { border-color: ${C.green}; box-shadow: 0 0 0 3px rgba(0,175,61,0.08); }
    .cr-prefix {
      padding: 13px 14px; background: ${C.g50};
      border-right: 1px solid ${C.g200};
    }
    .cr-prefix span { font-size: 13px; color: ${C.g400}; font-weight: 700; font-family: 'IBM Plex Mono', monospace; }
    .cr-input {
      flex: 1; padding: 13px 14px; background: transparent; border: none; outline: none;
      font-size: 15px; color: ${C.g900}; font-family: 'IBM Plex Mono', monospace;
      letter-spacing: 1px; font-weight: 600;
    }
    .demo-reject {
      display: block; width: 100%; margin-top: 10px; padding: 8px;
      background: ${C.g50}; border: 1px dashed ${C.g300}; border-radius: 8px;
      font-size: 12px; font-weight: 600; color: ${C.g400};
      cursor: pointer; font-family: inherit; transition: all 0.15s;
    }
    .demo-reject:hover { background: ${C.g100}; color: ${C.g600}; }
    .absher-trust {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; margin-top: 16px;
      font-size: 12px; font-weight: 600; color: ${C.g500};
    }
    .signin-link {
      margin-top: 16px; text-align: center; padding-top: 20px;
      border-top: 1px solid ${C.g200};
    }
    .signin-link p { font-size: 14px; color: ${C.g500}; margin: 0; }
    .signin-link a { color: ${C.green}; font-weight: 700; cursor: pointer; text-decoration: underline; }

    /* ═══ SECTIONS (Light) ═══ */
    .section { padding: 80px 40px; }
    .section-inner { max-width: 1000px; margin: 0 auto; }
    .section-header-centered { text-align: center; margin-bottom: 48px; }
    .section-title {
      font-family: var(--font-title); font-size: 28px; font-weight: 700; color: ${C.g900}; margin: 0 0 10px;
      letter-spacing: -0.5px;
    }
    .section-subtitle { font-size: 15px; color: ${C.g500}; margin: 0; }

    /* How it works */
    .how-section { background: #fff; }
    .steps-row {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;
      position: relative;
    }
    .step-card { text-align: center; position: relative; }
    .step-num-circle {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, ${C.green}, ${C.greenDk});
      color: #fff; font-size: 18px; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 8px 24px rgba(0,175,61,0.2);
    }
    .step-connector {
      position: absolute; top: 24px; left: calc(50% + 32px);
      width: calc(100% - 64px); height: 2px;
      background: ${C.g200}; z-index: 0;
    }
    .step-title { font-size: 16px; font-weight: 800; color: ${C.g800}; margin: 0 0 8px; }
    .step-desc { font-size: 13px; color: ${C.g500}; line-height: 1.6; margin: 0; max-width: 260px; margin-left: auto; margin-right: auto; }

    /* Features */
    .features-section { background: ${C.bg}; }
    .features-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    }
    .feature-card {
      background: #fff; border: 1px solid ${C.g200};
      border-radius: 20px; padding: 32px 28px;
      transition: box-shadow 0.2s, transform 0.15s;
    }
    .feature-card:hover {
      box-shadow: 0 12px 32px rgba(0,0,0,0.06);
      transform: translateY(-3px);
    }
    .feature-icon {
      width: 48px; height: 48px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
    }
    .feature-title { font-size: 16px; font-weight: 800; color: ${C.g800}; margin: 0 0 8px; }
    .feature-desc { font-size: 13px; color: ${C.g500}; line-height: 1.6; margin: 0; }

    /* Trust badges */
    .trust-section { background: #fff; border-top: 1px solid ${C.g100}; }
    .trust-heading {
      text-align: center; font-size: 20px; font-weight: 800;
      color: ${C.g800}; margin: 0 0 32px;
    }
    .trust-row {
      display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;
    }
    .trust-badge {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 24px; border-radius: 12px;
      background: ${C.g50}; border: 1px solid ${C.g100};
    }
    .trust-icon { display: flex; align-items: center; }
    .trust-label { font-size: 13px; font-weight: 700; color: ${C.g700}; }

    /* Footer */
    .footer {
      background: ${C.g900}; padding: 48px 40px 24px;
    }
    .footer-inner {
      max-width: 1000px; margin: 0 auto;
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .footer-left { display: flex; align-items: center; gap: 16px; }
    .footer-desc { font-size: 13px; color: rgba(255,255,255,0.4); font-weight: 500; }
    .footer-right { display: flex; gap: 24px; }
    .footer-link {
      font-size: 13px; color: rgba(255,255,255,0.4); cursor: pointer;
      font-weight: 500; transition: color 0.15s;
    }
    .footer-link:hover { color: rgba(255,255,255,0.7); }
    .footer-bottom {
      max-width: 1000px; margin: 0 auto;
      padding-top: 20px; text-align: center;
      font-size: 12px; color: rgba(255,255,255,0.25); font-weight: 500;
    }

    /* ═══ RESPONSIVE ═══ */
    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; gap: 40px; padding: 40px 24px 60px; }
      .hero-left { text-align: center; }
      .subtitle { margin-left: auto; margin-right: auto; }
      .stats { justify-content: center; }
      .steps-row { gap: 24px; }
      .step-connector { display: none; }
      .features-grid { gap: 16px; }
      .top-bar { padding: 16px 24px; }
    }

    @media (max-width: 768px) {
      h1 { font-size: 34px; }
      .hero { padding: 32px 24px 56px; }
      .form-card { padding: 32px 24px; }
      .section { padding: 56px 24px; }
      .steps-row { grid-template-columns: 1fr; gap: 32px; }
      .features-grid { grid-template-columns: 1fr; }
      .trust-row { gap: 16px; }
      .footer-inner { flex-direction: column; gap: 20px; text-align: center; }
    }

    @media (max-width: 480px) {
      .hero-section { min-height: auto; }
      .hero { padding: 24px 16px 40px; gap: 28px; }
      h1 { font-size: 28px; letter-spacing: -1px; }
      .subtitle { font-size: 14px; margin-bottom: 28px; }
      .stats { flex-wrap: wrap; gap: 0; }
      .stat { padding: 0 16px; }
      .stat-num { font-size: 18px; }
      .top-bar { padding: 14px 16px; }
      .form-card { padding: 24px 16px; border-radius: 18px; }
      h2 { font-size: 20px; }
      .section { padding: 40px 16px; }
      .section-title { font-size: 22px; }
      .feature-card { padding: 24px 20px; }
      .trust-badge { padding: 10px 16px; }
      .footer { padding: 32px 16px 20px; }
      .footer-right { flex-wrap: wrap; justify-content: center; gap: 16px; }
    }

    /* ═══ RTL ═══ */
    .cr-error-text { font-size: 11px; color: #f04438; margin: 4px 0 0 0; font-weight: 600; }
    :host-context([dir="rtl"]) .cr-prefix { border-right: none; border-left: 1px solid ${C.g200}; }
    :host-context([dir="rtl"]) h1 { letter-spacing: 0; }
    :host-context([dir="rtl"]) .step-connector { left: auto; right: calc(50% + 32px); }
  `]
})
export class LandingComponent {
  C = C;
  cr = '';
  checking = false;

  steps = [
    { title: 'landing.step1_title', desc: 'landing.step1_desc' },
    { title: 'landing.step2_title', desc: 'landing.step2_desc' },
    { title: 'landing.step3_title', desc: 'landing.step3_desc' },
  ];

  features = [
    { title: 'landing.feature_apply', desc: 'landing.feature_apply_desc', icon: 'apply', iconBg: C.greenLt, iconColor: C.green },
    { title: 'landing.feature_track', desc: 'landing.feature_track_desc', icon: 'track', iconBg: C.blue50, iconColor: C.blue500 },
    { title: 'landing.feature_manage', desc: 'landing.feature_manage_desc', icon: 'manage', iconBg: C.purpleLt, iconColor: C.purple },
  ];

  trustBadges = [
    { key: 'landing.trust_cma', icon: 'shield' },
    { key: 'landing.trust_sharia', icon: 'shield-check' },
    { key: 'landing.trust_sama', icon: 'building' },
    { key: 'landing.trust_digital', icon: 'monitor' },
  ];

  constructor(public router: Router, public i18n: I18nService) {}

  toggleLang() {
    this.i18n.setLang(this.i18n.lang === 'en' ? 'ar' : 'en');
  }

  onCrInput(e: Event) {
    const input = e.target as HTMLInputElement;
    input.value = input.value.replace(/[^\d]/g, '');
    this.cr = input.value;
  }

  doCheck() {
    if (!this.cr) return;
    this.checking = true;
    setTimeout(() => {
      this.checking = false;
      this.router.navigate(['/verify']);
    }, 1500);
  }

  doReject() {
    this.router.navigate(['/not-eligible']);
  }
}
