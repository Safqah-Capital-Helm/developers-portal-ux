import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../theme';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `
    <div class="input-wrapper" [style.margin-bottom.px]="16">
      <label *ngIf="label" class="input-label">{{ label }}</label>
      <div class="input-container" [class.has-error]="error">
        <span *ngIf="prefix" class="input-prefix">{{ prefix }}</span>
        <input
          *ngIf="type !== 'textarea'"
          class="input-field"
          [class.has-suffix]="suffix"
          [class.has-prefix]="prefix"
          [class.field-error]="error"
          [placeholder]="placeholder"
          [ngModel]="value"
          (ngModelChange)="onValueChange($event)"
          [attr.inputmode]="inputmode || null"
          [attr.maxlength]="maxlength || null"
          [attr.type]="type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'text'"
          (input)="onInput($event)"
        />
        <textarea
          *ngIf="type === 'textarea'"
          class="input-field textarea-field"
          [class.field-error]="error"
          [placeholder]="placeholder"
          [ngModel]="value"
          (ngModelChange)="onValueChange($event)"
          rows="3"
        ></textarea>
        <span *ngIf="suffix && type !== 'textarea'" class="input-suffix">{{ suffix }}</span>
      </div>
      <p *ngIf="error" class="input-error-text">{{ error }}</p>
      <p *ngIf="helper && !error" class="input-helper">{{ helper }}</p>
    </div>
  `,
  styles: [`
    .input-wrapper {
      margin-bottom: 16px;
    }

    .input-label {
      font-size: 13px;
      font-weight: 700;
      color: #344054;
      display: block;
      margin-bottom: 6px;
    }

    .input-container {
      position: relative;
      display: flex;
    }

    .input-prefix {
      display: flex; align-items: center; justify-content: center;
      padding: 0 14px;
      background: ${C.g50};
      border: 1.5px solid #e2e5e9;
      border-right: none;
      border-radius: 10px 0 0 10px;
      font-size: 13px; color: ${C.g400}; font-weight: 700;
      font-family: 'IBM Plex Mono', monospace;
      white-space: nowrap;
    }

    .input-container.has-error .input-prefix {
      border-color: ${C.red500};
    }

    .input-field {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid #e2e5e9;
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      background: #fff;
      color: #101828;
      box-sizing: border-box;
      font-family: inherit;
      transition: border-color 0.15s;
    }

    .input-field:focus {
      border-color: ${C.green};
      box-shadow: 0 0 0 3px rgba(0,175,61,0.08);
    }

    .input-field.has-prefix {
      border-radius: 0 10px 10px 0;
    }

    .input-field.field-error {
      border-color: ${C.red500};
    }

    .input-field.field-error:focus {
      border-color: ${C.red500};
      box-shadow: 0 0 0 3px rgba(240,68,56,0.08);
    }

    .textarea-field {
      resize: vertical;
      min-height: 80px;
      line-height: 1.5;
    }

    .input-field.has-suffix {
      padding-right: 56px;
    }

    .input-suffix {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 13px;
      color: #98a2b3;
      font-weight: 600;
    }

    .input-helper {
      font-size: 11px;
      color: #98a2b3;
      margin-top: 4px;
    }

    .input-error-text {
      font-size: 11px;
      color: ${C.red500};
      margin-top: 4px;
      font-weight: 600;
    }

    /* RTL */
    :host-context([dir="rtl"]) .input-field.has-suffix {
      padding-right: 14px;
      padding-left: 56px;
    }

    :host-context([dir="rtl"]) .input-suffix {
      right: auto;
      left: 14px;
    }

    :host-context([dir="rtl"]) .input-prefix {
      border-right: 1.5px solid #e2e5e9;
      border-left: none;
      border-radius: 0 10px 10px 0;
    }

    :host-context([dir="rtl"]) .input-container.has-error .input-prefix {
      border-right-color: ${C.red500};
    }

    :host-context([dir="rtl"]) .input-field.has-prefix {
      border-radius: 10px 0 0 10px;
    }
  `],
})
export class InputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() suffix: string = '';
  @Input() helper: string = '';
  @Input() error: string = '';
  @Input() value: string = '';
  @Input() inputmode: string = '';
  @Input() maxlength: number = 0;
  @Input() type: string = 'text';
  @Input() prefix: string = '';
  @Input() mask: 'digits' | 'phone' | '' = '';
  @Output() valueChange = new EventEmitter<string>();

  onValueChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  onInput(event: Event): void {
    if (!this.mask) return;
    const input = event.target as HTMLInputElement;
    if (this.mask === 'digits') {
      const cleaned = input.value.replace(/[^\d]/g, '');
      if (cleaned !== input.value) {
        input.value = cleaned;
        this.value = cleaned;
        this.valueChange.emit(cleaned);
      }
    } else if (this.mask === 'phone') {
      const cleaned = input.value.replace(/[^\d+]/g, '');
      if (cleaned !== input.value) {
        input.value = cleaned;
        this.value = cleaned;
        this.valueChange.emit(cleaned);
      }
    }
  }
}
