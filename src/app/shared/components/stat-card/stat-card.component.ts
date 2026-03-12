import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { C } from '../../theme';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="stat-card">
      <div class="stat-icon" [style.background]="iconBg">
        <span [innerHTML]="safeIcon"></span>
      </div>
      <div class="stat-label">{{ label }}</div>
      <div class="stat-value">{{ value }}</div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 14px;
      padding: 18px 20px;
    }
    .stat-icon {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px;
    }
    .stat-label {
      font-size: 12px; font-weight: 700; color: ${C.g500};
      text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 4px;
    }
    .stat-value {
      font-size: 28px; font-weight: 900; color: ${C.g900};
    }
  `]
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = '';
  @Input() iconBg: string = C.g100;

  constructor(private sanitizer: DomSanitizer) {}

  get safeIcon(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.icon);
  }
}
