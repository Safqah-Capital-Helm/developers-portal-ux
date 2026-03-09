import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { C } from '../../shared/theme';

@Component({
  selector: 'app-submit-success',
  standalone: true,
  imports: [],
  template: `
    <div class="success-page">
      <div class="content">
        <div class="check-circle">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 class="title">Application submitted!</h1>
        <p class="subtitle">Your application is now under review. We'll notify you of any updates via email and SMS.</p>
        <p class="redirect-text">Redirecting to your dashboard...</p>
        <div class="progress-track">
          <div class="progress-fill"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .success-page {
      min-height: 100vh;
      background: ${C.white};
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: fadeIn 0.6s ease forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to   { opacity: 1; transform: scale(1); }
    }

    .check-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: ${C.green};
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      box-shadow: 0 8px 24px rgba(0, 161, 90, 0.25);
    }

    .title {
      font-size: 28px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 8px 0;
    }

    .subtitle {
      font-size: 15px;
      color: ${C.g500};
      margin: 0 0 32px 0;
      max-width: 360px;
      line-height: 1.5;
    }

    .redirect-text {
      font-size: 13px;
      color: ${C.g400};
      margin: 0 0 12px 0;
    }

    .progress-track {
      width: 120px;
      height: 3px;
      background: ${C.g100};
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      width: 100%;
      height: 100%;
      background: ${C.green};
      border-radius: 3px;
      animation: fillBar 3.5s linear forwards;
    }

    @keyframes fillBar {
      from { width: 0%; }
      to   { width: 100%; }
    }
  `]
})
export class SubmitSuccessComponent implements OnDestroy {
  private redirectTimer: any;

  constructor(private router: Router) {
    this.redirectTimer = setTimeout(() => {
      this.router.navigateByUrl('/dashboard');
    }, 4000);
  }

  ngOnDestroy() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
  }
}
