import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { NavComponent, ButtonComponent, BadgeComponent } from '../../shared';

@Component({
  selector: 'app-welcome-dashboard',
  standalone: true,
  imports: [CommonModule, NavComponent, ButtonComponent, BadgeComponent],
  template: `
    <div class="page">
      <app-nav></app-nav>

      <div class="container">

        <!-- Welcome Header -->
        <div class="header">
          <div class="header-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Account setup complete
          </div>
          <h1 class="header-title">Welcome to Safqah, Ahmed!</h1>
          <p class="header-sub">Your account is ready. Start by creating your first project to begin the financing process.</p>
        </div>

        <!-- 2-column grid -->
        <div class="grid">

          <!-- ============ LEFT COLUMN ============ -->
          <div class="left-col">

            <!-- Company Section -->
            <div class="section">
              <div class="section-header">
                <div class="section-icon" [style.background]="C.blue50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
                    <line x1="9" y1="9" x2="9" y2="9.01"/><line x1="9" y1="13" x2="9" y2="13.01"/><line x1="9" y1="17" x2="9" y2="17.01"/>
                  </svg>
                </div>
                <span class="section-title">Company</span>
                <span class="section-count">1</span>
              </div>

              <div class="company-card" [style.border-left-color]="C.green">
                <div class="company-top">
                  <span class="company-name">Al Omran Real Estate Dev Co.</span>
                  <app-badge color="green">Verified</app-badge>
                </div>
                <div class="company-cr">CR: 1551515151516515</div>
                <div class="company-meta">
                  <span class="meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
                    0 projects
                  </span>
                  <span class="meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                    {{ team.length }} members
                  </span>
                </div>
              </div>

              <div class="dashed-btn" (click)="go('/company/new')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Add company</span>
              </div>
            </div>

            <!-- Team Section -->
            <div class="section">
              <div class="section-header">
                <div class="section-icon" [style.background]="C.amber50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <span class="section-title">Team</span>
                <span class="section-count">{{ team.length }}</span>
              </div>

              <div *ngFor="let m of team" class="member-card">
                <div class="member-avatar" [style.background]="m.active ? C.greenLt : C.g100" [style.color]="m.active ? C.green : C.g400">
                  {{ m.name.charAt(0) }}
                </div>
                <div class="member-info">
                  <div class="member-name-row">
                    <span class="member-name">{{ m.name }}</span>
                    <span *ngIf="m.you" class="you-tag">(you)</span>
                  </div>
                  <div class="member-email">{{ m.email }}</div>
                </div>
                <div class="member-right">
                  <app-badge [color]="roleBadgeColor(m.role)">{{ m.role }}</app-badge>
                  <span class="active-dot" [style.background]="m.active ? C.green : C.amber500"></span>
                </div>
              </div>

              <div class="dashed-btn" (click)="go('/dashboard')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Invite member</span>
              </div>
            </div>

            <!-- Support Box -->
            <div class="support-box">
              <div class="support-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div class="support-title">Need help?</div>
              <div class="support-detail">support&#64;safqah.com</div>
              <div class="support-detail">+966 11 234 5678</div>
              <div style="margin-top: 12px;">
                <app-btn variant="secondary" size="sm" (clicked)="go('/support')">Contact Support</app-btn>
              </div>
            </div>
          </div>

          <!-- ============ RIGHT COLUMN ============ -->
          <div class="right-col">

            <!-- Projects Section -->
            <div class="section">
              <div class="section-header">
                <div class="section-icon" [style.background]="C.greenLt">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3h7l2 2h9v16H3z"/>
                  </svg>
                </div>
                <span class="section-title">Projects</span>
                <span class="section-count">0</span>
              </div>

              <!-- Empty state -->
              <div class="empty-state">
                <div class="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g300" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3h7l2 2h9v16H3z"/>
                    <line x1="12" y1="10" x2="12" y2="16"/>
                    <line x1="9" y1="13" x2="15" y2="13"/>
                  </svg>
                </div>
                <h3 class="empty-title">No projects yet</h3>
                <p class="empty-desc">
                  Create your first project to start a financing application.
                  You'll provide project details and financing needs, then our team will review your application.
                </p>
                <app-btn variant="primary" size="lg" (clicked)="go('/project/new')">
                  Create Your First Project &rarr;
                </app-btn>
              </div>

              <!-- How it works -->
              <div class="how-it-works">
                <div class="how-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span class="how-title">How it works</span>
                </div>
                <div class="how-steps">
                  <div class="how-step" *ngFor="let step of howSteps; let i = index">
                    <div class="how-step-num" [style.background]="i === 0 ? C.green : C.g200" [style.color]="i === 0 ? '#fff' : C.g500">{{ i + 1 }}</div>
                    <div class="how-step-content">
                      <div class="how-step-title">{{ step.title }}</div>
                      <div class="how-step-desc">{{ step.desc }}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page { background: ${C.bg}; min-height: 100vh; }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 28px 40px 60px;
    }

    /* Header */
    .header { margin-bottom: 28px; }
    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      color: ${C.green};
      background: ${C.greenLt};
      padding: 5px 12px;
      border-radius: 20px;
      margin-bottom: 12px;
    }
    .header-title {
      font-size: 24px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 6px;
    }
    .header-sub {
      font-size: 14px;
      color: ${C.g500};
      margin: 0;
      max-width: 520px;
      line-height: 1.5;
    }

    /* 2-col grid */
    .grid {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 28px;
      align-items: start;
    }

    /* Section */
    .section { margin-bottom: 24px; }
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .section-icon {
      width: 34px; height: 34px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .section-title {
      font-size: 15px;
      font-weight: 800;
      color: ${C.g900};
    }
    .section-count {
      font-size: 12px;
      font-weight: 700;
      color: ${C.g400};
      background: ${C.g100};
      padding: 2px 8px;
      border-radius: 10px;
    }

    /* Company cards */
    .company-card {
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g300};
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 10px;
    }
    .company-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 4px;
    }
    .company-name {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g900};
      line-height: 1.3;
    }
    .company-cr {
      font-size: 11px;
      color: ${C.g400};
      margin-bottom: 8px;
    }
    .company-meta {
      display: flex;
      gap: 16px;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: ${C.g500};
      font-weight: 600;
    }

    /* Member cards */
    .member-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 8px;
    }
    .member-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 800; flex-shrink: 0;
    }
    .member-info { flex: 1; min-width: 0; }
    .member-name-row { display: flex; align-items: center; gap: 5px; }
    .member-name {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g900};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .you-tag {
      font-size: 10px;
      font-weight: 700;
      color: ${C.green};
      background: ${C.greenLt};
      padding: 1px 6px;
      border-radius: 6px;
      flex-shrink: 0;
    }
    .member-email {
      font-size: 11px;
      color: ${C.g400};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .member-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .active-dot {
      width: 8px; height: 8px; border-radius: 50%;
    }

    /* Dashed add button */
    .dashed-btn {
      border: 2px dashed ${C.g300};
      border-radius: 12px;
      padding: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      color: ${C.g500};
      transition: border-color 0.2s, background 0.2s;
      margin-top: 4px;
    }
    .dashed-btn:hover {
      border-color: ${C.green};
      background: ${C.greenLt};
      color: ${C.green};
    }
    .dashed-btn:hover svg { stroke: ${C.green}; }

    /* Support box */
    .support-box {
      background: ${C.g50};
      border: 1px solid ${C.g200};
      border-radius: 14px;
      padding: 20px;
      text-align: center;
      margin-top: 12px;
    }
    .support-icon {
      margin-bottom: 10px;
      display: flex; justify-content: center;
    }
    .support-title {
      font-size: 14px;
      font-weight: 800;
      color: ${C.g800};
      margin-bottom: 6px;
    }
    .support-detail {
      font-size: 12px;
      color: ${C.g500};
      line-height: 1.6;
    }

    /* ============ EMPTY STATE ============ */
    .empty-state {
      background: ${C.white};
      border: 2px dashed ${C.g200};
      border-radius: 20px;
      padding: 48px 32px;
      text-align: center;
      margin-bottom: 20px;
    }
    .empty-icon {
      margin-bottom: 16px;
      display: flex;
      justify-content: center;
    }
    .empty-title {
      font-size: 18px;
      font-weight: 800;
      color: ${C.g700};
      margin: 0 0 8px;
    }
    .empty-desc {
      font-size: 13px;
      color: ${C.g400};
      line-height: 1.6;
      max-width: 380px;
      margin: 0 auto 24px;
    }

    /* How it works */
    .how-it-works {
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-radius: 16px;
      padding: 20px 22px;
    }
    .how-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .how-title {
      font-size: 14px;
      font-weight: 800;
      color: ${C.g700};
    }
    .how-steps {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .how-step {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .how-step-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .how-step-content { flex: 1; }
    .how-step-title {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g800};
      margin-bottom: 2px;
    }
    .how-step-desc {
      font-size: 12px;
      color: ${C.g400};
      line-height: 1.5;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr;
      }
      .container {
        padding: 20px 16px 40px;
      }
    }
  `]
})
export class WelcomeDashboardComponent {
  C = C;

  team = [
    { name: "Ahmed Al-Salem", email: "ahmed@alomran.com", role: "Admin", active: true, you: true },
    { name: "Sara Al-Rashid", email: "sara@alomran.com", role: "Editor", active: false, you: false },
    { name: "Omar Al-Harbi", email: "omar@alomran.com", role: "Viewer", active: false, you: false },
  ];

  howSteps = [
    { title: 'Create a project', desc: 'Provide project details like type, location, and expected cost.' },
    { title: 'Specify financing needs', desc: 'Tell us about the financing amount and product you need.' },
    { title: 'Upload documents', desc: 'Submit required documents for review.' },
    { title: 'Receive your term sheet', desc: 'Our team reviews your application and issues a term sheet.' },
  ];

  constructor(private router: Router) {}

  roleBadgeColor(role: string): 'green' | 'amber' | 'gray' | 'blue' | 'red' {
    const map: Record<string, 'green' | 'amber' | 'gray' | 'blue' | 'red'> = {
      Admin: 'blue', Editor: 'green', Contributor: 'amber', Viewer: 'gray'
    };
    return map[role] || 'gray';
  }

  go(path: string) {
    this.router.navigateByUrl(path);
  }
}
