import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { C } from '../../theme';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LogoComponent, TranslatePipe],
  template: `
    <!-- Mobile backdrop -->
    <div class="sidebar-backdrop" *ngIf="mobileOpen" (click)="closeMobile()"></div>

    <aside class="sidebar" [class.mobile-open]="mobileOpen">
      <div class="sidebar-top">
        <app-logo [size]="28"></app-logo>
        <button class="close-btn" (click)="closeMobile()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          <span>{{ 'nav.dashboard' | t }}</span>
        </a>
        <a routerLink="/dashboard/companies" routerLinkActive="active" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
            <line x1="9" y1="9" x2="9" y2="9.01"/><line x1="9" y1="13" x2="9" y2="13.01"/><line x1="9" y1="17" x2="9" y2="17.01"/>
          </svg>
          <span>{{ 'nav.companies' | t }}</span>
        </a>
        <a routerLink="/dashboard/projects" routerLinkActive="active" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3h7l2 2h9v16H3z"/>
          </svg>
          <span>{{ 'nav.projects' | t }}</span>
        </a>
        <a routerLink="/dashboard/applications" routerLinkActive="active" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span>{{ 'nav.applications' | t }}</span>
        </a>
      </nav>

      <div class="sidebar-bottom">
        <a routerLink="/dashboard/teams" routerLinkActive="active" class="support-link" style="text-decoration: none;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span>{{ 'nav.team' | t }}</span>
        </a>
        <a routerLink="/application/1/activity" class="support-link" style="text-decoration: none;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{{ 'nav.activity_log' | t }}</span>
        </a>
        <a routerLink="/support" class="support-link" style="text-decoration: none;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>{{ 'nav.help_support' | t }}</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      background: #fff;
      border-right: 1px solid ${C.g200};
      display: flex;
      flex-direction: column;
      z-index: 40;
      padding: 20px 0;
    }

    .sidebar-top {
      padding: 0 20px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 0 12px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      color: ${C.g500};
      text-decoration: none;
      transition: all 0.15s;
      cursor: pointer;
    }

    .nav-item:hover {
      background: ${C.g50};
      color: ${C.g700};
    }

    .nav-item.active {
      background: ${C.greenLt};
      color: ${C.green};
      font-weight: 700;
    }

    .sidebar-bottom {
      padding: 16px 12px;
      border-top: 1px solid ${C.g100};
      margin-top: auto;
    }

    .support-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      color: ${C.g400};
      cursor: pointer;
      transition: all 0.15s;
    }

    .support-link:hover {
      background: ${C.g50};
      color: ${C.g600};
    }

    .close-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: ${C.g100};
      border-radius: 8px;
      cursor: pointer;
      color: ${C.g500};
    }

    .sidebar-backdrop {
      display: none;
    }

    @media (max-width: 900px) {
      .sidebar {
        display: none;
      }

      .sidebar.mobile-open {
        display: flex;
        position: fixed;
        width: 260px;
        z-index: 999;
        box-shadow: 4px 0 24px rgba(0,0,0,0.12);
      }

      .close-btn {
        display: flex;
      }

      .sidebar-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.4);
        z-index: 998;
      }
    }

    :host-context([dir="rtl"]) .sidebar {
      left: auto;
      right: 0;
      border-right: none;
      border-left: 1px solid ${C.g200};
    }

    :host-context([dir="rtl"]) .sidebar.mobile-open {
      left: auto;
      right: 0;
      box-shadow: -4px 0 24px rgba(0,0,0,0.12);
    }
  `]
})
export class SidebarComponent {
  mobileOpen = false;

  openMobile() {
    this.mobileOpen = true;
  }

  closeMobile() {
    this.mobileOpen = false;
  }
}
