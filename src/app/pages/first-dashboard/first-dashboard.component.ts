import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavComponent } from '../../shared/components/nav/nav.component';



@Component({
  selector: 'app-first-dashboard',
  standalone: true,
  imports: [NavComponent],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        
        
        <div class="text-center" style="padding: 60px 0;">
          <h1 style="font-size: 22px; font-weight: 900; color: #101828; margin-bottom: 8px;">Complete Your Application</h1>
          <p style="font-size: 14px; color: #667085;">This screen is ready for implementation.</p>
        </div>
      </div>
    </div>`,
  styles: [`
    :host { display: block; }
  `]
})
export class FirstDashboardComponent {
  constructor(private router: Router) {}
  go(path: string) { this.router.navigateByUrl(path); }
}
