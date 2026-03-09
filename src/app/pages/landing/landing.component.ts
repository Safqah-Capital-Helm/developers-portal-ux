import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [LogoComponent, ButtonComponent, FormsModule],
  template: `
    <div class="page-white">
      <header class="top-bar">
        <app-logo [size]="36"></app-logo>
        <div class="top-links">
          <span class="link">العربية</span>
          <span class="link">Help</span>
        </div>
      </header>

      <div class="hero">
        <div class="hero-left animate-in">
          <div class="tag"><span>CMA Licensed · Sharia Compliant</span></div>
          <h1>Finance your next<br/><span class="accent">real estate project</span></h1>
          <p class="subtitle">Get structured financing and receive a term-sheet within 48 hours.</p>
          <div class="stats">
            <div class="stat"><div class="stat-num">15 min</div><div class="stat-label">to submit</div></div>
            <div class="stat"><div class="stat-num">SAR 2B+</div><div class="stat-label">financed</div></div>
            <div class="stat"><div class="stat-num">48 hours</div><div class="stat-label">to term-sheet</div></div>
          </div>
        </div>

        <div class="hero-right animate-in" style="animation-delay: 0.2s">
          <div class="form-card">
            <h2>Get started</h2>
            <p class="form-sub">Check eligibility — no login required</p>
            <label class="input-label">CR Number</label>
            <div class="cr-input-wrap">
              <div class="cr-prefix"><span>CR</span></div>
              <input [(ngModel)]="cr" placeholder="1010XXXXXX" (keydown.enter)="doCheck()" class="cr-input"/>
            </div>
            <p class="hint">Enter 999... to test rejection</p>
            <app-btn variant="primary" [full]="true" size="lg" [disabled]="!cr || checking" (clicked)="doCheck()">
              {{ checking ? 'Verifying...' : 'Request your financing today →' }}
            </app-btn>
            <div class="signin-link">
              <p>Already have an account? <a (click)="router.navigate(['/sign-in'])">Sign in</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .top-bar {
      max-width: 1200px; margin: 0 auto; padding: 20px 40px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .top-links { display: flex; gap: 16px; }
    .link { font-size: 13px; color: #98a2b3; cursor: pointer; }
    .hero {
      max-width: 1200px; margin: 0 auto; padding: 60px 40px 80px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
    }
    .tag {
      display: inline-flex; padding: 6px 14px; border-radius: 20px;
      background: #e6f7ee; margin-bottom: 24px;
    }
    .tag span { font-size: 12px; color: #00a15a; font-weight: 700; }
    h1 { font-size: 48px; font-weight: 900; color: #101828; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px; }
    .accent { color: #00a15a; }
    .subtitle { font-size: 17px; color: #667085; line-height: 1.7; max-width: 440px; margin-bottom: 36px; }
    .stats { display: flex; gap: 40px; }
    .stat-num { font-size: 22px; font-weight: 800; color: #00a15a; }
    .stat-label { font-size: 12px; color: #98a2b3; margin-top: 3px; }
    .form-card {
      background: #f8f9fa; border-radius: 24px; padding: 40px 36px;
      border: 1px solid #e2e5e9;
    }
    h2 { font-size: 24px; font-weight: 900; color: #101828; margin-bottom: 8px; }
    .form-sub { font-size: 14px; color: #667085; margin-bottom: 28px; }
    .input-label {
      font-size: 12px; font-weight: 700; color: #475467; display: block;
      margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .cr-input-wrap {
      display: flex; background: #fff; border-radius: 14px;
      border: 1.5px solid #e2e5e9; overflow: hidden; margin-bottom: 8px;
    }
    .cr-prefix {
      padding: 13px 14px; background: #f8f9fa; border-right: 1px solid #e2e5e9;
    }
    .cr-prefix span { font-size: 13px; color: #98a2b3; font-weight: 700; font-family: 'IBM Plex Mono', monospace; }
    .cr-input {
      flex: 1; padding: 13px 14px; background: transparent; border: none; outline: none;
      font-size: 15px; color: #101828; font-family: 'IBM Plex Mono', monospace;
      letter-spacing: 1px; font-weight: 600;
    }
    .hint { font-size: 11px; color: #98a2b3; margin-bottom: 20px; }
    .signin-link {
      margin-top: 24px; text-align: center; padding-top: 20px;
      border-top: 1px solid #e2e5e9;
    }
    .signin-link p { font-size: 14px; color: #667085; }
    .signin-link a { color: #00a15a; font-weight: 700; cursor: pointer; text-decoration: underline; }
  `]
})
export class LandingComponent {
  cr = '';
  checking = false;

  constructor(public router: Router) {}

  doCheck() {
    if (!this.cr) return;
    this.checking = true;
    setTimeout(() => {
      this.checking = false;
      if (this.cr.startsWith('999')) {
        this.router.navigate(['/not-eligible']);
      } else {
        this.router.navigate(['/verify']);
      }
    }, 1500);
  }
}
