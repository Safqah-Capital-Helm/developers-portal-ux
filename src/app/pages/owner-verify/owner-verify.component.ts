import { Component } from '@angular/core';
import { Router } from '@angular/router';




@Component({
  selector: 'app-owner-verify',
  standalone: true,
  imports: [],
  template: `
    <div class="page">
      
      <div class="container">
        
        
        <div class="text-center" style="padding: 60px 0;">
          <h1 style="font-size: 22px; font-weight: 900; color: #101828; margin-bottom: 8px;">Owner Verification</h1>
          <p style="font-size: 14px; color: #667085;">This screen is ready for implementation.</p>
        </div>
      </div>
    </div>`,
  styles: [`
    :host { display: block; }
  `]
})
export class OwnerVerifyComponent {
  constructor(private router: Router) {}
  go(path: string) { this.router.navigateByUrl(path); }
}
