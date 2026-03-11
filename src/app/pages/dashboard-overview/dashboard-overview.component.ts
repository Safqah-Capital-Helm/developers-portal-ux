import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { C } from '../../shared/theme';
import { ButtonComponent, BadgeComponent, InputComponent } from '../../shared';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent, InputComponent],
  template: `
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1 class="header-title">Welcome back, Ahmed</h1>
        <p class="header-sub">Manage your companies, projects, and team from one place.</p>
      </div>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon" [style.background]="C.blue50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
            </svg>
          </div>
          <div class="stat-label">Companies</div>
          <div class="stat-value">2</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" [style.background]="C.greenLt">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3h7l2 2h9v16H3z"/>
            </svg>
          </div>
          <div class="stat-label">Active Projects</div>
          <div class="stat-value">7</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" [style.background]="C.amber50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div class="stat-label">Team Members</div>
          <div class="stat-value">4</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" [style.background]="C.g100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-label">Pending Reviews</div>
          <div class="stat-value">2</div>
        </div>
      </div>

      <!-- Recent Applications -->
      <div class="section">
        <div class="section-header">
          <div class="section-icon" [style.background]="'#eff8ff'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <span class="section-title">Recent Applications</span>
          <span class="view-all" (click)="go('/dashboard/applications')">View all &rarr;</span>
        </div>

        <div *ngFor="let app of recentApplications" class="recent-row" [style.border-left-color]="borderColor(app.sc)" (click)="onAppClick(app)">
          <div class="recent-info">
            <span class="recent-name">{{ app.projectName }}</span>
            <span class="recent-sub">{{ app.company }} &middot; {{ app.product }}</span>
          </div>
          <div class="recent-right">
            <span class="recent-amount">{{ app.amount }}</span>
            <app-badge [color]="$any(app.sc)">{{ app.status }}</app-badge>
          </div>
        </div>
      </div>

      <!-- Onboarding Steps (first-time users) -->
      <div *ngIf="showOnboarding" class="section">
        <div class="onboarding-card">
          <div class="onboarding-header">
            <div class="onboarding-title">Get started with Safqah</div>
            <div class="onboarding-desc">Complete these steps to submit your first financing application.</div>
          </div>
          <div class="onboarding-steps">
            <div *ngFor="let s of onboardingSteps; let i = index" class="step-card" [class.done]="s.done">
              <div class="step-number" [style.background]="s.done ? C.green : C.g200" [style.color]="s.done ? '#fff' : C.g500">
                <svg *ngIf="s.done" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span *ngIf="!s.done">{{ i + 1 }}</span>
              </div>
              <div class="step-info">
                <div class="step-name">{{ s.title }}</div>
                <div class="step-desc">{{ s.desc }}</div>
              </div>
              <app-btn *ngIf="!s.done" variant="primary" size="sm" (clicked)="go(s.route)">{{ s.action }}</app-btn>
              <app-badge *ngIf="s.done" color="green">Done</app-badge>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">Quick Actions</span>
        </div>
        <div class="actions-row">
          <div class="action-card" (click)="go('/application/new')">
            <div class="action-icon" [style.background]="C.greenLt">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div class="action-title">New Application</div>
            <div class="action-sub">Submit a financing request</div>
          </div>
          <div class="action-card" (click)="go('/project/new')">
            <div class="action-icon" [style.background]="C.blue50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3h7l2 2h9v16H3z"/>
              </svg>
            </div>
            <div class="action-title">Add Project</div>
            <div class="action-sub">Create a new project</div>
          </div>
          <div class="action-card" (click)="go('/dashboard/teams')">
            <div class="action-icon" [style.background]="C.amber50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <div class="action-title">Invite Member</div>
            <div class="action-sub">Add someone to your team</div>
          </div>
        </div>
      </div>

      <!-- Referral card -->
      <div *ngIf="showReferral" class="referral-card">
        <div class="referral-top">
          <div class="referral-icon" [style.background]="C.greenLt">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <div class="referral-text">
            <div class="referral-title">How did you find Safqah?</div>
            <div class="referral-desc">Help us improve by letting us know how you heard about us.</div>
          </div>
          <button class="referral-dismiss" (click)="showReferral = false">&times;</button>
        </div>
        <div class="referral-chips">
          <div *ngFor="let r of referralOptions" class="referral-chip"
            [style.background]="referralSource === r ? C.greenLt : '#fff'"
            [style.borderColor]="referralSource === r ? C.green : C.g200"
            [style.color]="referralSource === r ? C.green : C.g600"
            (click)="referralSource = r">
            {{ r }}
          </div>
        </div>
        <div *ngIf="referralSource === 'A friend' || referralSource === 'Other'" style="margin-top: 12px;">
          <app-input [label]="referralSource === 'A friend' ? 'Friend\\'s name' : 'Please specify'" placeholder="Enter details" [value]="referralExtra" (valueChange)="referralExtra = $event"></app-input>
        </div>
        <div *ngIf="referralSource" class="referral-save">
          <app-btn variant="primary" size="sm" (clicked)="showReferral = false">Submit</app-btn>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 28px 40px 60px;
    }

    .header { margin-bottom: 24px; }
    .header-title {
      font-size: 24px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 4px;
    }
    .header-sub {
      font-size: 14px;
      color: ${C.g500};
      margin: 0;
    }

    /* Stats */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 14px;
      padding: 18px 20px;
    }

    .stat-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 700;
      color: ${C.g500};
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 4px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 900;
      color: ${C.g900};
    }

    /* Sections */
    .section { margin-bottom: 28px; }
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
    .view-all {
      margin-left: auto;
      font-size: 13px;
      font-weight: 700;
      color: ${C.green};
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .view-all:hover { opacity: 0.7; }

    /* Recent applications */
    .recent-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g300};
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
    .recent-row:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.07);
    }
    .recent-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .recent-name {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g900};
    }
    .recent-sub {
      font-size: 12px;
      color: ${C.g500};
    }
    .recent-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .recent-amount {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g600};
    }

    /* Onboarding steps */
    .onboarding-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 16px;
      padding: 24px;
    }
    .onboarding-header { margin-bottom: 20px; }
    .onboarding-title {
      font-size: 16px;
      font-weight: 800;
      color: ${C.g900};
      margin-bottom: 4px;
    }
    .onboarding-desc {
      font-size: 13px;
      color: ${C.g500};
      line-height: 1.5;
    }
    .onboarding-steps {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .step-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      border: 1.5px solid ${C.g200};
      border-radius: 12px;
      transition: all 0.15s ease;
    }
    .step-card.done {
      background: ${C.g50};
      border-color: ${C.g100};
    }
    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }
    .step-info { flex: 1; min-width: 0; }
    .step-name {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g800};
      margin-bottom: 2px;
    }
    .step-card.done .step-name { color: ${C.g500}; text-decoration: line-through; }
    .step-desc {
      font-size: 12px;
      color: ${C.g400};
      line-height: 1.4;
    }

    /* Quick actions */
    .actions-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    .action-card {
      border: 2px dashed ${C.g300};
      border-radius: 14px;
      padding: 20px;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
    }
    .action-card:hover {
      border-color: ${C.green};
      background: ${C.greenLt};
    }
    .action-card:hover .action-title { color: ${C.green}; }
    .action-icon {
      width: 40px; height: 40px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px;
    }
    .action-title {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g700};
      margin-bottom: 2px;
      transition: color 0.15s;
    }
    .action-sub {
      font-size: 12px;
      color: ${C.g400};
      font-weight: 500;
    }

    /* Referral card */
    .referral-card {
      background: #fff;
      border: 1px solid ${C.g200};
      border-radius: 16px;
      padding: 20px 24px;
    }
    .referral-top {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 16px;
    }
    .referral-icon {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .referral-text { flex: 1; }
    .referral-title {
      font-size: 15px; font-weight: 800; color: ${C.g900}; margin-bottom: 2px;
    }
    .referral-desc { font-size: 13px; color: ${C.g500}; }
    .referral-dismiss {
      background: none; border: none; font-size: 20px;
      color: ${C.g400}; cursor: pointer; padding: 0 4px; line-height: 1;
    }
    .referral-dismiss:hover { color: ${C.g600}; }
    .referral-chips {
      display: flex; flex-wrap: wrap; gap: 8px;
    }
    .referral-chip {
      padding: 8px 16px; border-radius: 20px;
      border: 1.5px solid ${C.g200}; font-size: 13px;
      font-weight: 700; cursor: pointer; transition: all 0.15s ease;
    }
    .referral-chip:hover { border-color: ${C.g300}; }
    .referral-save {
      margin-top: 16px; display: flex; justify-content: flex-end;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .container { padding: 20px 16px 40px; }
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .actions-row { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardOverviewComponent {
  C = C;

  recentApplications = [
    { projectName: "Al Noor Residential", company: "Al Omran Real Estate", amount: "~21M SAR", product: "Development", status: "Term-sheet Ready", sc: "green", route: "/application/1/status" },
    { projectName: "Riyadh Commercial Plaza", company: "Al Omran Real Estate", amount: "~45M SAR", product: "Construction", status: "In Review", sc: "amber", route: "/application/2/status" },
    { projectName: "Tabuk Residential Complex", company: "Al Omran Real Estate", amount: "~8M SAR", product: "Development", status: "Feedback Requested", sc: "amber", route: "/application/3/status" },
  ];

  showOnboarding = false;
  onboardingSteps = [
    { title: 'Add a project', desc: 'Create your first development project.', action: 'Create Project', route: '/project/new', done: true },
    { title: 'Verify company details', desc: 'Complete your company verification.', action: 'Verify', route: '/dashboard/companies', done: true },
    { title: 'Submit financing application', desc: 'Apply for financing on your project.', action: 'Apply Now', route: '/application/new', done: false },
  ];

  showReferral = true;
  referralOptions = ['X (Twitter)', 'Instagram', 'Snapchat', 'LinkedIn', 'Website', 'A friend', 'Other'];
  referralSource = '';
  referralExtra = '';

  constructor(private router: Router) {}

  borderColor(sc: string): string {
    const map: Record<string, string> = {
      green: C.green, amber: C.amber500, blue: C.blue500, red: C.red500, gray: C.g300
    };
    return map[sc] || C.g300;
  }

  go(path: string) {
    this.router.navigateByUrl(path);
  }

  onAppClick(app: any) {
    if (app.sc === 'red') return;
    this.go(app.route);
  }
}
