import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-link',
  standalone: true,
  template: `
    <button class="back-link" (click)="navigate()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98a2b3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      {{ label }}
    </button>
  `,
  styles: [`
    .back-link {
      display: inline-flex; align-items: center; gap: 5px;
      background: none; border: none; cursor: pointer;
      font-size: 13px; font-weight: 600; color: #667085;
      padding: 0; margin-bottom: 16px; font-family: inherit;
    }
    .back-link:hover { color: #344054; }

    :host-context([dir="rtl"]) .back-link svg { transform: rotate(180deg); }
  `]
})
export class BackLinkComponent {
  @Input() to = '/dashboard';
  @Input() label = 'Back to Dashboard';
  constructor(private router: Router) {}
  navigate() { this.router.navigate([this.to]); }
}
