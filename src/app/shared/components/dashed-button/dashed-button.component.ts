import { Component, Input, Output, EventEmitter } from '@angular/core';
import { C } from '../../theme';

@Component({
  selector: 'app-dashed-btn',
  standalone: true,
  template: `
    <button class="dashed-btn" [class.full]="fullWidth" (click)="clicked.emit()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      {{ label }}
    </button>
  `,
  styles: [`
    .dashed-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      border: 2px dashed ${C.g300}; border-radius: 14px;
      background: none; padding: 16px; cursor: pointer;
      font-family: inherit; font-size: 13px; font-weight: 700;
      color: ${C.g500}; transition: all 0.2s;
    }
    .dashed-btn:hover {
      border-color: ${C.green}; background: ${C.greenLt}; color: ${C.green};
    }
    .dashed-btn.full { width: 100%; }
  `]
})
export class DashedButtonComponent {
  @Input() label = 'Add New';
  @Input() fullWidth = false;
  @Output() clicked = new EventEmitter<void>();
}
