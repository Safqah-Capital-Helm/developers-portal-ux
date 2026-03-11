import { Component, Input } from '@angular/core';
import { C } from '../../theme';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" [attr.stroke]="iconColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      <span>{{ message }}</span>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex; align-items: center; gap: 10px;
      padding: 20px; color: ${C.g400};
      font-size: 13px; font-weight: 600;
    }
  `]
})
export class EmptyStateComponent {
  @Input() message = 'No items yet';
  @Input() iconColor = C.g300;
}
