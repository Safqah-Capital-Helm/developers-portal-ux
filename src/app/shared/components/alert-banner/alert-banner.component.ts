import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C } from '../../theme';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="alert-banner" *ngIf="visible"
         [style.borderLeftColor]="borderColor"
         [style.borderRightColor]="borderColor">
      <div class="icon-circle" [style.background]="iconBg">
        <!-- info -->
        <svg *ngIf="type === 'info'" width="18" height="18" viewBox="0 0 24 24" fill="none"
             [attr.stroke]="iconStroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <!-- warning (shield) -->
        <svg *ngIf="type === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none"
             [attr.stroke]="iconStroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <!-- error (x-circle) -->
        <svg *ngIf="type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none"
             [attr.stroke]="iconStroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <!-- success (check-circle) -->
        <svg *ngIf="type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none"
             [attr.stroke]="iconStroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>

      <div class="content">
        <div class="title">{{ title }}</div>
        <div class="message" *ngIf="message">{{ message }}</div>
      </div>

      <app-btn *ngIf="actionLabel" variant="primary" size="sm" (clicked)="action.emit()">
        {{ actionLabel }}
      </app-btn>

      <button class="dismiss" *ngIf="dismissible" (click)="dismiss()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .alert-banner {
      display: flex; align-items: center; gap: 14px;
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-left: 3.5px solid;
      border-radius: 14px;
      padding: 16px 18px;
    }
    .icon-circle {
      width: 38px; height: 38px; min-width: 38px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .content { flex: 1; min-width: 0; }
    .title {
      font-size: 14px; font-weight: 700; color: ${C.g900};
    }
    .message {
      font-size: 13px; color: ${C.g500}; margin-top: 2px;
    }
    .dismiss {
      background: none; border: none; cursor: pointer;
      padding: 4px; display: flex; align-items: center; justify-content: center;
      border-radius: 6px; transition: background 0.15s;
    }
    .dismiss:hover { background: ${C.g100}; }

    :host-context([dir="rtl"]) .alert-banner {
      border-left: 1px solid ${C.g200};
      border-right: 3.5px solid;
    }
  `]
})
export class AlertBannerComponent {
  @Input() type: 'info' | 'warning' | 'error' | 'success' = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() actionLabel = '';
  @Input() dismissible = false;

  @Output() action = new EventEmitter<void>();
  @Output() dismissed = new EventEmitter<void>();

  visible = true;

  private colorMap: Record<string, { iconBg: string; border: string; stroke: string }> = {
    info:    { iconBg: C.blue50,  border: C.blue500,  stroke: C.blue500 },
    warning: { iconBg: C.amber50, border: C.amber500, stroke: C.amber500 },
    error:   { iconBg: C.red50,   border: C.red500,   stroke: C.red500 },
    success: { iconBg: C.greenLt, border: C.green,    stroke: C.green },
  };

  get iconBg() { return this.colorMap[this.type]?.iconBg ?? C.blue50; }
  get borderColor() { return this.colorMap[this.type]?.border ?? C.blue500; }
  get iconStroke() { return this.colorMap[this.type]?.stroke ?? C.blue500; }

  dismiss() {
    this.visible = false;
    this.dismissed.emit();
  }
}
