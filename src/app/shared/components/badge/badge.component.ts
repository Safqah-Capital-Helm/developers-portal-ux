import { Component, Input } from '@angular/core';
import { BadgeColor, BADGE_STYLES } from '../../theme';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="badge" [style.background]="styles.bg" [style.color]="styles.c">
      <span class="dot" [style.background]="styles.c"></span>
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 700; white-space: nowrap;
    }
    .dot { width: 6px; height: 6px; border-radius: 50%; }
  `]
})
export class BadgeComponent {
  @Input() color: BadgeColor = 'green';
  get styles() { return BADGE_STYLES[this.color] || BADGE_STYLES['gray']; }
}
