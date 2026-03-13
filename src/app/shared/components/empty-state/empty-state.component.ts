import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { C } from '../../theme';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="empty-state">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" [attr.stroke]="iconColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      <div class="empty-content">
        <span *ngIf="title" class="empty-title">{{ title }}</span>
        <span class="empty-message">{{ description || message }}</span>
        <app-btn *ngIf="actionLabel" variant="primary" size="sm" (clicked)="onAction()">{{ actionLabel }}</app-btn>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex; align-items: center; gap: 10px;
      padding: 20px; color: ${C.g400};
      font-size: 13px; font-weight: 600;
    }
    .empty-content {
      display: flex; flex-direction: column; gap: 4px;
    }
    .empty-title {
      font-size: 15px; font-weight: 800; color: ${C.g700};
    }
    .empty-message {
      font-size: 13px; font-weight: 600; color: ${C.g400};
    }
  `]
})
export class EmptyStateComponent {
  @Input() message = 'No items yet';
  @Input() iconColor = C.g300;
  @Input() title = '';
  @Input() description = '';
  @Input() actionLabel = '';
  @Input() actionRoute = '';

  constructor(private router: Router) {}

  onAction() {
    if (this.actionRoute) {
      this.router.navigateByUrl(this.actionRoute);
    }
  }
}
