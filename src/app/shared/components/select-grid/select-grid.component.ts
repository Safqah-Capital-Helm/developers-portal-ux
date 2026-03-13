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
    <div class="grid"
         [style.grid-template-columns]="'repeat(' + columns + ', 1fr)'"
         role="radiogroup"
         (keydown)="onGridKeydown($event)">
      @for (opt of options; track opt.value; let i = $index) {
        <div class="option"
             [class.selected]="opt.value === selected"
             role="radio"
             [attr.aria-checked]="opt.value === selected"
             [attr.tabindex]="opt.value === selected || (!selected && i === 0) ? 0 : -1"
             (click)="select(opt.value)"
             (keydown.enter)="select(opt.value)"
             (keydown.space)="onSpace($event, opt.value)">
          @if (opt.icon) {
            <div class="option-icon" [innerHTML]="safe(opt.icon)" aria-hidden="true"></div>
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
      outline: none;
    }
    .option:focus-visible {
      box-shadow: 0 0 0 2px ${C.green};
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

    @media (max-width: 480px) {
      :host ::ng-deep .grid, .grid { grid-template-columns: repeat(2, 1fr) !important; }
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

  onSpace(event: Event, value: string) {
    event.preventDefault(); // Prevent page scroll
    this.select(value);
  }

  onGridKeydown(event: KeyboardEvent) {
    const currentIndex = this.options.findIndex(o => o.value === this.selected) ?? 0;
    let nextIndex = -1;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = currentIndex < this.options.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : this.options.length - 1;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + this.columns < this.options.length
          ? currentIndex + this.columns
          : currentIndex;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - this.columns >= 0
          ? currentIndex - this.columns
          : currentIndex;
        break;
      default:
        return; // Don't prevent default for other keys
    }

    event.preventDefault();
    if (nextIndex >= 0 && nextIndex < this.options.length) {
      this.select(this.options[nextIndex].value);
      // Focus the newly selected option
      const target = event.currentTarget as HTMLElement;
      const optionElements = target.querySelectorAll('[role="radio"]');
      if (optionElements[nextIndex]) {
        (optionElements[nextIndex] as HTMLElement).focus();
      }
    }
  }

  safe(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
