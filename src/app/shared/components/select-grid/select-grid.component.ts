import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { C } from '../../theme';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  desc?: string;
}

@Component({
  selector: 'app-select-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid" [style.grid-template-columns]="'repeat(' + columns + ', 1fr)'">
      @for (opt of options; track opt.value) {
        <div class="option" [class.selected]="opt.value === selected" (click)="select(opt.value)">
          @if (opt.icon) {
            <div class="option-icon" [innerHTML]="safe(opt.icon)"></div>
          }
          <div class="option-label">{{ opt.label }}</div>
          @if (opt.desc) {
            <div class="option-desc">{{ opt.desc }}</div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      gap: 12px;
    }
    .option {
      border: 2px solid ${C.g200};
      background: ${C.white};
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .option:hover {
      border-color: ${C.g300};
    }
    .option.selected {
      border-color: ${C.green};
      background: ${C.greenLt};
    }
    .option-icon {
      width: 32px;
      height: 32px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .option-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g800};
    }
    .option.selected .option-label {
      color: ${C.green};
    }
    .option-desc {
      font-size: 11px;
      color: ${C.g400};
      line-height: 1.4;
      margin-top: 4px;
    }
  `]
})
export class SelectGridComponent {
  @Input() options: SelectOption[] = [];
  @Input() selected = '';
  @Input() columns = 3;
  @Output() selectedChange = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer) {}

  select(value: string) {
    this.selected = value;
    this.selectedChange.emit(value);
  }

  safe(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
