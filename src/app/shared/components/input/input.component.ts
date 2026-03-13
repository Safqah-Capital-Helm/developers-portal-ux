import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `
    <div class="input-wrapper" [style.margin-bottom.px]="16">
      <label *ngIf="label" class="input-label">{{ label }}</label>
      <div class="input-container">
        <input
          class="input-field"
          [class.has-suffix]="suffix"
          [placeholder]="placeholder"
          [ngModel]="value"
          (ngModelChange)="onValueChange($event)"
        />
        <span *ngIf="suffix" class="input-suffix">{{ suffix }}</span>
      </div>
      <p *ngIf="helper" class="input-helper">{{ helper }}</p>
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

    :host-context([dir="rtl"]) .input-field.has-suffix {
      padding-right: 14px;
      padding-left: 56px;
    }

    :host-context([dir="rtl"]) .input-suffix {
      right: auto;
      left: 14px;
    }
  `],
})
export class InputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() suffix: string = '';
  @Input() helper: string = '';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onValueChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}
