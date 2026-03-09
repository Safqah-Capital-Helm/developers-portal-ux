import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { BackLinkComponent } from '../../shared/components/back-link/back-link.component';


@Component({
  selector: 'app-offer-result',
  standalone: true,
  imports: [NavComponent, BackLinkComponent],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard" label="Back to Dashboard"></app-back-link>
        
        <div class="text-center" style="padding: 60px 0;">
          <h1 style="font-size: 22px; font-weight: 900; color: #101828; margin-bottom: 8px;">Term-sheet Result</h1>
          <p style="font-size: 14px; color: #667085;">This screen is ready for implementation.</p>
        </div>
      </div>
    </div>`,
  styles: [`
    :host { display: block; }
  `]
})
export class OfferResultComponent {
  constructor(private router: Router) {}
  go(path: string) { this.router.navigateByUrl(path); }
}
