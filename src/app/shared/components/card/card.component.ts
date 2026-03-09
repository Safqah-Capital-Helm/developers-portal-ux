import { Component, Input } from '@angular/core';
import { C } from '../../theme';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `<div [style.padding.px]="padding" class="card"><ng-content></ng-content></div>`,
  styles: [`
    .card {
      background: #fff; border-radius: 16px;
      border: 1px solid #e2e5e9;
    }
  `]
})
export class CardComponent {
  @Input() padding = 24;
}
