import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgStyle } from '@angular/common';
import { C } from '../../theme';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [NgStyle],
  template: `<button [disabled]="disabled" (click)="!disabled && clicked.emit()" [ngStyle]="btnStyles"><ng-content></ng-content></button>`,
  styles: [`button { font-family: inherit; line-height: 1; transition: all 0.2s; }`]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerOutline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() full = false;
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();

  get btnStyles() {
    const base: any = {
      borderRadius: '12px', fontWeight: 700, border: 'none',
      cursor: this.disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      width: this.full ? '100%' : 'auto',
    };
    const sizes: any = { sm: { padding: '9px 16px', fontSize: '13px' }, md: { padding: '12px 24px', fontSize: '14px' }, lg: { padding: '15px 32px', fontSize: '15px' } };
    const variants: any = {
      primary: { background: this.disabled ? C.g300 : C.green, color: '#fff', boxShadow: this.disabled ? 'none' : '0 4px 12px rgba(0,161,90,0.2)' },
      secondary: { background: C.white, color: C.g700, border: '1.5px solid ' + C.g200 },
      ghost: { background: 'transparent', color: C.g600 },
      danger: { background: C.red500, color: '#fff' },
      dangerOutline: { background: C.white, color: C.red500, border: '1.5px solid ' + C.red500 },
    };
    return { ...base, ...sizes[this.size], ...variants[this.variant] };
  }
}
