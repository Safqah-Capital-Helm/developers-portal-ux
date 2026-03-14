import { Component, Input } from '@angular/core';
import { C, BadgeColor, borderColorForStatus } from '../../theme';

@Component({
  selector: 'app-list-card',
  standalone: true,
  template: `
    <div class="list-card" [class.clickable]="clickable"
         [style.border-left-color]="accentColor"
         [style.border-right-color]="accentColor">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .list-card {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
      background: #fff; border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g300};
      border-radius: 14px; padding: 14px 16px;
      margin-bottom: 8px; transition: box-shadow 0.2s;
    }
    .list-card:not(.clickable) { cursor: default; }
    .list-card.clickable { cursor: pointer; }
    .list-card.clickable:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.07);
    }

    :host-context([dir="rtl"]) .list-card {
      border-left: 1px solid ${C.g200};
      border-right: 3.5px solid ${C.g300};
    }
  `]
})
export class ListCardComponent {
  @Input() statusColor: BadgeColor | string = 'gray';
  @Input() clickable = true;

  get accentColor(): string {
    return borderColorForStatus(this.statusColor);
  }
}
