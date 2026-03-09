import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell" [class.fading]="fading">
      <router-outlet></router-outlet>
    </div>
    <div class="proto-nav">
      <div class="proto-nav-inner">
        <span class="proto-nav-label">Proto</span>
        @for (item of navItems; track item.path) {
          <button class="proto-btn" [class.active]="currentPath === item.path"
                  (click)="goTo(item.path)">
            {{ item.label }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .app-shell { transition: opacity 0.25s; padding-bottom: 50px; }
    .app-shell.fading { opacity: 0; }
  `]
})
export class AppComponent {
  fading = false;
  currentPath = '/';

  navItems = [
    { path: '/', label: 'Landing' },
    { path: '/not-eligible', label: 'Not Dev' },
    { path: '/verify', label: 'Absher' },
    { path: '/onboarding/project', label: 'Project Onboard' },
    { path: '/onboarding/financing', label: 'Financing Onboard' },
    { path: '/onboarding/complete', label: 'First Dashboard' },
    { path: '/submit-success', label: 'Submit Success' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/project/new', label: 'Add Project' },
    { path: '/company/new', label: 'Add Company' },
    { path: '/verify/owner/demo', label: 'Owner Verify' },
    { path: '/application/1/status', label: 'App Status' },
    { path: '/application/1/term-sheet', label: 'Term-sheet' },
    { path: '/application/1/accepted', label: 'Accepted' },
    { path: '/application/1/declined', label: 'Declined' },
    { path: '/profile', label: 'Profile' },
    { path: '/support', label: 'Support' },
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.currentPath = e.urlAfterRedirects.replace(/^#/, '') || '/';
      window.scrollTo(0, 0);
    });
  }

  goTo(path: string) {
    this.fading = true;
    setTimeout(() => {
      this.router.navigateByUrl(path);
      this.fading = false;
    }, 200);
  }
}
