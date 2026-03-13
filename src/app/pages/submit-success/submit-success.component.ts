import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { C } from '../../shared/theme';
import { ResultScreenComponent, TranslatePipe } from '../../shared';

@Component({
  selector: 'app-submit-success',
  standalone: true,
  imports: [ResultScreenComponent, TranslatePipe],
  template: `
    <div class="success-page">
      <div class="content">
        <app-result-screen
          type="success"
          [title]="('add_application.success_title' | t)"
          [subtitle]="('add_application.success_desc' | t)"
        >
          <p class="redirect-text">{{ 'common.loading' | t }}</p>
          <div class="progress-track">
            <div class="progress-fill"></div>
          </div>
        </app-result-screen>
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
      this.router.navigateByUrl('/dashboard?state=new');
    }, 4000);
  }

  ngOnDestroy() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
  }
}
