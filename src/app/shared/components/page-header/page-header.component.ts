import { Component, Input } from '@angular/core';
import { C } from '../../theme';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <div class="page-header-row">
        <h1 class="page-title">{{ title }}
          @if (count !== undefined) {
            <span class="count">{{ count }}</span>
          }
        </h1>
        <div class="page-actions">
          <ng-content></ng-content>
        </div>
      </div>
      @if (subtitle) {
        <p class="page-subtitle">{{ subtitle }}</p>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    .page-header-row {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
    }
    .page-title {
      font-size: 22px; font-weight: 900; color: ${C.g900}; margin: 0;
      display: flex; align-items: center; gap: 10px;
    }
    .page-actions {
      display: flex; align-items: center; gap: 8px; flex-shrink: 0;
    }
    .count {
      font-size: 13px; font-weight: 700; color: ${C.g400};
      background: ${C.g100}; padding: 2px 10px; border-radius: 20px;
    }
    .page-subtitle {
      font-size: 14px; color: ${C.g500}; margin: 4px 0 0;
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() count?: number;
}
