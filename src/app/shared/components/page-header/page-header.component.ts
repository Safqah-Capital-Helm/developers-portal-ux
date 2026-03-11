import { Component, Input } from '@angular/core';
import { C } from '../../theme';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <h1 class="page-title">{{ title }}
        @if (count !== undefined) {
          <span class="count">{{ count }}</span>
        }
      </h1>
      @if (subtitle) {
        <p class="page-subtitle">{{ subtitle }}</p>
      }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    .page-title {
      font-size: 22px; font-weight: 900; color: ${C.g900}; margin: 0 0 4px;
      display: flex; align-items: center; gap: 10px;
    }
    .count {
      font-size: 13px; font-weight: 700; color: ${C.g400};
      background: ${C.g100}; padding: 2px 10px; border-radius: 20px;
    }
    .page-subtitle {
      font-size: 14px; color: ${C.g500}; margin: 0;
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() count?: number;
}
