import { Component, Input } from '@angular/core';
import { C, BadgeColor, BADGE_STYLES } from '../../theme';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <div class="avatar" [style.width.px]="dim" [style.height.px]="dim"
         [style.fontSize.px]="fontSize" [style.background]="bg" [style.color]="fg">
      {{ initials }}
    </div>
  `,
  styles: [`
    .avatar {
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; flex-shrink: 0; text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `]
})
export class AvatarComponent {
  @Input() initials = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: BadgeColor = 'green';

  get dim(): number {
    return { sm: 28, md: 34, lg: 40, xl: 64 }[this.size];
  }
  get fontSize(): number {
    return { sm: 10, md: 13, lg: 15, xl: 22 }[this.size];
  }
  get bg(): string {
    return BADGE_STYLES[this.color]?.bg || C.greenLt;
  }
  get fg(): string {
    return BADGE_STYLES[this.color]?.c || C.green;
  }
}
