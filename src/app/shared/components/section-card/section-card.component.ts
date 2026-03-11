import { Component, Input } from '@angular/core';
import { C } from '../../theme';

@Component({
  selector: 'app-section-card',
  standalone: true,
  template: `
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">{{ title }}</span>
        @if (count !== undefined) {
          <span class="section-count">{{ count }}</span>
        }
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .section-card { margin-bottom: 24px; }
    .section-header {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 12px;
    }
    .section-title {
      font-size: 15px; font-weight: 800; color: ${C.g900};
    }
    .section-count {
      font-size: 11px; font-weight: 700; color: ${C.g400};
      background: ${C.g100}; padding: 2px 8px; border-radius: 12px;
    }
  `]
})
export class SectionCardComponent {
  @Input() title = '';
  @Input() count?: number;
}
