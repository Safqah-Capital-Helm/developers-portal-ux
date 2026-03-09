import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { BackLinkComponent } from '../../shared/components/back-link/back-link.component';


@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [NavComponent, BackLinkComponent],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/application/1/status" label="Back to Application Status"></app-back-link>
        
        <div class="text-center" style="padding: 60px 0;">
          <h1 style="font-size: 22px; font-weight: 900; color: #101828; margin-bottom: 8px;">Financing Term-sheet</h1>
          <p style="font-size: 14px; color: #667085;">This screen is ready for implementation.</p>
        </div>
      </div>
    </div>`,
  styles: [`
    :host { display: block; }
  `]
})
export class OfferComponent {
  constructor(private router: Router) {}
  go(path: string) { this.router.navigateByUrl(path); }
}
