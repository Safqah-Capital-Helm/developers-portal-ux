import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgStyle, NgIf } from '@angular/common';
import { C } from '../../theme';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [NgStyle, NgIf],
  template: `<button [disabled]="disabled || loading" (click)="!disabled && !loading && clicked.emit()" [ngStyle]="btnStyles">
    <svg *ngIf="loading" class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-opacity="0.3"/>
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <ng-content></ng-content>
  </button>`,
  styles: [`
    button { font-family: inherit; line-height: 1; transition: all 0.2s; }
    button:focus-visible { outline: 2px solid #00af3d; outline-offset: 2px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner { animation: spin 0.7s linear infinite; }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerOutline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() full = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<void>();

  get btnStyles() {
    const isDisabled = this.disabled || this.loading;
    const base: any = {
      borderRadius: '12px', fontWeight: 700, border: 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      width: this.full ? '100%' : 'auto',
      opacity: this.loading ? 0.7 : 1,
    };
    const sizes: any = { sm: { padding: '9px 16px', fontSize: '13px' }, md: { padding: '12px 24px', fontSize: '14px' }, lg: { padding: '15px 32px', fontSize: '15px' } };
    const variants: any = {
      primary: { background: isDisabled ? C.g300 : C.green, color: '#fff', boxShadow: isDisabled ? 'none' : '0 4px 12px rgba(0,161,90,0.2)' },
      secondary: { background: C.white, color: C.g700, border: '1.5px solid ' + C.g200 },
      ghost: { background: 'transparent', color: C.g600 },
      danger: { background: C.red500, color: '#fff' },
      dangerOutline: { background: C.white, color: C.red500, border: '1.5px solid ' + C.red500 },
    };
    return { ...base, ...sizes[this.size], ...variants[this.variant] };
  }
}
