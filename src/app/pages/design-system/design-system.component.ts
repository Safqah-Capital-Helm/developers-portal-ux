import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C, BADGE_STYLES, BadgeColor } from '../../shared/theme';
import {
  LogoComponent,
  ButtonComponent,
  BadgeComponent,
  CardComponent,
  InputComponent,
  AvatarComponent,
  StatCardComponent,
  PageHeaderComponent,
  SectionCardComponent,
  ListCardComponent,
  DashedButtonComponent,
  ReviewGridComponent,
  EmptyStateComponent,
  ProgressStepsComponent,
  BackLinkComponent,
  ModalComponent,
} from '../../shared';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LogoComponent,
    ButtonComponent,
    BadgeComponent,
    CardComponent,
    InputComponent,
    AvatarComponent,
    StatCardComponent,
    PageHeaderComponent,
    SectionCardComponent,
    ListCardComponent,
    DashedButtonComponent,
    ReviewGridComponent,
    EmptyStateComponent,
    ProgressStepsComponent,
    BackLinkComponent,
    ModalComponent,
  ],
  template: `
    <div class="ds-page">
      <!-- Sticky Header -->
      <header class="ds-header">
        <div class="ds-header-inner">
          <app-logo [size]="28"></app-logo>
          <div class="ds-header-title">
            <span class="ds-title">Design System</span>
            <span class="ds-version">v1.0</span>
          </div>
        </div>
      </header>

      <div class="ds-body">
        <!-- Tab bar -->
        <nav class="ds-tabs">
          <button *ngFor="let tab of tabs; let i = index"
                  class="ds-tab"
                  [class.active]="activeTab === i"
                  (click)="activeTab = i">
            {{ tab }}
          </button>
        </nav>

        <div class="ds-content">

          <!-- ===== 0: COLORS ===== -->
          <div *ngIf="activeTab === 0" class="tab-panel">
            <h2 class="panel-title">Colors</h2>
            <p class="panel-desc">Official Safqah brand palette and semantic colors used across the platform.</p>

            <!-- Brand -->
            <h3 class="group-title">Brand</h3>
            <div class="swatch-row">
              <div class="swatch-card">
                <div class="swatch" [style.background]="C.green"></div>
                <div class="swatch-info"><span class="swatch-name">Green</span><span class="swatch-hex">{{ C.green }}</span></div>
              </div>
              <div class="swatch-card">
                <div class="swatch" [style.background]="C.greenDk"></div>
                <div class="swatch-info"><span class="swatch-name">Green Dark</span><span class="swatch-hex">{{ C.greenDk }}</span></div>
              </div>
              <div class="swatch-card">
                <div class="swatch" [style.background]="C.greenLt" style="border: 1px solid #e2e5e9"></div>
                <div class="swatch-info"><span class="swatch-name">Green Light</span><span class="swatch-hex">{{ C.greenLt }}</span></div>
              </div>
              <div class="swatch-card">
                <div class="swatch" [style.background]="C.purple"></div>
                <div class="swatch-info"><span class="swatch-name">Purple</span><span class="swatch-hex">{{ C.purple }}</span></div>
              </div>
              <div class="swatch-card">
                <div class="swatch" [style.background]="C.purpleLt" style="border: 1px solid #e2e5e9"></div>
                <div class="swatch-info"><span class="swatch-name">Purple Light</span><span class="swatch-hex">{{ C.purpleLt }}</span></div>
              </div>
              <div class="swatch-card">
                <div class="swatch" [style.background]="C.orange"></div>
                <div class="swatch-info"><span class="swatch-name">Orange</span><span class="swatch-hex">{{ C.orange }}</span></div>
              </div>
              <div class="swatch-card">
                <div class="swatch" [style.background]="C.orangeLt" style="border: 1px solid #e2e5e9"></div>
                <div class="swatch-info"><span class="swatch-name">Orange Light</span><span class="swatch-hex">{{ C.orangeLt }}</span></div>
              </div>
            </div>

            <!-- Neutrals -->
            <h3 class="group-title">Neutrals</h3>
            <div class="swatch-row">
              <div *ngFor="let n of neutralSwatches" class="swatch-card">
                <div class="swatch" [style.background]="n.hex" [style.border]="n.border ? '1px solid #e2e5e9' : 'none'"></div>
                <div class="swatch-info"><span class="swatch-name">{{ n.name }}</span><span class="swatch-hex">{{ n.hex }}</span></div>
              </div>
            </div>

            <!-- Semantic -->
            <h3 class="group-title">Semantic</h3>
            <div class="swatch-row">
              <div class="swatch-card">
                <div class="swatch" [style.background]="C.amber500"></div>
                <div class="swatch-info"><span class="swatch-name">Amber 500</span><span class="swatch-hex">{{ C.amber500 }}</span></div>
              </div>
              <div class="swatch-card">
                <div class="swatch" [style.background]="C.red500"></div>
                <div class="swatch-info"><span class="swatch-name">Red 500</span><span class="swatch-hex">{{ C.red500 }}</span></div>
              </div>
              <div class="swatch-card">
                <div class="swatch" [style.background]="C.blue500"></div>
                <div class="swatch-info"><span class="swatch-name">Blue 500</span><span class="swatch-hex">{{ C.blue500 }}</span></div>
              </div>
            </div>
          </div>

          <!-- ===== 1: BUTTONS ===== -->
          <div *ngIf="activeTab === 1" class="tab-panel">
            <h2 class="panel-title">Buttons</h2>
            <p class="panel-desc">Interactive button variants and sizes for actions and CTAs.</p>

            <h3 class="group-title">Variants</h3>
            <div class="showcase-row">
              <div class="showcase-item" *ngFor="let v of buttonVariants">
                <app-btn [variant]="v" (clicked)="0">{{ v | titlecase }}</app-btn>
                <code class="usage">variant="{{ v }}"</code>
              </div>
            </div>

            <h3 class="group-title">Sizes</h3>
            <div class="showcase-row">
              <div class="showcase-item" *ngFor="let s of buttonSizes">
                <app-btn variant="primary" [size]="s" (clicked)="0">{{ s | uppercase }}</app-btn>
                <code class="usage">size="{{ s }}"</code>
              </div>
            </div>

            <h3 class="group-title">States</h3>
            <div class="showcase-row">
              <div class="showcase-item">
                <app-btn variant="primary" [disabled]="true" (clicked)="0">Disabled</app-btn>
                <code class="usage">[disabled]="true"</code>
              </div>
              <div class="showcase-item">
                <app-btn variant="primary" [full]="true" (clicked)="0">Full Width</app-btn>
                <code class="usage">[full]="true"</code>
              </div>
            </div>

            <h3 class="group-title">Dashed Button</h3>
            <div class="showcase-row">
              <div class="showcase-item" style="flex: 1">
                <app-dashed-btn label="Add New Item" [fullWidth]="true" (clicked)="0"></app-dashed-btn>
                <code class="usage">&lt;app-dashed-btn label="Add New Item" [fullWidth]="true"&gt;</code>
              </div>
            </div>
          </div>

          <!-- ===== 2: CARDS ===== -->
          <div *ngIf="activeTab === 2" class="tab-panel">
            <h2 class="panel-title">Cards</h2>
            <p class="panel-desc">Container components for grouping and displaying content.</p>

            <h3 class="group-title">Card</h3>
            <app-card [padding]="24">
              <div style="font-size: 13px; color: #667085">
                Basic card container with 16px border-radius and configurable padding.
                <br/><code class="usage">&lt;app-card [padding]="24"&gt;...&lt;/app-card&gt;</code>
              </div>
            </app-card>

            <h3 class="group-title" style="margin-top: 24px;">List Card</h3>
            <p class="group-desc">Clickable cards with status-colored border-left accent.</p>
            <app-list-card statusColor="green" [clickable]="true">
              <div style="font-size: 13px; font-weight: 600; color: #344054">Green status — Term-sheet Ready</div>
            </app-list-card>
            <app-list-card statusColor="amber" [clickable]="true">
              <div style="font-size: 13px; font-weight: 600; color: #344054">Amber status — In Review</div>
            </app-list-card>
            <app-list-card statusColor="blue" [clickable]="true">
              <div style="font-size: 13px; font-weight: 600; color: #344054">Blue status — Pending Signing</div>
            </app-list-card>
            <app-list-card statusColor="red" [clickable]="false">
              <div style="font-size: 13px; font-weight: 600; color: #344054">Red status — Cancelled</div>
            </app-list-card>

            <h3 class="group-title" style="margin-top: 24px;">Stat Card</h3>
            <div class="stat-grid">
              <app-stat-card
                label="Active Projects"
                [value]="7"
                [icon]="statIcon1"
                [iconBg]="C.greenLt">
              </app-stat-card>
              <app-stat-card
                label="Applications"
                [value]="5"
                [icon]="statIcon2"
                [iconBg]="C.blue50">
              </app-stat-card>
              <app-stat-card
                label="Team Members"
                [value]="4"
                [icon]="statIcon3"
                [iconBg]="C.purpleLt">
              </app-stat-card>
            </div>

            <h3 class="group-title" style="margin-top: 24px;">Section Card</h3>
            <app-section-card title="Recent Activity" [count]="3">
              <div style="font-size: 13px; color: #667085; padding: 12px 0">
                Content is projected via &lt;ng-content&gt;. Includes title and optional count badge.
              </div>
            </app-section-card>
          </div>

          <!-- ===== 3: BADGES ===== -->
          <div *ngIf="activeTab === 3" class="tab-panel">
            <h2 class="panel-title">Badges</h2>
            <p class="panel-desc">Status indicators with dot + label, using semantic color coding.</p>

            <h3 class="group-title">Colors</h3>
            <div class="showcase-row">
              <div class="showcase-item" *ngFor="let c of badgeColors">
                <app-badge [color]="c">{{ c | titlecase }}</app-badge>
                <code class="usage">color="{{ c }}"</code>
              </div>
            </div>

            <h3 class="group-title">Usage Examples</h3>
            <div class="showcase-row">
              <div class="showcase-item">
                <app-badge color="green">Term-sheet Ready</app-badge>
              </div>
              <div class="showcase-item">
                <app-badge color="amber">In Review</app-badge>
              </div>
              <div class="showcase-item">
                <app-badge color="blue">Pending Signing</app-badge>
              </div>
              <div class="showcase-item">
                <app-badge color="red">Cancelled</app-badge>
              </div>
              <div class="showcase-item">
                <app-badge color="gray">Draft</app-badge>
              </div>
            </div>
          </div>

          <!-- ===== 4: FORMS ===== -->
          <div *ngIf="activeTab === 4" class="tab-panel">
            <h2 class="panel-title">Forms</h2>
            <p class="panel-desc">Input components for collecting user data.</p>

            <h3 class="group-title">Input</h3>
            <div style="max-width: 400px;">
              <app-input
                label="Project Name"
                placeholder="e.g. Khobar Mixed-Use Tower"
                [(value)]="demoInput">
              </app-input>
              <app-input
                label="Financing Amount"
                placeholder="e.g. 30,000,000"
                suffix="SAR"
                helper="Total financing amount requested"
                [(value)]="demoAmount">
              </app-input>
            </div>
            <code class="usage">&lt;app-input label="..." placeholder="..." suffix="SAR" helper="..."&gt;</code>
          </div>

          <!-- ===== 5: AVATAR ===== -->
          <div *ngIf="activeTab === 5" class="tab-panel">
            <h2 class="panel-title">Avatar</h2>
            <p class="panel-desc">User avatar circles with initials, available in 4 sizes and 5 color variants.</p>

            <h3 class="group-title">Sizes</h3>
            <div class="showcase-row" style="align-items: flex-end">
              <div class="showcase-item">
                <app-avatar initials="A" size="sm" color="green"></app-avatar>
                <code class="usage">sm (28px)</code>
              </div>
              <div class="showcase-item">
                <app-avatar initials="B" size="md" color="green"></app-avatar>
                <code class="usage">md (34px)</code>
              </div>
              <div class="showcase-item">
                <app-avatar initials="C" size="lg" color="green"></app-avatar>
                <code class="usage">lg (40px)</code>
              </div>
              <div class="showcase-item">
                <app-avatar initials="D" size="xl" color="green"></app-avatar>
                <code class="usage">xl (64px)</code>
              </div>
            </div>

            <h3 class="group-title">Colors</h3>
            <div class="showcase-row">
              <div class="showcase-item" *ngFor="let c of badgeColors">
                <app-avatar [initials]="c.charAt(0).toUpperCase()" size="lg" [color]="c"></app-avatar>
                <code class="usage">{{ c }}</code>
              </div>
            </div>
          </div>

          <!-- ===== 6: DATA DISPLAY ===== -->
          <div *ngIf="activeTab === 6" class="tab-panel">
            <h2 class="panel-title">Data Display</h2>
            <p class="panel-desc">Components for presenting structured data and states.</p>

            <h3 class="group-title">Review Grid</h3>
            <app-card [padding]="24">
              <app-review-grid
                title="Project Details"
                [items]="demoReviewItems">
              </app-review-grid>
            </app-card>

            <h3 class="group-title" style="margin-top: 24px">Empty State</h3>
            <app-card [padding]="0">
              <app-empty-state message="No applications submitted yet"></app-empty-state>
            </app-card>

            <h3 class="group-title" style="margin-top: 24px">Progress Steps</h3>
            <app-card [padding]="24">
              <app-progress-steps
                [steps]="demoSteps"
                [current]="demoStepCurrent"
                (stepClick)="demoStepCurrent = $event">
              </app-progress-steps>
              <div class="showcase-row" style="margin-top: 8px">
                <app-btn variant="ghost" size="sm" [disabled]="demoStepCurrent === 0" (clicked)="demoStepCurrent = demoStepCurrent - 1">&#8592; Back</app-btn>
                <app-btn variant="primary" size="sm" [disabled]="demoStepCurrent === 3" (clicked)="demoStepCurrent = demoStepCurrent + 1">Next &rarr;</app-btn>
              </div>
            </app-card>
          </div>

          <!-- ===== 7: NAVIGATION ===== -->
          <div *ngIf="activeTab === 7" class="tab-panel">
            <h2 class="panel-title">Navigation</h2>
            <p class="panel-desc">Components for page headers and navigation links.</p>

            <h3 class="group-title">Page Header</h3>
            <app-card [padding]="24">
              <app-page-header title="Projects" [count]="7"></app-page-header>
              <app-page-header title="Dashboard" subtitle="Overview of your financing activities"></app-page-header>
            </app-card>

            <h3 class="group-title" style="margin-top: 24px">Back Link</h3>
            <app-card [padding]="24">
              <app-back-link to="/design-system" label="Back to Dashboard"></app-back-link>
            </app-card>

            <h3 class="group-title" style="margin-top: 24px">Modal</h3>
            <app-btn variant="secondary" (clicked)="showDemoModal = true">Open Modal</app-btn>
            <app-modal *ngIf="showDemoModal" title="Sample Modal" (closed)="showDemoModal = false">
              <div style="font-size: 13px; color: #667085; line-height: 1.6">
                This is a modal dialog component. It supports a title, close button, and projected content via &lt;ng-content&gt;.
              </div>
              <div style="margin-top: 20px; display: flex; gap: 8px">
                <app-btn variant="primary" size="sm" (clicked)="showDemoModal = false">Confirm</app-btn>
                <app-btn variant="secondary" size="sm" (clicked)="showDemoModal = false">Cancel</app-btn>
              </div>
            </app-modal>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .ds-page {
      min-height: 100vh;
      background: ${C.bg};
    }

    /* Header */
    .ds-header {
      position: sticky; top: 0; z-index: 100;
      background: #fff; border-bottom: 1px solid ${C.g200};
      padding: 14px 32px;
    }
    .ds-header-inner {
      max-width: 960px; margin: 0 auto;
      display: flex; align-items: center; gap: 14px;
    }
    .ds-header-title {
      display: flex; align-items: center; gap: 10px;
    }
    .ds-title {
      font-size: 17px; font-weight: 800; color: ${C.g900};
    }
    .ds-version {
      font-size: 11px; font-weight: 700; color: ${C.g400};
      background: ${C.g100}; padding: 2px 8px; border-radius: 6px;
    }

    /* Body */
    .ds-body {
      max-width: 960px; margin: 0 auto;
      padding: 24px 32px 80px;
    }

    /* Tabs */
    .ds-tabs {
      display: flex; gap: 4px; flex-wrap: wrap;
      margin-bottom: 32px;
      border-bottom: 1px solid ${C.g200};
      padding-bottom: 0;
    }
    .ds-tab {
      background: none; border: none; border-bottom: 2px solid transparent;
      padding: 10px 16px; cursor: pointer;
      font-family: inherit; font-size: 13px; font-weight: 600;
      color: ${C.g500}; transition: all 0.15s;
    }
    .ds-tab:hover { color: ${C.g700}; }
    .ds-tab.active {
      color: ${C.green}; border-bottom-color: ${C.green}; font-weight: 700;
    }

    /* Panel */
    .tab-panel {
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .panel-title {
      font-size: 24px; font-weight: 900; color: ${C.g900};
      margin: 0 0 6px;
    }
    .panel-desc {
      font-size: 14px; color: ${C.g500}; margin: 0 0 28px;
      line-height: 1.5;
    }

    .group-title {
      font-size: 14px; font-weight: 800; color: ${C.g700};
      margin: 20px 0 12px; text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .group-desc {
      font-size: 13px; color: ${C.g500}; margin: -8px 0 12px;
    }

    /* Color swatches */
    .swatch-row {
      display: flex; flex-wrap: wrap; gap: 12px;
      margin-bottom: 8px;
    }
    .swatch-card {
      width: 120px;
    }
    .swatch {
      width: 100%; height: 64px;
      border-radius: 10px; margin-bottom: 6px;
    }
    .swatch-info {
      display: flex; flex-direction: column; gap: 1px;
    }
    .swatch-name {
      font-size: 12px; font-weight: 700; color: ${C.g700};
    }
    .swatch-hex {
      font-size: 11px; font-weight: 600; color: ${C.g400};
      font-family: 'SF Mono', 'Fira Code', monospace;
    }

    /* Showcase rows */
    .showcase-row {
      display: flex; flex-wrap: wrap; gap: 16px;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .showcase-item {
      display: flex; flex-direction: column; align-items: flex-start;
      gap: 6px;
    }

    code.usage {
      font-size: 11px; font-weight: 600; color: ${C.g500};
      background: ${C.g100}; padding: 2px 8px; border-radius: 6px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      display: inline-block;
    }

    /* Stat grid */
    .stat-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }

    @media (max-width: 768px) {
      .ds-body { padding: 16px 16px 60px; }
      .ds-header { padding: 14px 16px; }
      .swatch-card { width: 90px; }
      .swatch { height: 48px; }
      .stat-grid { grid-template-columns: 1fr; }
      .ds-tabs { gap: 0; }
      .ds-tab { padding: 8px 10px; font-size: 12px; }
    }
  `]
})
export class DesignSystemComponent {
  C = C;
  activeTab = 0;
  tabs = ['Colors', 'Buttons', 'Cards', 'Badges', 'Forms', 'Avatar', 'Data Display', 'Navigation'];

  // Color swatches
  neutralSwatches = [
    { name: 'g50', hex: C.g50, border: true },
    { name: 'g100', hex: C.g100, border: true },
    { name: 'g200', hex: C.g200, border: false },
    { name: 'g300', hex: C.g300, border: false },
    { name: 'g400', hex: C.g400, border: false },
    { name: 'g500', hex: C.g500, border: false },
    { name: 'g600', hex: C.g600, border: false },
    { name: 'g700', hex: C.g700, border: false },
    { name: 'g800', hex: C.g800, border: false },
    { name: 'g900', hex: C.g900, border: false },
  ];

  // Button demos
  buttonVariants: Array<'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerOutline'> = ['primary', 'secondary', 'ghost', 'danger', 'dangerOutline'];
  buttonSizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

  // Badge colors
  badgeColors: BadgeColor[] = ['green', 'amber', 'gray', 'blue', 'red'];

  // Form demos
  demoInput = '';
  demoAmount = '';

  // Stat card icons
  statIcon1 = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2"><path d="M3 3h7l2 2h9v16H3z"/></svg>`;
  statIcon2 = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
  statIcon3 = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.purple}" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

  // Review grid demo
  demoReviewItems = [
    { label: 'Project Name', value: 'Khobar Mixed-Use Tower' },
    { label: 'Project Type', value: 'Mixed Use' },
    { label: 'Stage', value: 'Planning' },
    { label: 'Location', value: 'Khobar' },
    { label: 'Expected Units', value: '120' },
    { label: 'Building Area', value: '15,000 m²' },
  ];

  // Progress steps demo
  demoSteps = ['Company', 'Project Details', 'Financials', 'Review'];
  demoStepCurrent = 2;

  // Modal demo
  showDemoModal = false;
}
