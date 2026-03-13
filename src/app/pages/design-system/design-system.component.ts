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
  AlertBannerComponent,
  ResultScreenComponent,
  ConfirmDialogComponent,
  TimelineComponent,
  SelectGridComponent,
  TranslatePipe,
} from '../../shared';
import type { TimelineEvent, SelectOption } from '../../shared';

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
    AlertBannerComponent,
    ResultScreenComponent,
    ConfirmDialogComponent,
    TimelineComponent,
    SelectGridComponent,
    TranslatePipe,
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
              <app-back-link to="/dashboard" [label]="('common.back_to_dashboard' | t)"></app-back-link>
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

          <!-- ===== 8: PROTOTYPING ===== -->
          <div *ngIf="activeTab === 8" class="tab-panel">
            <h2 class="panel-title">Prototyping</h2>
            <p class="panel-desc">Demo controls used across prototype pages to toggle states, advance flows, and simulate actions. All use dashed borders to visually separate them from real UI.</p>

            <h3 class="group-title">Demo Toggle</h3>
            <p class="group-desc">Primary action button for toggling a demo state. Used in status pages, application flows, etc.</p>
            <div class="proto-demo-bar">
              <button class="proto-demo-toggle" (click)="demoToggled = !demoToggled">
                {{ demoToggled ? 'Reset to Initial State' : 'Demo: Skip to Ready' }}
              </button>
            </div>
            <code class="usage">.demo-bar &gt; .demo-toggle — background: g50, border: 1px dashed g300, border-radius: 8px</code>

            <h3 class="group-title" style="margin-top: 28px">Demo Segment</h3>
            <p class="group-desc">Multiple toggle buttons for switching between demo modes. Active state uses darker background.</p>
            <div class="proto-demo-bar">
              <button class="proto-demo-toggle" [class.active]="demoSegment === 'a'" (click)="demoSegment = 'a'">With CR Owners</button>
              <button class="proto-demo-toggle" [class.active]="demoSegment === 'b'" (click)="demoSegment = 'b'">No CR Owners</button>
            </div>
            <code class="usage">.demo-toggle.active — background: g200, color: g700, border-color: g400</code>

            <h3 class="group-title" style="margin-top: 28px">Demo Advance</h3>
            <p class="group-desc">Small inline button for advancing to the next stage in a timeline or flow.</p>
            <div class="proto-demo-bar">
              <button class="proto-demo-advance">Demo &darr;</button>
              <button class="proto-demo-advance">Demo: Reset</button>
              <button class="proto-demo-advance">Demo: Owner View &rarr;</button>
            </div>
            <code class="usage">.demo-advance — border: 1px dashed g300, border-radius: 6px, padding: 4px 10px, font-size: 11px</code>

            <h3 class="group-title" style="margin-top: 28px">Demo Action Pair</h3>
            <p class="group-desc">Success/failure simulation buttons, wrapped in a dashed container. Used for signing flows, API simulations, etc.</p>
            <div class="proto-demo-container">
              <div class="proto-demo-container-label">Demo: Simulate signing result</div>
              <div class="proto-demo-container-row">
                <button class="proto-demo-action proto-success">&#10003; Sign Successfully</button>
                <button class="proto-demo-action proto-fail">&#10007; Signing Failed</button>
              </div>
            </div>
            <code class="usage">.decl-demo — border: 2px dashed g300, border-radius: 12px</code>

            <h3 class="group-title" style="margin-top: 28px">Guidelines</h3>
            <app-card [padding]="24">
              <div class="proto-guidelines">
                <div class="proto-guideline-item">
                  <strong>Always use dashed borders</strong>
                  <span>All demo controls use <code>border: 1px dashed</code> to clearly distinguish them from real UI elements.</span>
                </div>
                <div class="proto-guideline-item">
                  <strong>Gray tones only</strong>
                  <span>Demo buttons use neutral colors (g50 bg, g300 border, g500 text) — never brand green or other semantic colors.</span>
                </div>
                <div class="proto-guideline-item">
                  <strong>Container class: <code>.demo-bar</code></strong>
                  <span>Centered flex container with gap: 8px. Use <code>text-align: center</code> for single-button layouts.</span>
                </div>
                <div class="proto-guideline-item">
                  <strong>Button class: <code>.demo-toggle</code></strong>
                  <span>8px 16px padding, 12px font, 600 weight, 8px border-radius. Add <code>.active</code> for segment selection.</span>
                </div>
                <div class="proto-guideline-item">
                  <strong>Inline class: <code>.demo-advance</code></strong>
                  <span>4px 10px padding, 11px font, 6px border-radius. For small contextual actions inside cards.</span>
                </div>
              </div>
            </app-card>
          </div>

          <!-- ===== 9: ALERTS & FEEDBACK ===== -->
          <div *ngIf="activeTab === 9" class="tab-panel">
            <h2 class="panel-title">Alerts & Feedback</h2>
            <p class="panel-desc">Components for contextual alerts, result screens, and confirmation dialogs.</p>

            <!-- Section: Alert Banner -->
            <div class="ds-section">
              <div class="ds-component-name">Alert Banner</div>
              <div class="ds-desc">Contextual alert messages for notifications, warnings, errors, and success states.</div>
              <div class="ds-grid-col-1">
                <app-alert-banner type="info" title="Information" message="This is an informational message for the user."></app-alert-banner>
                <app-alert-banner type="warning" title="Warning" message="This action requires your attention before proceeding." actionLabel="Take Action"></app-alert-banner>
                <app-alert-banner type="error" title="Error" message="Something went wrong. Please try again or contact support."></app-alert-banner>
                <app-alert-banner type="success" title="Success" message="Your changes have been saved successfully." [dismissible]="true"></app-alert-banner>
              </div>
            </div>

            <!-- Section: Result Screen -->
            <div class="ds-section">
              <div class="ds-component-name">Result Screen</div>
              <div class="ds-desc">Full-screen result states for success, error, warning, and info outcomes.</div>
              <div class="ds-result-grid">
                <div style="background: #f8f9fa; border-radius: 14px; padding: 24px;">
                  <app-result-screen type="success" title="Success!" subtitle="Your application has been submitted.">
                    <app-btn variant="primary" size="sm">Continue</app-btn>
                  </app-result-screen>
                </div>
                <div style="background: #f8f9fa; border-radius: 14px; padding: 24px;">
                  <app-result-screen type="error" title="Declined" subtitle="The term-sheet has been declined.">
                    <app-btn variant="secondary" size="sm">Go Back</app-btn>
                  </app-result-screen>
                </div>
              </div>
            </div>

            <!-- Section: Confirm Dialog -->
            <div class="ds-section">
              <div class="ds-component-name">Confirm Dialog</div>
              <div class="ds-desc">Modal confirmation for destructive or important actions.</div>
              <div class="ds-actions">
                <app-btn variant="danger" size="sm" (clicked)="showConfirmDemo = true">Show Confirm Dialog</app-btn>
              </div>
              <app-confirm-dialog
                title="Delete Project?"
                message="This will permanently remove the project and all associated data. This cannot be undone."
                confirmLabel="Delete"
                confirmVariant="danger"
                [visible]="showConfirmDemo"
                (confirmed)="showConfirmDemo = false"
                (cancelled)="showConfirmDemo = false"
              ></app-confirm-dialog>
            </div>
          </div>

          <!-- ===== 10: TIMELINE ===== -->
          <div *ngIf="activeTab === 10" class="tab-panel">
            <h2 class="panel-title">Timeline</h2>
            <p class="panel-desc">Vertical timeline for displaying chronological events and activity logs.</p>

            <div class="ds-section">
              <div class="ds-component-name">Timeline</div>
              <div class="ds-desc">Vertical timeline for displaying chronological events and activity logs.</div>
              <app-timeline [events]="demoTimelineEvents"></app-timeline>
            </div>
          </div>

          <!-- ===== 11: COMPLEX FORMS ===== -->
          <div *ngIf="activeTab === 11" class="tab-panel">
            <h2 class="panel-title">Complex Forms</h2>
            <p class="panel-desc">Advanced form components for structured data entry and selection.</p>

            <div class="ds-section">
              <div class="ds-component-name">Select Grid</div>
              <div class="ds-desc">Grid of selectable option cards for choosing between categories.</div>
              <app-select-grid [options]="demoSelectOptions" [selected]="demoSelectedOption" [columns]="3" (selectedChange)="demoSelectedOption = $event"></app-select-grid>
            </div>

            <div class="ds-section">
              <div class="ds-component-name">Form Helpers</div>
              <div class="ds-desc">All form inputs should include helper text to guide users.</div>
              <div style="max-width: 400px;">
                <app-input label="Project Name" placeholder="e.g. Khobar Mixed-Use Tower" helper="Choose a descriptive name for your development project." [value]="''" (valueChange)="$event"></app-input>
                <div style="margin-top: 16px;">
                  <app-input label="Financing Amount" placeholder="e.g. 30,000,000" suffix="SAR" helper="Total estimated cost of the project in SAR." [value]="''" (valueChange)="$event"></app-input>
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

    /* Prototyping tab */
    .proto-demo-bar {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-bottom: 12px;
    }

    .proto-demo-toggle {
      background: ${C.g50};
      border: 1px dashed ${C.g300};
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 600;
      color: ${C.g500};
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .proto-demo-toggle:hover { background: ${C.g100}; color: ${C.g700}; }
    .proto-demo-toggle.active { background: ${C.g200}; color: ${C.g700}; border-color: ${C.g400}; }

    .proto-demo-advance {
      background: none;
      border: 1px dashed ${C.g300};
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      color: ${C.g500};
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .proto-demo-advance:hover { background: ${C.g50}; color: ${C.g700}; }

    .proto-demo-container {
      border: 2px dashed ${C.g300};
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      margin-bottom: 12px;
    }

    .proto-demo-container-label {
      font-size: 11px;
      font-weight: 700;
      color: ${C.g400};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .proto-demo-container-row {
      display: flex;
      gap: 10px;
    }

    .proto-demo-action {
      flex: 1;
      padding: 10px 14px;
      border: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.15s;
    }
    .proto-demo-action:hover { opacity: 0.85; }
    .proto-success { background: ${C.green}; }
    .proto-fail { background: ${C.red500}; }

    .proto-guidelines {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .proto-guideline-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .proto-guideline-item strong {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g800};
    }

    .proto-guideline-item span {
      font-size: 13px;
      color: ${C.g500};
      line-height: 1.5;
    }

    .proto-guideline-item code {
      font-size: 11px;
      font-weight: 600;
      color: ${C.g600};
      background: ${C.g100};
      padding: 1px 6px;
      border-radius: 4px;
      font-family: 'SF Mono', 'Fira Code', monospace;
    }

    /* New tab sections */
    .ds-section {
      margin-bottom: 32px;
    }
    .ds-component-name {
      font-size: 16px;
      font-weight: 800;
      color: ${C.g800};
      margin-bottom: 4px;
    }
    .ds-desc {
      font-size: 13px;
      color: ${C.g500};
      margin-bottom: 16px;
      line-height: 1.5;
    }
    .ds-grid-col-1 {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ds-actions {
      margin-bottom: 12px;
    }
    .ds-result-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 768px) {
      .ds-body { padding: 16px 16px 60px; }
      .ds-header { padding: 14px 16px; }
      .swatch-card { width: 90px; }
      .swatch { height: 48px; }
      .stat-grid { grid-template-columns: 1fr; }
      .ds-tabs { gap: 0; }
      .ds-tab { padding: 8px 10px; font-size: 12px; }
      .ds-result-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DesignSystemComponent {
  C = C;
  activeTab = 0;
  tabs = ['Colors', 'Buttons', 'Cards', 'Badges', 'Forms', 'Avatar', 'Data Display', 'Navigation', 'Prototyping', 'Alerts & Feedback', 'Timeline', 'Complex Forms'];

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

  // Prototyping demo
  demoToggled = false;
  demoSegment = 'a';

  // Alerts & Feedback demo
  showConfirmDemo = false;

  // Complex Forms demo
  demoSelectedOption = '';

  // Timeline demo
  demoTimelineEvents: TimelineEvent[] = [
    { date: 'Mar 10, 2026', time: '2:30 PM', title: 'Application Submitted', desc: 'Financing application submitted for review.', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e90fa" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', color: '#eff8ff' },
    { date: 'Mar 10, 2026', time: '3:15 PM', title: 'Under Review', desc: 'Application assigned to credit analyst for review.', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f79009" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>', color: '#fffcf0' },
    { date: 'Mar 11, 2026', time: '10:00 AM', title: 'Documents Requested', desc: 'Additional financial documents required for assessment.', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff825c" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>', color: '#fff2ee' },
    { date: 'Mar 12, 2026', time: '9:00 AM', title: 'Term-sheet Issued', desc: 'Financing term-sheet ready for review and acceptance.', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00af3d" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="16 13 12 17 9 14"/></svg>', color: '#e6f9ed' },
  ];

  // Select Grid demo
  demoSelectOptions: SelectOption[] = [
    { value: 'residential', label: 'Residential', desc: 'Apartments, villas, townhouses', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>' },
    { value: 'commercial', label: 'Commercial', desc: 'Offices, retail, hospitality', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/></svg>' },
    { value: 'mixed', label: 'Mixed Use', desc: 'Combined residential & commercial', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="10" height="16" rx="1"/><rect x="13" y="2" width="10" height="20" rx="1"/></svg>' },
  ];
}
