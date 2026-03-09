import { Component } from '@angular/core';
import { Router } from '@angular/router';




@Component({
  selector: 'app-absher',
  standalone: true,
  imports: [],
  template: `
    <div class="page">
      
      <div class="container">
        
        
        <div class="text-center" style="padding: 60px 0;">
          <h1 style="font-size: 22px; font-weight: 900; color: #101828; margin-bottom: 8px;">Verify Identity</h1>
          <p style="font-size: 14px; color: #667085;">This screen is ready for implementation.</p>
        </div>
      </div>
    </div>`,
  styles: [`
    :host { display: block; }
  `]
})
export class AbsherComponent {
  constructor(private router: Router) {}
  go(path: string) { this.router.navigateByUrl(path); }
}
