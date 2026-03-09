import { Component } from '@angular/core';
import { Router } from '@angular/router';


import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-not-dev',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="page">
      
      <div class="container">
        
        
    <div class="text-center" style="padding: 60px 0;">
      <div style="width:72px;height:72px;border-radius:18px;background:#fef3f2;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f04438" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18z"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path d="M10 6h4m-4 4h4m-4 4h4m-4 4h4"/></svg>
      </div>
      <h1 style="font-size:26px;font-weight:900;color:#101828;margin-bottom:10px;">We couldn't verify your eligibility</h1>
      <p style="font-size:15px;color:#667085;line-height:1.7;max-width:400px;margin:0 auto 28px;">This company does not appear to be a licensed real estate developer.</p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <app-btn variant="secondary" size="lg" (clicked)="go('/')">Try another CR</app-btn>
        <app-btn variant="primary" size="lg" (clicked)="go('/support')">Contact Support</app-btn>
      </div>
    </div>
      </div>
    </div>`,
  styles: [`
    :host { display: block; }
  `]
})
export class NotDevComponent {
  constructor(private router: Router) {}
  go(path: string) { this.router.navigateByUrl(path); }
}
