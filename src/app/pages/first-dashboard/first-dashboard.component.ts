import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import {
  NavComponent,
  ButtonComponent,
  CardComponent,
  InputComponent,
  BadgeComponent,
  ModalComponent,
  ProjectFormComponent,
  FinancingFormComponent,
} from '../../shared';

interface Step {
  key: string;
  label: string;
  mandatory: boolean;
  group: string;
  modal: string;
}

interface DocSlot {
  name: string;
  desc: string;
  required: boolean;
  uploaded: boolean;
  fileName: string;
}

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  role: string;
  share: number;
  type: string;
}

@Component({
  selector: 'app-first-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavComponent,
    ButtonComponent,
    CardComponent,
    InputComponent,
    BadgeComponent,
    ModalComponent,
    ProjectFormComponent,
    FinancingFormComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>

      <div class="container">
        <!-- Header -->
        <div class="header-section">
          <h1 class="page-title">Application Checklist</h1>
          <p class="page-subtitle">Complete each step below to submit your financing application for review.</p>
        </div>

        <!-- Circular Progress -->
        <div class="progress-ring-wrap">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="38" fill="none" [attr.stroke]="C.g200" stroke-width="7"/>
            <circle cx="45" cy="45" r="38" fill="none" [attr.stroke]="C.green" stroke-width="7"
              stroke-linecap="round"
              [attr.stroke-dasharray]="circumference"
              [attr.stroke-dashoffset]="dashOffset"
              transform="rotate(-90 45 45)"/>
          </svg>
          <div class="progress-text">
            <span class="pct-num">{{ pct }}</span><span class="pct-sign">%</span>
          </div>
        </div>

        <!-- Step Group: Project -->
        <div class="group-header">
          <div class="group-icon" [style.background]="C.greenLt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span class="group-name">{{ projName || 'Al Noor Residential' }}</span>
        </div>
        <div class="steps-list">
          <ng-container *ngFor="let s of projectSteps; let i = index">
            <div class="step-row"
              [style.background]="done[s.key] ? C.greenLt : stepState(s) === 'next' ? '#fff' : '#fff'"
              [style.borderColor]="done[s.key] ? C.greenMd : stepState(s) === 'next' ? C.green : C.g200"
              (click)="openStep(s)">
              <!-- Circle -->
              <div class="step-circle"
                [style.background]="done[s.key] ? C.green : stepState(s) === 'next' ? '#fff' : C.g100"
                [style.borderColor]="done[s.key] ? C.green : stepState(s) === 'next' ? C.green : C.g300">
                <svg *ngIf="done[s.key]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span *ngIf="!done[s.key] && stepState(s) === 'next'" class="step-num" [style.color]="C.green">{{ stepNumber(s) }}</span>
                <span *ngIf="!done[s.key] && stepState(s) === 'pending'" class="step-num" [style.color]="C.g400">{{ stepNumber(s) }}</span>
              </div>

              <!-- Label -->
              <div class="step-info">
                <span class="step-label" [style.color]="done[s.key] ? C.g700 : stepState(s) === 'next' ? C.g900 : C.g400">{{ s.label }}</span>
                <app-badge *ngIf="!s.mandatory" color="gray" style="margin-left: 8px;">Optional</app-badge>
              </div>

              <!-- Action -->
              <div class="step-action">
                <span *ngIf="done[s.key]" class="edit-link" [style.color]="C.green" (click)="openStep(s); $event.stopPropagation()">Edit</span>
                <app-btn *ngIf="!done[s.key] && stepState(s) === 'next'" variant="primary" size="sm" (clicked)="openStep(s)">Complete &rarr;</app-btn>
              </div>
            </div>
          </ng-container>
        </div>

        <!-- Step Group: Company -->
        <div class="group-header" style="margin-top: 24px;">
          <div class="group-icon" [style.background]="C.blue50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
              <line x1="9" y1="6" x2="9" y2="6.01"/>
              <line x1="15" y1="6" x2="15" y2="6.01"/>
              <line x1="9" y1="10" x2="9" y2="10.01"/>
              <line x1="15" y1="10" x2="15" y2="10.01"/>
              <line x1="9" y1="14" x2="9" y2="14.01"/>
              <line x1="15" y1="14" x2="15" y2="14.01"/>
              <path d="M9 18h6"/>
            </svg>
          </div>
          <span class="group-name">Al Omran Real Estate Dev Co.</span>
        </div>
        <div class="steps-list">
          <ng-container *ngFor="let s of companySteps; let i = index">
            <div class="step-row"
              [style.background]="done[s.key] ? C.greenLt : stepState(s) === 'next' ? '#fff' : '#fff'"
              [style.borderColor]="done[s.key] ? C.greenMd : stepState(s) === 'next' ? C.green : C.g200"
              (click)="openStep(s)">
              <div class="step-circle"
                [style.background]="done[s.key] ? C.green : stepState(s) === 'next' ? '#fff' : C.g100"
                [style.borderColor]="done[s.key] ? C.green : stepState(s) === 'next' ? C.green : C.g300">
                <svg *ngIf="done[s.key]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span *ngIf="!done[s.key] && stepState(s) === 'next'" class="step-num" [style.color]="C.green">{{ stepNumber(s) }}</span>
                <span *ngIf="!done[s.key] && stepState(s) === 'pending'" class="step-num" [style.color]="C.g400">{{ stepNumber(s) }}</span>
              </div>
              <div class="step-info">
                <span class="step-label" [style.color]="done[s.key] ? C.g700 : stepState(s) === 'next' ? C.g900 : C.g400">{{ s.label }}</span>
                <app-badge *ngIf="!s.mandatory" color="gray" style="margin-left: 8px;">Optional</app-badge>
              </div>
              <div class="step-action">
                <span *ngIf="done[s.key]" class="edit-link" [style.color]="C.green" (click)="openStep(s); $event.stopPropagation()">Edit</span>
                <app-btn *ngIf="!done[s.key] && stepState(s) === 'next'" variant="primary" size="sm" (clicked)="openStep(s)">Complete &rarr;</app-btn>
              </div>
            </div>
          </ng-container>
        </div>

        <!-- Submit Section -->
        <div *ngIf="allMandatoryDone" class="submit-section">
          <div class="submit-box">
            <label class="accuracy-label">
              <input type="checkbox" [(ngModel)]="accuracy" class="accuracy-cb"/>
              <span>I confirm all information provided is accurate and complete.</span>
            </label>
            <div class="submit-btn-row">
              <app-btn variant="primary" size="lg" [full]="true" [disabled]="!accuracy" (clicked)="go('/submit-success')">
                Submit Application &rarr;
              </app-btn>
            </div>
          </div>
        </div>

        <!-- Help -->
        <div class="help-section">
          <app-card [padding]="20">
            <div class="help-inner">
              <div>
                <div class="help-title">Need help?</div>
                <div class="help-desc">Our team is ready to assist you with your application.</div>
              </div>
              <app-btn variant="secondary" size="sm" (clicked)="go('/support')">Contact support</app-btn>
            </div>
          </app-card>
        </div>
      </div>
    </div>

    <!-- ==================== MODALS ==================== -->

    <!-- Company Details Modal -->
    <app-modal *ngIf="modal === 'company'" title="Review company details" [wide]="true" (closed)="closeModal('company')">
      <p class="modal-desc">Please review your company information and authorize the credit bureau check.</p>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Legal Name (EN)</div>
          <div class="info-value">Al Omran Real Estate Dev Co.</div>
        </div>
        <div class="info-item">
          <div class="info-label">Legal Name (AR)</div>
          <div class="info-value" style="direction: rtl;">\u0634\u0631\u0643\u0629 \u0627\u0644\u0639\u0645\u0631\u0627\u0646 \u0644\u0644\u062a\u0637\u0648\u064a\u0631 \u0627\u0644\u0639\u0642\u0627\u0631\u064a</div>
        </div>
        <div class="info-item">
          <div class="info-label">CR Number</div>
          <div class="info-value">1010234567</div>
        </div>
        <div class="info-item">
          <div class="info-label">Legal Form</div>
          <div class="info-value">LLC</div>
        </div>
        <div class="info-item">
          <div class="info-label">Status</div>
          <div class="info-value">Active</div>
        </div>
        <div class="info-item">
          <div class="info-label">Capital</div>
          <div class="info-value">SAR 10,000,000</div>
        </div>
        <div class="info-item">
          <div class="info-label">Company Size</div>
          <div class="info-value">50-100 employees</div>
        </div>
        <div class="info-item">
          <div class="info-label">Type</div>
          <div class="info-value">Real Estate Developer</div>
        </div>
        <div class="info-item">
          <div class="info-label">Unified No.</div>
          <div class="info-value">7001234567</div>
        </div>
      </div>
      <app-input label="Website (optional)" placeholder="https://www.alomran.com" [value]="companyWebsite" (valueChange)="companyWebsite = $event"></app-input>
      <div class="cb-section">
        <label class="cb-label">
          <input type="checkbox" [(ngModel)]="creditAuth" class="accuracy-cb"/>
          <span>I authorize Safqah to perform a credit bureau check on Al Omran Real Estate Dev Co.</span>
        </label>
      </div>
      <div class="modal-actions">
        <app-btn variant="primary" size="md" [full]="true" [disabled]="!creditAuth" (clicked)="closeModal('company')">Confirm &amp; Save</app-btn>
      </div>
    </app-modal>

    <!-- Previous Projects Modal -->
    <app-modal *ngIf="modal === 'prev'" title="Share your previous projects" (closed)="closeModal('prev')">
      <p class="modal-desc">Tell us about your track record so we can better assess your application.</p>
      <div class="toggle-row">
        <div class="toggle-opt"
          [style.background]="hasPrevProjects ? C.greenLt : '#fff'"
          [style.borderColor]="hasPrevProjects ? C.green : C.g200"
          [style.color]="hasPrevProjects ? C.green : C.g500"
          (click)="hasPrevProjects = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Yes, we've completed projects
        </div>
        <div class="toggle-opt"
          [style.background]="!hasPrevProjects ? C.g50 : '#fff'"
          [style.borderColor]="!hasPrevProjects ? C.g400 : C.g200"
          [style.color]="!hasPrevProjects ? C.g700 : C.g500"
          (click)="hasPrevProjects = false">
          No previous projects
        </div>
      </div>
      <div *ngIf="hasPrevProjects" class="prev-details">
        <app-input label="Completed projects" placeholder="e.g. 5" [value]="prevCount" (valueChange)="prevCount = $event"></app-input>
        <app-input label="Combined value (SAR)" placeholder="e.g. 50,000,000" [value]="prevValue" (valueChange)="prevValue = $event"></app-input>
        <div class="src-section">
          <div class="src-label">Financing sources</div>

          <!-- Stacked bar -->
          <div class="src-bar">
            <div class="src-bar-seg" *ngIf="finBank > 0" [style.width.%]="finBank" [style.background]="C.green">{{ finBank }}%</div>
            <div class="src-bar-seg" *ngIf="finFintech > 0" [style.width.%]="finFintech" [style.background]="C.blue500">{{ finFintech }}%</div>
            <div class="src-bar-seg" *ngIf="finFriends > 0" [style.width.%]="finFriends" [style.background]="C.amber500">{{ finFriends }}%</div>
            <div class="src-bar-seg" *ngIf="finSelf > 0" [style.width.%]="finSelf" [style.background]="C.g300">{{ finSelf }}%</div>
          </div>

          <!-- Source rows -->
          <div class="src-row">
            <div class="src-dot" [style.background]="C.green"></div>
            <span class="src-name">Bank</span>
            <div class="src-stepper">
              <button class="src-btn" [disabled]="finBank <= 0" (click)="adjustSource('bank', -5)">-</button>
              <span class="src-pct">{{ finBank }}%</span>
              <button class="src-btn" [disabled]="finSelf <= 0" (click)="adjustSource('bank', 5)">+</button>
            </div>
          </div>
          <div class="src-row">
            <div class="src-dot" [style.background]="C.blue500"></div>
            <span class="src-name">Fintech</span>
            <div class="src-stepper">
              <button class="src-btn" [disabled]="finFintech <= 0" (click)="adjustSource('fintech', -5)">-</button>
              <span class="src-pct">{{ finFintech }}%</span>
              <button class="src-btn" [disabled]="finSelf <= 0" (click)="adjustSource('fintech', 5)">+</button>
            </div>
          </div>
          <div class="src-row">
            <div class="src-dot" [style.background]="C.amber500"></div>
            <span class="src-name">Friends &amp; Family</span>
            <div class="src-stepper">
              <button class="src-btn" [disabled]="finFriends <= 0" (click)="adjustSource('friends', -5)">-</button>
              <span class="src-pct">{{ finFriends }}%</span>
              <button class="src-btn" [disabled]="finSelf <= 0" (click)="adjustSource('friends', 5)">+</button>
            </div>
          </div>
          <div class="src-row src-row-auto">
            <div class="src-dot" [style.background]="C.g300"></div>
            <span class="src-name">Self-Funded</span>
            <span class="src-auto" [style.color]="C.green">{{ finSelf }}%</span>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <app-btn variant="primary" size="md" [full]="true" (clicked)="closeModal('prev')">Save</app-btn>
      </div>
    </app-modal>

    <!-- Declaration Modal -->
    <app-modal *ngIf="modal === 'declaration'" title="Declaration of No Legal Proceedings" (closed)="modal = null">
      <p class="modal-desc">Please confirm whether your company is currently involved in any major litigations or legal proceedings.</p>

      <div class="decl-question">
        <div class="decl-q-label">Does your company have any major litigations or legal proceedings?</div>
        <div class="toggle-row">
          <div class="toggle-opt"
            [style.background]="hasLitigations === true ? C.amber50 : '#fff'"
            [style.borderColor]="hasLitigations === true ? C.amber500 : C.g200"
            [style.color]="hasLitigations === true ? C.amber600 : C.g500"
            (click)="hasLitigations = true; declarationSigned = false">
            Yes
          </div>
          <div class="toggle-opt"
            [style.background]="hasLitigations === false ? C.greenLt : '#fff'"
            [style.borderColor]="hasLitigations === false ? C.green : C.g200"
            [style.color]="hasLitigations === false ? C.green : C.g500"
            (click)="hasLitigations = false; declarationSigned = false">
            <svg *ngIf="hasLitigations === false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            No
          </div>
        </div>
      </div>

      <!-- Yes: describe litigations -->
      <div *ngIf="hasLitigations === true" class="decl-details">
        <div class="decl-warn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.amber500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>Disclosing litigations will not automatically disqualify your application. Our team will review the details.</span>
        </div>
        <label class="field-label">Please describe the legal proceedings</label>
        <textarea class="textarea-field" [(ngModel)]="litigationDetails" placeholder="Describe the nature, status, and expected resolution of any major litigations..." rows="4"></textarea>
        <div class="modal-actions">
          <app-btn variant="primary" size="md" [full]="true" [disabled]="!litigationDetails.trim()" (clicked)="closeModal('declaration')">Submit Declaration</app-btn>
        </div>
      </div>

      <!-- No: sign the declaration -->
      <div *ngIf="hasLitigations === false" class="decl-sign-section">
        <div *ngIf="!declarationSigned" class="decl-sign-card">
          <div class="decl-sign-icon" [style.background]="C.greenLt">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <div class="decl-sign-text">
            <div class="decl-sign-title">Sign declaration letter</div>
            <div class="decl-sign-desc">You will be redirected to an external signing service to digitally sign the declaration confirming no major legal proceedings.</div>
          </div>
          <app-btn variant="primary" size="md" [full]="true" (clicked)="declarationSignPending = true">
            Sign Declaration &rarr;
          </app-btn>
        </div>

        <!-- Simulated signing pending -->
        <div *ngIf="declarationSignPending && !declarationSigned" class="decl-demo">
          <div class="decl-demo-label">Demo: Simulate signing result</div>
          <div class="decl-demo-row">
            <button class="decl-demo-btn decl-demo-success" (click)="declarationSigned = true; declarationSignPending = false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Signed Successfully
            </button>
            <button class="decl-demo-btn decl-demo-fail" (click)="declarationSignPending = false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Signing Failed
            </button>
          </div>
        </div>

        <!-- Signed success -->
        <div *ngIf="declarationSigned" class="decl-success">
          <div class="decl-success-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="decl-success-text">
            <div class="decl-success-title">Declaration signed successfully</div>
            <div class="decl-success-desc">Your declaration of no major legal proceedings has been digitally signed and recorded.</div>
          </div>
        </div>

        <div *ngIf="declarationSigned" class="modal-actions">
          <app-btn variant="primary" size="md" [full]="true" (clicked)="closeModal('declaration')">Complete Step</app-btn>
        </div>
      </div>
    </app-modal>

    <!-- Team Modal -->
    <app-modal *ngIf="modal === 'team'" title="Invite your team members" [wide]="true" (closed)="closeModal('team')">
      <p class="modal-desc">Add team members who will collaborate on this application.</p>
      <div *ngFor="let m of teamMembers; let i = index" class="team-member-row">
        <div class="team-member-header">
          <span class="team-member-num">Member {{ i + 1 }}</span>
          <span *ngIf="m.type === 'owner'" class="owner-badge">Owner</span>
          <span *ngIf="i >= 2" class="remove-member" (click)="teamMembers.splice(i, 1)">&times; Remove</span>
        </div>
        <div class="team-grid">
          <app-input label="Full Name" [placeholder]="'Name'" [value]="m.name" (valueChange)="m.name = $event"></app-input>
          <app-input label="Email" [placeholder]="'email@company.com'" [value]="m.email" (valueChange)="m.email = $event"></app-input>
        </div>
        <div class="team-grid">
          <app-input label="Phone" [placeholder]="'+966 5XX XXX XXXX'" [value]="m.phone" (valueChange)="m.phone = $event"></app-input>
          <div class="select-wrap">
            <label class="select-label">Role</label>
            <select [(ngModel)]="m.role" class="select-field">
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
              <option value="Editor">Editor</option>
            </select>
          </div>
        </div>
        <div class="team-grid">
          <app-input label="Ownership %" [placeholder]="'e.g. 60'" [value]="'' + m.share" (valueChange)="m.share = +$event" suffix="%"></app-input>
        </div>
      </div>
      <div class="add-member-btn" (click)="addTeamMember()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add member
      </div>
      <div class="modal-actions">
        <app-btn variant="primary" size="md" [full]="true" (clicked)="closeModal('team')">Save &amp; Send Invitations</app-btn>
      </div>
    </app-modal>

    <!-- Project Documents Modal -->
    <app-modal *ngIf="modal === 'projectDocs'" title="Upload Project Documents" [wide]="true" (closed)="closeDocModal('projectDocs')">
      <p class="modal-desc">Upload the required documents for your project. Additional documents help strengthen your application.</p>
      <div class="doc-list">
        <div *ngFor="let doc of projectDocSlots" class="doc-row" [class.doc-uploaded]="doc.uploaded">
          <div class="doc-icon" [style.background]="doc.uploaded ? C.greenLt : C.g100">
            <svg *ngIf="!doc.uploaded" width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <svg *ngIf="doc.uploaded" width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="doc-info">
            <div class="doc-name">
              {{ doc.name }}
              <app-badge *ngIf="doc.required" color="red" style="margin-left: 6px;">Required</app-badge>
              <app-badge *ngIf="!doc.required" color="gray" style="margin-left: 6px;">Optional</app-badge>
            </div>
            <div class="doc-desc">{{ doc.desc }}</div>
            <div *ngIf="doc.uploaded" class="doc-file">{{ doc.fileName }}</div>
          </div>
          <div class="doc-actions">
            <button *ngIf="!doc.uploaded" class="doc-upload-btn" (click)="simulateUpload(doc)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload
            </button>
            <button *ngIf="doc.uploaded" class="doc-view-btn" (click)="$event.stopPropagation()">View</button>
            <button *ngIf="doc.uploaded" class="doc-remove-btn" (click)="removeDoc(doc)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="doc-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>Accepted formats: PDF, PNG, JPG. Max file size: 10MB.</span>
      </div>
      <div class="modal-actions">
        <app-btn variant="primary" size="md" [full]="true" [disabled]="!projectRequiredDocsDone" (clicked)="closeDocModal('projectDocs')">
          {{ projectRequiredDocsDone ? 'Save Documents' : 'Upload required documents to continue' }}
        </app-btn>
      </div>
    </app-modal>

    <!-- Company Documents Modal -->
    <app-modal *ngIf="modal === 'companyDocs'" title="Upload Company Documents" [wide]="true" (closed)="closeDocModal('companyDocs')">
      <p class="modal-desc">Upload the required company documents. These are necessary for verifying your company's eligibility.</p>
      <div class="doc-list">
        <div *ngFor="let doc of companyDocSlots" class="doc-row" [class.doc-uploaded]="doc.uploaded">
          <div class="doc-icon" [style.background]="doc.uploaded ? C.greenLt : C.g100">
            <svg *ngIf="!doc.uploaded" width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <svg *ngIf="doc.uploaded" width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="doc-info">
            <div class="doc-name">
              {{ doc.name }}
              <app-badge *ngIf="doc.required" color="red" style="margin-left: 6px;">Required</app-badge>
              <app-badge *ngIf="!doc.required" color="gray" style="margin-left: 6px;">Optional</app-badge>
            </div>
            <div class="doc-desc">{{ doc.desc }}</div>
            <div *ngIf="doc.uploaded" class="doc-file">{{ doc.fileName }}</div>
          </div>
          <div class="doc-actions">
            <button *ngIf="!doc.uploaded" class="doc-upload-btn" (click)="simulateUpload(doc)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload
            </button>
            <button *ngIf="doc.uploaded" class="doc-view-btn" (click)="$event.stopPropagation()">View</button>
            <button *ngIf="doc.uploaded" class="doc-remove-btn" (click)="removeDoc(doc)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="doc-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>Accepted formats: PDF, PNG, JPG. Max file size: 10MB.</span>
      </div>
      <div class="modal-actions">
        <app-btn variant="primary" size="md" [full]="true" [disabled]="!companyRequiredDocsDone" (clicked)="closeDocModal('companyDocs')">
          {{ companyRequiredDocsDone ? 'Save Documents' : 'Upload required documents to continue' }}
        </app-btn>
      </div>
    </app-modal>

    <!-- Project Details Modal -->
    <app-modal *ngIf="modal === 'project'" title="Project Details" [wide]="true" (closed)="closeModal('project')">
      <p class="modal-desc">Review and update your project details.</p>
      <app-project-form
        [(name)]="projName"
        [(type)]="projType"
        [(stage)]="projStage"
        [(expectedUnits)]="projUnits"
        [(totalBuildingArea)]="projBuildingArea"
        [(totalSellingArea)]="projSellingArea"
        [(projectPeriod)]="projPeriod"
      ></app-project-form>
      <div class="modal-actions">
        <app-btn variant="primary" size="md" [full]="true" (clicked)="closeModal('project')">Save Changes</app-btn>
      </div>
    </app-modal>

    <!-- Financing Need Modal -->
    <app-modal *ngIf="modal === 'financing'" title="Financing Need" [wide]="true" (closed)="closeModal('financing')">
      <p class="modal-desc">Define your financing requirements.</p>
      <app-financing-form
        [(totalCost)]="finTotalCost"
        [(financingPct)]="finPct"
        [(landCostPct)]="finLandPct"
        [(product)]="finProduct"
        [(expectedRevenue)]="finRevenue"
        [expectedUnits]="projUnits"
        [totalSellingArea]="projSellingArea"
      ></app-financing-form>
      <div class="modal-actions">
        <app-btn variant="primary" size="md" [full]="true" (clicked)="closeModal('financing')">Save Changes</app-btn>
      </div>
    </app-modal>
  `,
  styles: [`
    :host {
      display: block;
      background: ${C.bg};
      min-height: 100vh;
    }

    .page {
      min-height: 100vh;
    }

    .container {
      max-width: 620px;
      margin: 0 auto;
      padding: 32px 32px 60px;
    }

    .header-section {
      text-align: center;
      margin-bottom: 28px;
    }

    .page-title {
      font-size: 22px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 6px 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: ${C.g500};
      margin: 0;
    }

    /* Progress Ring */
    .progress-ring-wrap {
      position: relative;
      width: 90px;
      height: 90px;
      margin: 0 auto 32px;
    }

    .progress-text {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pct-num {
      font-size: 22px;
      font-weight: 900;
      color: ${C.g900};
    }

    .pct-sign {
      font-size: 12px;
      font-weight: 700;
      color: ${C.g400};
      margin-left: 1px;
    }

    /* Groups */
    .group-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .group-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .group-name {
      font-size: 14px;
      font-weight: 800;
      color: ${C.g800};
    }

    /* Steps */
    .steps-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .step-row {
      display: flex;
      align-items: center;
      padding: 14px 16px;
      border-radius: 12px;
      border: 1.5px solid ${C.g200};
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .step-row:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .step-circle {
      width: 28px;
      height: 28px;
      min-width: 28px;
      border-radius: 50%;
      border: 2px solid ${C.g300};
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }

    .step-num {
      font-size: 12px;
      font-weight: 800;
    }

    .step-info {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .step-label {
      font-size: 13px;
      font-weight: 700;
    }

    .step-action {
      margin-left: 12px;
      flex-shrink: 0;
    }

    .edit-link {
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .edit-link:hover {
      text-decoration: underline;
    }

    /* Submit */
    .submit-section {
      margin-top: 32px;
    }

    .submit-box {
      background: ${C.greenLt};
      border: 1.5px solid ${C.greenMd};
      border-radius: 14px;
      padding: 20px;
    }

    .accuracy-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      font-weight: 600;
      color: ${C.g700};
      cursor: pointer;
      line-height: 1.5;
    }

    .accuracy-cb {
      width: 18px;
      height: 18px;
      margin-top: 1px;
      accent-color: ${C.green};
      flex-shrink: 0;
    }

    .submit-btn-row {
      margin-top: 16px;
    }

    /* Help */
    .help-section {
      margin-top: 32px;
    }

    .help-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .help-title {
      font-size: 14px;
      font-weight: 800;
      color: ${C.g800};
      margin-bottom: 2px;
    }

    .help-desc {
      font-size: 12px;
      color: ${C.g400};
    }

    /* Modal shared styles */
    .modal-desc {
      font-size: 13px;
      color: ${C.g500};
      margin: 0 0 20px 0;
      line-height: 1.5;
    }

    .modal-actions {
      margin-top: 24px;
    }

    /* Company modal - info grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }

    .info-item {
      background: ${C.g50};
      border-radius: 10px;
      padding: 12px;
    }

    .info-label {
      font-size: 11px;
      font-weight: 700;
      color: ${C.g400};
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .info-value {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g800};
    }

    .cb-section {
      margin-top: 16px;
      padding: 14px;
      background: ${C.amber50};
      border: 1px solid ${C.amber100};
      border-radius: 10px;
    }

    .cb-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      font-weight: 600;
      color: ${C.g700};
      cursor: pointer;
      line-height: 1.5;
    }

    /* Prev projects modal */
    .toggle-row {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .toggle-opt {
      flex: 1;
      padding: 12px;
      border-radius: 10px;
      border: 1.5px solid ${C.g200};
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s ease;
    }

    .prev-details {
      margin-top: 4px;
    }

    .src-section {
      margin-top: 8px;
    }

    .src-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      margin-bottom: 12px;
    }

    .src-bar {
      display: flex;
      height: 28px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
      background: ${C.g100};
    }

    .src-bar-seg {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      color: #fff;
      min-width: 0;
      transition: width 0.2s ease;
      overflow: hidden;
      white-space: nowrap;
    }

    .src-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: ${C.g50};
      border-radius: 10px;
      margin-bottom: 6px;
    }

    .src-row-auto {
      background: transparent;
      border: 1.5px dashed ${C.g200};
    }

    .src-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .src-name {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      flex: 1;
    }

    .src-stepper {
      display: flex;
      align-items: center;
      gap: 0;
      background: #fff;
      border: 1.5px solid ${C.g200};
      border-radius: 8px;
      overflow: hidden;
    }

    .src-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      font-size: 16px;
      font-weight: 700;
      color: ${C.g600};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.1s ease;
    }

    .src-btn:hover:not(:disabled) {
      background: ${C.g100};
    }

    .src-btn:disabled {
      color: ${C.g300};
      cursor: default;
    }

    .src-pct {
      font-size: 13px;
      font-weight: 800;
      color: ${C.g900};
      width: 40px;
      text-align: center;
      border-left: 1px solid ${C.g200};
      border-right: 1px solid ${C.g200};
      padding: 0 4px;
    }

    .src-auto {
      font-size: 14px;
      font-weight: 800;
      margin-left: auto;
    }

    /* Team modal */
    .team-member-row {
      padding: 16px;
      background: ${C.g50};
      border-radius: 12px;
      margin-bottom: 12px;
    }

    .team-member-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .team-member-num {
      font-size: 13px;
      font-weight: 800;
      color: ${C.g800};
    }

    .owner-badge {
      font-size: 11px;
      font-weight: 700;
      color: ${C.green};
      background: ${C.greenLt};
      padding: 2px 8px;
      border-radius: 10px;
    }

    .remove-member {
      font-size: 12px;
      font-weight: 700;
      color: ${C.red500};
      cursor: pointer;
      margin-left: auto;
    }

    .team-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .select-wrap {
      margin-bottom: 16px;
    }

    .select-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      display: block;
      margin-bottom: 6px;
    }

    .select-field {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      font-size: 14px;
      color: ${C.g900};
      background: #fff;
      font-family: inherit;
      outline: none;
      box-sizing: border-box;
    }

    .add-member-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px;
      border: 2px dashed ${C.g300};
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      color: ${C.g500};
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .add-member-btn:hover {
      border-color: ${C.green};
      color: ${C.green};
    }

    /* Shared modal fields */
    .field-label {
      font-size: 13px; font-weight: 700; color: ${C.g700};
      display: block; margin-bottom: 6px;
    }
    .textarea-field {
      width: 100%; padding: 12px 14px; border: 1.5px solid ${C.g200};
      border-radius: 10px; font-size: 14px; color: ${C.g900};
      background: #fff; font-family: inherit; outline: none;
      resize: vertical; box-sizing: border-box;
    }

    /* Document upload modals */
    .doc-list { display: flex; flex-direction: column; gap: 8px; }
    .doc-row {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px; background: ${C.g50}; border-radius: 12px;
      border: 1.5px solid ${C.g100}; transition: all 0.15s;
    }
    .doc-row.doc-uploaded {
      background: ${C.greenLt}; border-color: ${C.greenMd};
    }
    .doc-icon {
      width: 36px; height: 36px; min-width: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .doc-info { flex: 1; min-width: 0; }
    .doc-name {
      font-size: 13px; font-weight: 700; color: ${C.g800};
      display: flex; align-items: center;
    }
    .doc-desc {
      font-size: 11.5px; color: ${C.g400}; margin-top: 3px; line-height: 1.45;
    }
    .doc-file {
      font-size: 11px; color: ${C.g500}; margin-top: 2px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .doc-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .doc-upload-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 7px 14px; border: 1.5px solid ${C.green}; border-radius: 8px;
      background: #fff; color: ${C.green}; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.15s; font-family: inherit;
    }
    .doc-upload-btn:hover { background: ${C.greenLt}; }
    .doc-view-btn {
      padding: 7px 12px; border: 1.5px solid ${C.g200}; border-radius: 8px;
      background: #fff; color: ${C.g600}; font-size: 12px; font-weight: 700;
      cursor: pointer; font-family: inherit; transition: all 0.15s;
    }
    .doc-view-btn:hover { border-color: ${C.g300}; }
    .doc-remove-btn {
      padding: 7px 8px; border: 1.5px solid ${C.g200}; border-radius: 8px;
      background: #fff; color: ${C.g400}; cursor: pointer; font-family: inherit;
      display: flex; align-items: center; justify-content: center; transition: all 0.15s;
    }
    .doc-remove-btn:hover { border-color: ${C.red500}; color: ${C.red500}; }
    .doc-hint {
      display: flex; align-items: center; gap: 8px; margin-top: 14px;
      font-size: 12px; color: ${C.g400};
    }

    /* Declaration modal */
    .decl-question { margin-bottom: 20px; }
    .decl-q-label {
      font-size: 14px; font-weight: 700; color: ${C.g800}; margin-bottom: 12px;
    }
    .decl-details { margin-top: 4px; }
    .decl-warn {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 14px; background: ${C.amber50}; border: 1px solid ${C.amber100};
      border-radius: 10px; margin-bottom: 16px;
      font-size: 12px; color: ${C.g600}; line-height: 1.5;
    }
    .decl-warn svg { flex-shrink: 0; margin-top: 1px; }
    .decl-sign-section { margin-top: 4px; }
    .decl-sign-card {
      padding: 20px; background: ${C.g50}; border-radius: 14px;
      display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;
    }
    .decl-sign-icon {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .decl-sign-text { margin-bottom: 4px; }
    .decl-sign-title {
      font-size: 14px; font-weight: 800; color: ${C.g900}; margin-bottom: 4px;
    }
    .decl-sign-desc {
      font-size: 12px; color: ${C.g500}; line-height: 1.5; max-width: 380px;
    }
    .decl-demo {
      margin-top: 16px; padding: 16px; border: 2px dashed ${C.g300};
      border-radius: 12px; text-align: center;
    }
    .decl-demo-label {
      font-size: 11px; font-weight: 700; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
    }
    .decl-demo-row { display: flex; gap: 10px; }
    .decl-demo-btn {
      flex: 1; padding: 10px 14px; border: none; border-radius: 10px;
      font-size: 13px; font-weight: 700; color: #fff; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: opacity 0.15s;
    }
    .decl-demo-btn:hover { opacity: 0.85; }
    .decl-demo-success { background: ${C.green}; }
    .decl-demo-fail { background: ${C.red500}; }
    .decl-success {
      display: flex; align-items: center; gap: 14px;
      padding: 16px 18px; background: ${C.greenLt}; border: 1.5px solid ${C.greenMd};
      border-radius: 14px;
    }
    .decl-success-icon {
      width: 40px; height: 40px; min-width: 40px; border-radius: 50%; background: ${C.green};
      display: flex; align-items: center; justify-content: center;
    }
    .decl-success-title {
      font-size: 14px; font-weight: 800; color: ${C.g900}; margin-bottom: 2px;
    }
    .decl-success-desc {
      font-size: 12px; color: ${C.g500}; line-height: 1.4;
    }

  `]
})
export class FirstDashboardComponent {
  C = C;

  // Step done state
  done: Record<string, boolean> = {
    project: true,
    financing: true,
    projectDocs: false,
    company: false,
    prev: false,
    companyDocs: false,
    declaration: false,
    team: false,
  };

  accuracy = false;
  modal: string | null = null;

  // Step definitions
  allSteps: Step[] = [
    { key: 'project', label: 'Add your project details', mandatory: true, group: 'project', modal: 'project' },
    { key: 'financing', label: 'Define your financing need', mandatory: true, group: 'project', modal: 'financing' },
    { key: 'projectDocs', label: 'Upload project documents', mandatory: true, group: 'project', modal: 'projectDocs' },
    { key: 'company', label: 'Review company details & authorize credit check', mandatory: true, group: 'company', modal: 'company' },
    { key: 'prev', label: 'Share your previous projects', mandatory: true, group: 'company', modal: 'prev' },
    { key: 'companyDocs', label: 'Upload company documents', mandatory: true, group: 'company', modal: 'companyDocs' },
    { key: 'declaration', label: 'Sign declaration of no legal proceedings', mandatory: true, group: 'company', modal: 'declaration' },
    { key: 'team', label: 'Invite your team members', mandatory: false, group: 'company', modal: 'team' },
  ];

  get projectSteps() { return this.allSteps.filter(s => s.group === 'project'); }
  get companySteps() { return this.allSteps.filter(s => s.group === 'company'); }

  // SVG circle calculations
  readonly radius = 38;
  readonly circumference = 2 * Math.PI * 38;

  get totalDone(): number {
    return Object.values(this.done).filter(v => v).length;
  }

  get pct(): number {
    return Math.min(100, Math.round(51 + ((this.totalDone - 2) / (this.allSteps.length - 2)) * 49));
  }

  get dashOffset(): number {
    return this.circumference - (this.pct / 100) * this.circumference;
  }

  get allMandatoryDone(): boolean {
    return this.allSteps.filter(s => s.mandatory).every(s => this.done[s.key]);
  }

  // Company modal
  companyWebsite = '';
  creditAuth = false;

  // Prev projects modal
  hasPrevProjects = true;
  prevCount = '';
  prevValue = '';
  finBank = 40;
  finFintech = 20;
  finFriends = 15;

  get finSelf(): number {
    return Math.max(0, 100 - this.finBank - this.finFintech - this.finFriends);
  }

  // Team modal
  teamMembers: TeamMember[] = [
    { name: 'Mohammad Al-Salem', email: 'mohammad@alomran.com', phone: '+966 50 123 4567', role: 'Admin', share: 60, type: 'owner' },
    { name: 'Fahad Al-Rashid', email: 'fahad@alomran.com', phone: '+966 55 987 6543', role: 'Viewer', share: 40, type: 'owner' },
  ];

  // Project documents
  projectDocSlots: DocSlot[] = [
    { name: 'Land Title Deed', desc: 'Official title deed issued by the Ministry of Justice proving land ownership. Upload a clear scanned copy of the original document.', required: true, uploaded: false, fileName: '' },
    { name: 'Project Master Plan', desc: 'Approved master plan from the municipality showing the project layout, land use, and zoning details.', required: false, uploaded: false, fileName: '' },
    { name: 'Building Permit', desc: 'Valid building permit issued by the local municipality authorizing construction on the project site.', required: false, uploaded: false, fileName: '' },
  ];

  // Company documents
  companyDocSlots: DocSlot[] = [
    { name: 'Owner ID', desc: 'National ID or Iqama of the company owner. Ensure the document is valid and not expired.', required: true, uploaded: false, fileName: '' },
    { name: 'Owner Credit History Report', desc: 'Recent credit report from SIMAH (Saudi Credit Bureau). The report must be issued within the last 3 months.', required: true, uploaded: false, fileName: '' },
  ];

  // Declaration modal
  hasLitigations: boolean | null = null;
  litigationDetails = '';
  declarationSigned = false;
  declarationSignPending = false;

  // Project form state
  projName = 'Al Noor Residential';
  projType = '';
  projStage = '';
  projUnits = '';
  projBuildingArea = '';
  projSellingArea = '';
  projPeriod = '';

  // Financing form state
  finTotalCost = '';
  finPct = 60;
  finLandPct = 40;
  finProduct = '';
  finRevenue = '';

  constructor(private router: Router) {}

  go(path: string) {
    this.router.navigateByUrl(path);
  }

  /** Determine step state: done, next (first undone mandatory), or pending */
  stepState(step: Step): 'done' | 'next' | 'pending' {
    if (this.done[step.key]) return 'done';
    // Find the first undone step (mandatory first, then optional)
    const firstUndoneMandatory = this.allSteps.find(s => s.mandatory && !this.done[s.key]);
    if (firstUndoneMandatory && firstUndoneMandatory.key === step.key) return 'next';
    // If all mandatory are done, the first undone optional is next
    if (!firstUndoneMandatory) {
      const firstUndoneOptional = this.allSteps.find(s => !s.mandatory && !this.done[s.key]);
      if (firstUndoneOptional && firstUndoneOptional.key === step.key) return 'next';
    }
    return 'pending';
  }

  /** Get display number for undone steps */
  stepNumber(step: Step): number {
    const undone = this.allSteps.filter(s => !this.done[s.key]);
    return undone.indexOf(step) + 1;
  }

  openStep(step: Step) {
    this.modal = step.modal;
  }

  closeModal(key: string) {
    this.done[key] = true;
    this.modal = null;
  }

  adjustSource(source: 'bank' | 'fintech' | 'friends', delta: number) {
    const used = this.finBank + this.finFintech + this.finFriends;
    const remaining = 100 - used;
    if (source === 'bank') {
      this.finBank = Math.max(0, Math.min(this.finBank + delta, this.finBank + remaining));
    } else if (source === 'fintech') {
      this.finFintech = Math.max(0, Math.min(this.finFintech + delta, this.finFintech + remaining));
    } else {
      this.finFriends = Math.max(0, Math.min(this.finFriends + delta, this.finFriends + remaining));
    }
  }

  addTeamMember() {
    this.teamMembers.push({ name: '', email: '', phone: '', role: 'Viewer', share: 0, type: 'member' });
  }

  simulateUpload(doc: DocSlot) {
    doc.uploaded = true;
    doc.fileName = doc.name.toLowerCase().replace(/\s+/g, '_') + '.pdf';
  }

  removeDoc(doc: DocSlot) {
    doc.uploaded = false;
    doc.fileName = '';
  }

  get projectRequiredDocsDone(): boolean {
    return this.projectDocSlots.filter(d => d.required).every(d => d.uploaded);
  }

  get companyRequiredDocsDone(): boolean {
    return this.companyDocSlots.filter(d => d.required).every(d => d.uploaded);
  }

  closeDocModal(key: string) {
    const allReqDone = key === 'projectDocs' ? this.projectRequiredDocsDone : this.companyRequiredDocsDone;
    if (allReqDone) {
      this.done[key] = true;
    }
    this.modal = null;
  }
}
