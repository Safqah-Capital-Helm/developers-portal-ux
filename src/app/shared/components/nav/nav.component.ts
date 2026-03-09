import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [LogoComponent],
  template: `
    <nav class="top-nav">
      <app-logo [size]="28"></app-logo>
      <div class="avatar-area">
        <span class="name">Ahmed</span>
        <div class="avatar">A</div>
      </div>
    </nav>
  `,
  styles: [`
    .top-nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 32px; border-bottom: 1px solid #e2e5e9;
      background: #fff; position: sticky; top: 0; z-index: 50;
    }
    .avatar-area { display: flex; align-items: center; gap: 8px; cursor: pointer; }
    .name { font-size: 13px; color: #667085; }
    .avatar {
      width: 32px; height: 32px; border-radius: 50%; background: #e6f7ee;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: #00a15a;
    }
  `]
})
export class NavComponent {
  constructor(private router: Router) {}
}
