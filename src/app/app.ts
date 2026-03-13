import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { I18nService } from './shared/i18n/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell" [class.fading]="fading">
      <router-outlet></router-outlet>
    </div>
    <div class="proto-nav" [class.collapsed]="collapsed">
      <button class="proto-toggle" (click)="collapsed = !collapsed">
        @if (collapsed) {
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"/></svg>
        } @else {
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        }
        <span class="proto-toggle-label">Proto Nav</span>
        @if (collapsed) {
          <span class="proto-toggle-path">{{ currentPath }}</span>
        }
      </button>
      @if (!collapsed) {
        <div class="proto-body">
          @for (group of navGroups; track group.label) {
            <div class="proto-group">
              <span class="proto-group-label">{{ group.label }}</span>
              <div class="proto-group-items">
                @for (item of group.items; track item.path) {
                  <button class="proto-btn" [class.active]="currentPath === item.path"
                          (click)="goTo(item.path)">
                    {{ item.label }}
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .app-shell { transition: opacity 0.25s; padding-bottom: 44px; }
    .app-shell.fading { opacity: 0; }
  `]
})
export class AppComponent implements OnInit {
  fading = false;
  collapsed = true;
  currentPath = '/';

  navGroups = [
    {
      label: 'Onboarding',
      items: [
        { path: '/', label: 'Landing' },
        { path: '/not-eligible', label: 'Not Eligible' },
        { path: '/verify', label: 'Absher Verify' },
        { path: '/sign-in', label: 'Sign In' },
        { path: '/onboarding/company-verify', label: 'Company Verify' },
        { path: '/onboarding/team', label: 'Team Invite' },
        { path: '/onboarding/project', label: 'Project Onboard' },
        { path: '/onboarding/financing', label: 'Financing Onboard' },
        { path: '/invite/accept', label: 'Invite Accept' },
      ]
    },
    {
      label: 'Dashboard',
      items: [
        { path: '/dashboard', label: 'Overview' },
        { path: '/dashboard/companies', label: 'Companies' },
        { path: '/dashboard/company/0', label: 'Company Detail' },
        { path: '/dashboard/projects', label: 'Projects' },
        { path: '/dashboard/project/1', label: 'Project Detail' },
        { path: '/dashboard/applications', label: 'Applications' },
        { path: '/dashboard/teams', label: 'Teams' },
      ]
    },
    {
      label: 'Create',
      items: [
        { path: '/company/new', label: 'New Company' },
        { path: '/project/new', label: 'New Project' },
        { path: '/application/new', label: 'New Application' },
      ]
    },
    {
      label: 'Application Flow',
      items: [
        { path: '/application/1/status', label: 'Status' },
        { path: '/application/1/term-sheet', label: 'Term-sheet' },
        { path: '/application/1/activity', label: 'Activity Log' },
        { path: '/application/1/accepted', label: 'Accepted' },
        { path: '/application/1/declined', label: 'Declined' },
        { path: '/submit-success', label: 'Submit Success' },
      ]
    },
    {
      label: 'Other',
      items: [
        { path: '/profile', label: 'Profile' },
        { path: '/support', label: 'Support' },
        { path: '/verify/owner/demo', label: 'Owner Verify' },
        { path: '/company/0/credentials', label: 'Edit Credentials' },
        { path: '/design-system', label: 'Design System' },
      ]
    },
  ];

  constructor(private router: Router, private i18n: I18nService) {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.currentPath = e.urlAfterRedirects.replace(/^#/, '') || '/';
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() { this.i18n.init(); }

  goTo(path: string) {
    this.fading = true;
    setTimeout(() => {
      this.router.navigateByUrl(path);
      this.fading = false;
    }, 200);
  }
}
