import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C } from '../../theme';

@Component({
  selector: 'app-result-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="result-screen">
      <div class="icon-circle" [style.background]="gradient" [style.boxShadow]="shadow">
        <!-- success (check) -->
        <svg *ngIf="type === 'success'" width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <!-- error (X) -->
        <svg *ngIf="type === 'error'" width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
        <!-- warning (clock) -->
        <svg *ngIf="type === 'warning'" width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <!-- info -->
        <svg *ngIf="type === 'info'" width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>

      <div class="title">{{ title }}</div>
      <div class="subtitle" *ngIf="subtitle">{{ subtitle }}</div>

      <div class="actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .result-screen {
      display: flex; flex-direction: column; align-items: center;
      text-align: center; padding: 40px 0;
    }
    .icon-circle {
      width: 64px; height: 64px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .title {
      font-size: 24px; font-weight: 900; color: ${C.g900};
      margin-top: 24px;
    }
    .subtitle {
      font-size: 14px; color: ${C.g500};
      line-height: 1.5; margin-top: 8px;
    }
    .actions { margin-top: 24px; }
  `]
})
export class ResultScreenComponent {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'success';
  @Input() title = '';
  @Input() subtitle = '';

  private gradients: Record<string, string> = {
    success: `linear-gradient(135deg, ${C.green}, ${C.greenDk})`,
    error:   'linear-gradient(135deg, #f04438, #d92d20)',
    warning: `linear-gradient(135deg, ${C.amber500}, ${C.amber600})`,
    info:    `linear-gradient(135deg, ${C.blue500}, #1570cd)`,
  };

  private shadows: Record<string, string> = {
    success: `0 8px 24px rgba(0, 175, 61, 0.25)`,
    error:   '0 8px 24px rgba(240, 68, 56, 0.25)',
    warning: `0 8px 24px rgba(247, 144, 9, 0.25)`,
    info:    `0 8px 24px rgba(46, 144, 250, 0.25)`,
  };

  get gradient() { return this.gradients[this.type] ?? this.gradients['success']; }
  get shadow() { return this.shadows[this.type] ?? this.shadows['success']; }
}
