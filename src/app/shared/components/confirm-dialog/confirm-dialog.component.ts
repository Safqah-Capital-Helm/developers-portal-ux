import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { C } from '../../theme';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (visible) {
      <div class="backdrop" (click)="cancelled.emit()">
        <div class="card" (click)="$event.stopPropagation()">
          <div class="icon-wrap" [class.danger]="confirmVariant === 'danger'">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3 class="title">{{ title }}</h3>
          @if (message) {
            <p class="message">{{ message }}</p>
          }
          <div class="actions">
            <app-btn variant="ghost" (clicked)="cancelled.emit()">{{ cancelLabel }}</app-btn>
            <app-btn [variant]="confirmVariant" (clicked)="confirmed.emit()">{{ confirmLabel }}</app-btn>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      max-width: 400px;
      width: 90%;
      background: ${C.white};
      border-radius: 18px;
      padding: 28px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${C.amber100};
      color: ${C.amber500};
      margin-bottom: 16px;
    }
    .icon-wrap.danger {
      background: ${C.red50};
      color: ${C.red500};
    }
    .title {
      font-size: 18px;
      font-weight: 800;
      color: ${C.g900};
      text-align: center;
      margin: 0 0 8px;
    }
    .message {
      font-size: 14px;
      color: ${C.g500};
      text-align: center;
      line-height: 1.5;
      margin: 0;
    }
    .actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      width: 100%;
      justify-content: center;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() title = 'Are you sure?';
  @Input() message = '';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() confirmVariant: 'danger' | 'primary' = 'danger';
  @Input() visible = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
