import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { C } from '../../shared/theme';
import { NavComponent, SidebarComponent } from '../../shared';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, NavComponent, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <div class="main-area">
        <app-nav [showLogo]="false"></app-nav>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .layout {
      display: flex;
      min-height: 100vh;
    }

    .main-area {
      flex: 1;
      margin-left: 240px;
      display: flex;
      flex-direction: column;
    }

    .content {
      flex: 1;
      background: ${C.bg};
    }

    @media (max-width: 900px) {
      .main-area {
        margin-left: 0;
      }
    }
  `]
})
export class DashboardLayoutComponent {}
