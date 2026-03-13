import { Component, Input } from '@angular/core';
import { C } from '../../theme';

@Component({
  selector: 'app-review-grid',
  standalone: true,
  template: `
    <div class="review-section">
      @if (title) {
        <div class="review-title">{{ title }}</div>
      }
      <div class="review-grid">
        @for (item of items; track item.label) {
          <div class="review-item">
            <div class="review-label">{{ item.label }}</div>
            <div class="review-value">{{ item.value }}</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .review-section {
      border-top: 1px solid ${C.g100};
      padding: 16px 0 8px;
    }
    .review-title {
      font-size: 11px; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.5px; color: ${C.g400}; margin-bottom: 12px;
    }
    .review-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    }
    .review-item {
      padding: 10px 0; border-bottom: 1px solid ${C.g100};
    }
    .review-item:nth-child(even) { padding-left: 16px; }
    .review-item:nth-child(odd) { padding-right: 16px; }
    .review-label {
      font-size: 11px; font-weight: 600; color: ${C.g400}; margin-bottom: 3px;
    }
    .review-value {
      font-size: 14px; font-weight: 700; color: ${C.g800};
    }
    @media (max-width: 480px) {
      .review-grid { grid-template-columns: 1fr; }
      .review-item:nth-child(even) { padding-left: 0; }
      .review-item:nth-child(odd) { padding-right: 0; }
    }

    :host-context([dir="rtl"]) .review-item:nth-child(even) { padding-left: 0; padding-right: 16px; }
    :host-context([dir="rtl"]) .review-item:nth-child(odd) { padding-right: 0; padding-left: 16px; }

    @media (max-width: 480px) {
      :host-context([dir="rtl"]) .review-item:nth-child(even) { padding-right: 0; }
      :host-context([dir="rtl"]) .review-item:nth-child(odd) { padding-left: 0; }
    }
  `]
})
export class ReviewGridComponent {
  @Input() title = '';
  @Input() items: Array<{ label: string; value: string }> = [];
}
