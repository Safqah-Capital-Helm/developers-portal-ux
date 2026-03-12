import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { BackLinkComponent } from '../../shared/components/back-link/back-link.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-submitted',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent, BackLinkComponent, ButtonComponent, CardComponent, BadgeComponent],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard" label="Back to Dashboard"></app-back-link>

        <!-- ===================== HEADER ===================== -->
        <div class="header">
          <div class="icon-circle" [style.background]="allCompleted ? '${C.greenLt}' : '${C.amber100}'">
            <svg *ngIf="allCompleted" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <svg *ngIf="!allCompleted" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h1 class="title">{{ allCompleted ? 'Application Completed!' : 'Application Status' }}</h1>
          <p class="subtitle">Al Noor Residential &middot; Al Omran Real Estate Dev Co.</p>
        </div>

        <!-- ===================== PIPELINE ===================== -->
        <div class="pipeline">
          <ng-container *ngFor="let step of pipelineSteps; let i = index; let last = last">
            <div class="pipe-step">
              <div *ngIf="pipelineIndex > i" class="pipe-dot pipe-done">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div *ngIf="pipelineIndex === i" class="pipe-dot pipe-active">
                <span class="pipe-pulse"></span>
              </div>
              <div *ngIf="pipelineIndex < i" class="pipe-dot pipe-pending"></div>
              <span class="pipe-label" [class.pipe-label-active]="pipelineIndex >= i">{{ step }}</span>
            </div>
            <div *ngIf="!last" class="pipe-line" [class.pipe-line-done]="pipelineIndex > i"></div>
          </ng-container>
        </div>

        <!-- ===================== DEMO BAR ===================== -->
        <div class="demo-bar">
          <button *ngFor="let d of demoStates" class="demo-toggle" [class.demo-active]="demoState === d.key" (click)="setDemoState(d.key)">{{ d.label }}</button>
        </div>

        <!-- ===================== INFORMATION REQUEST ===================== -->
        <div *ngIf="infoRequests.length > 0 && !infoRequestSubmitted" class="section ir-section">
          <div class="section-header" (click)="toggleSection('info-request')">
            <div class="sh-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <h2 class="section-title">Action Required</h2>
                <p class="section-sub">The review team has requested additional information</p>
              </div>
            </div>
            <div class="sh-right">
              <app-badge color="amber">{{ infoRequests.length }} item{{ infoRequests.length > 1 ? 's' : '' }}</app-badge>
              <svg class="chevron" [class.chevron-open]="expandedSection === 'info-request'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div *ngIf="expandedSection === 'info-request'" class="section-body">
            <div class="ir-items">
              <div *ngFor="let req of infoRequests; let i = index" class="ir-item">
                <div class="ir-item-header">
                  <div class="ir-type-icon" [ngSwitch]="req.type">
                    <svg *ngSwitchCase="'clarification'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <svg *ngSwitchCase="'document'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <svg *ngSwitchDefault width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  </div>
                  <div class="ir-item-text">
                    <span class="ir-item-title">{{ req.title }}</span>
                    <span class="ir-item-desc">{{ req.description }}</span>
                  </div>
                </div>
                <div *ngIf="req.type !== 'document'" class="ir-response">
                  <textarea [(ngModel)]="req.response" [placeholder]="'Type your response...'" class="ir-textarea" rows="3"></textarea>
                </div>
                <div *ngIf="req.type === 'document'" class="ir-response">
                  <div *ngIf="!req.fileUploaded" class="ir-upload-box" (click)="req.fileUploaded = true; req.fileName = 'bank_statement_2026.pdf'">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                    <span>Click to upload document</span>
                  </div>
                  <div *ngIf="req.fileUploaded" class="ir-uploaded">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span class="ir-file-name">{{ req.fileName }}</span>
                    <button class="ir-remove" (click)="req.fileUploaded = false; req.fileName = ''">&times;</button>
                  </div>
                </div>
                <div class="ir-response ir-attachments">
                  <div class="ir-attach-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                    <span>Supporting files</span>
                    <span class="ir-attach-opt">(optional)</span>
                  </div>
                  <div *ngFor="let f of req.files; let fi = index" class="ir-uploaded ir-attach-file">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span class="ir-file-name">{{ f }}</span>
                    <button class="ir-remove" (click)="removeFile(req, fi)">&times;</button>
                  </div>
                  <button class="ir-add-file" (click)="addSupportingFile(req)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${C.g500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add file
                  </button>
                </div>
              </div>
            </div>
            <div class="ir-actions">
              <app-btn variant="primary" size="md" [disabled]="!canSubmitInfoResponse()" (clicked)="submitInfoResponse()">Submit Response</app-btn>
            </div>
          </div>
        </div>

        <!-- Info request submitted confirmation -->
        <div *ngIf="infoRequestSubmitted" class="ir-confirmed">
          <div class="ir-confirmed-inner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <div>
              <strong>Response submitted</strong>
              <span>Your response has been sent to the review team. Processing will continue shortly.</span>
            </div>
          </div>
        </div>

        <!-- ===================== PROJECT REVIEW ===================== -->
        <div class="section" [class.section-completed]="pReview === 'approved'">
          <div class="section-header" (click)="toggleSection('project-review')">
            <div class="sh-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="pReview === 'approved' ? '${C.green}' : '${C.g400}'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              <div>
                <h2 class="section-title">Project Review</h2>
                <p class="section-sub">Al Noor Residential</p>
              </div>
            </div>
            <div class="sh-right">
              <button *ngIf="pReview !== 'approved'" class="demo-section-btn" (click)="$event.stopPropagation(); approveProject()">Demo: Approve</button>
              <app-badge [color]="reviewBadgeColor(pReview)">{{ reviewBadgeLabel(pReview) }}</app-badge>
              <svg class="chevron" [class.chevron-open]="expandedSection === 'project-review'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div *ngIf="expandedSection === 'project-review'" class="section-body">
            <div class="timeline">
              <ng-container *ngFor="let stage of projectStages; let i = index; let last = last">
                <div class="tl-row">
                  <div class="tl-track">
                    <div *ngIf="i < ps" class="tl-dot tl-done">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div *ngIf="i === ps && ps < projectStages.length" class="tl-dot tl-active">
                      <span class="tl-pulse"></span>
                    </div>
                    <div *ngIf="i > ps" class="tl-dot tl-pending"></div>
                    <div *ngIf="!last" class="tl-line" [class.tl-line-done]="i < ps"></div>
                  </div>
                  <div class="tl-content">
                    <span class="tl-name" [class.tl-name-done]="i < ps" [class.tl-name-active]="i === ps && ps < projectStages.length">{{ stage.name }}</span>
                    <span class="tl-desc" *ngIf="stage.desc">{{ stage.desc }}</span>
                    <span class="tl-sla" *ngIf="stage.sla">{{ stage.sla }}</span>
                    <button *ngIf="i === ps && ps < projectStages.length" class="demo-advance" (click)="$event.stopPropagation(); advanceProject()">Demo &darr;</button>
                  </div>
                </div>
              </ng-container>
            </div>

            <div *ngIf="pReview === 'feedback'" class="alert-box alert-amber">
              <div class="alert-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div class="alert-body">
                <strong>Additional information needed</strong>
                <p>Our review team has requested more details about the project.</p>
                <app-btn variant="secondary" size="sm" (clicked)="pReview = 'in_review'">Respond to Feedback</app-btn>
              </div>
            </div>
            <div *ngIf="pReview === 'rejected'" class="alert-box alert-red">
              <div class="alert-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.red500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <div class="alert-body">
                <strong>Project review was not approved</strong>
                <p>The project did not meet eligibility criteria at this time.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================== COMPANY REVIEW ===================== -->
        <div class="section" [class.section-completed]="cReview === 'approved'">
          <div class="section-header" (click)="toggleSection('company-review')">
            <div class="sh-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="cReview === 'approved' ? '${C.green}' : '${C.g400}'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <div>
                <h2 class="section-title">Company Review</h2>
                <p class="section-sub">Al Omran Real Estate Dev Co.</p>
              </div>
            </div>
            <div class="sh-right">
              <button *ngIf="cReview !== 'approved'" class="demo-section-btn" (click)="$event.stopPropagation(); approveCompany()">Demo: Approve</button>
              <app-badge [color]="reviewBadgeColor(cReview)">{{ reviewBadgeLabel(cReview) }}</app-badge>
              <svg class="chevron" [class.chevron-open]="expandedSection === 'company-review'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div *ngIf="expandedSection === 'company-review'" class="section-body">
            <div class="timeline">
              <ng-container *ngFor="let stage of companyStages; let i = index; let last = last">
                <div class="tl-row">
                  <div class="tl-track">
                    <div *ngIf="i < cs" class="tl-dot tl-done">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div *ngIf="i === cs && cs < companyStages.length" class="tl-dot tl-active">
                      <span class="tl-pulse"></span>
                    </div>
                    <div *ngIf="i > cs" class="tl-dot tl-pending"></div>
                    <div *ngIf="!last" class="tl-line" [class.tl-line-done]="i < cs"></div>
                  </div>
                  <div class="tl-content">
                    <span class="tl-name" [class.tl-name-done]="i < cs" [class.tl-name-active]="i === cs && cs < companyStages.length">{{ stage.name }}</span>
                    <span class="tl-desc" *ngIf="stage.desc">{{ stage.desc }}</span>
                    <span class="tl-sla" *ngIf="stage.sla">{{ stage.sla }}</span>
                    <button *ngIf="i === cs && cs < companyStages.length" class="demo-advance" (click)="$event.stopPropagation(); advanceCompany()">Demo &darr;</button>
                  </div>
                </div>
              </ng-container>
            </div>

            <div *ngIf="cReview === 'feedback'" class="alert-box alert-amber">
              <div class="alert-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div class="alert-body">
                <strong>Additional information needed</strong>
                <p>The review team needs more company documentation.</p>
                <app-btn variant="secondary" size="sm" (clicked)="cReview = 'in_review'">Respond to Feedback</app-btn>
              </div>
            </div>
            <div *ngIf="cReview === 'rejected'" class="alert-box alert-red">
              <div class="alert-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.red500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <div class="alert-body">
                <strong>Company review was not approved</strong>
                <p>The company did not meet the required criteria.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================== TERM-SHEET ===================== -->
        <div class="section" [class.section-locked]="!tsUnlocked" [class.section-completed]="tsStatus === 'accepted'">
          <div class="section-header" (click)="tsUnlocked && toggleSection('termsheet')">
            <div class="sh-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="tsStatus === 'accepted' ? '${C.green}' : '${C.g400}'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <div>
                <h2 class="section-title">Term-sheet</h2>
              </div>
            </div>
            <div class="sh-right">
              <app-badge *ngIf="tsUnlocked" [color]="tsBadgeColor()">{{ tsBadgeLabel() }}</app-badge>
              <svg *ngIf="tsUnlocked" class="chevron" [class.chevron-open]="expandedSection === 'termsheet'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div *ngIf="!tsUnlocked" class="lock-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Unlocks after review</span>
          </div>

          <div *ngIf="tsUnlocked && expandedSection === 'termsheet'" class="section-body">
            <div *ngIf="tsStatus !== 'accepted'">
              <app-card [padding]="0" *ngIf="tsStatus === 'ready'">
                <div class="ts-inner">
                  <div class="ts-highlight">
                    <div class="ts-hl-cell" [style.background]="'${C.greenLt}'">
                      <span class="ts-hl-label">Amount</span>
                      <span class="ts-hl-value" [style.color]="'${C.green}'">21M SAR</span>
                    </div>
                    <div class="ts-hl-cell" [style.background]="'${C.g50}'">
                      <span class="ts-hl-label">Return</span>
                      <span class="ts-hl-value" [style.color]="'${C.g800}'">8.5%</span>
                    </div>
                  </div>
                  <div class="ts-details">
                    <div class="ts-detail">
                      <span class="ts-d-label">Product</span>
                      <span class="ts-d-value">Development</span>
                    </div>
                    <div class="ts-detail">
                      <span class="ts-d-label">Tenor</span>
                      <span class="ts-d-value">24 months</span>
                    </div>
                    <div class="ts-detail">
                      <span class="ts-d-label">Structure</span>
                      <span class="ts-d-value">Murabaha</span>
                    </div>
                  </div>
                </div>
              </app-card>
              <div class="ts-actions" *ngIf="tsStatus === 'ready'">
                <app-btn variant="secondary" size="md" (clicked)="go('/application/1/term-sheet')">View Full Term-sheet &rarr;</app-btn>
                <app-btn variant="primary" size="sm" (clicked)="tsStatus = 'accepted'; expandedSection = 'agreements'">Accept Term-sheet</app-btn>
              </div>
              <div *ngIf="tsStatus === 'pending'" class="waiting-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <span class="waiting-title">Term-sheet is being prepared</span>
                  <span class="waiting-sub">You will be notified when your term-sheet is ready for review.</span>
                </div>
              </div>
            </div>

            <div *ngIf="tsStatus === 'accepted'" class="accepted-box">
              <div class="accepted-row">
                <div class="accepted-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <strong>Term-sheet accepted</strong>
                  <p>You accepted the financing term-sheet on March 9, 2026.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================== AGREEMENT SIGNING ===================== -->
        <div class="section" [class.section-locked]="!agUnlocked" [class.section-completed]="allSigned">
          <div class="section-header" (click)="agUnlocked && toggleSection('agreements')">
            <div class="sh-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="allSigned ? '${C.green}' : '${C.g400}'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <div>
                <h2 class="section-title">Agreement Signing</h2>
              </div>
            </div>
            <div class="sh-right">
              <app-badge *ngIf="agUnlocked" [color]="allSigned ? 'green' : 'amber'">{{ allSigned ? 'Completed' : 'Awaiting Signatures' }}</app-badge>
              <svg *ngIf="agUnlocked" class="chevron" [class.chevron-open]="expandedSection === 'agreements'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div *ngIf="!agUnlocked" class="lock-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Unlocks after term-sheet acceptance</span>
          </div>

          <div *ngIf="agUnlocked && expandedSection === 'agreements'" class="section-body">
            <div class="agreements">
              <app-card [padding]="20">
                <div class="ag-card">
                  <div class="ag-top">
                    <div class="ag-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div class="ag-info">
                      <strong>Debt Issuance Agreement</strong>
                      <span class="ag-desc">Primary financing agreement between issuer and investor</span>
                    </div>
                    <app-badge [color]="ag1 === 'signed' ? 'green' : 'amber'">{{ ag1 === 'signed' ? 'Signed' : 'Awaiting' }}</app-badge>
                  </div>
                  <div *ngIf="ag1 === 'pending'" class="ag-actions">
                    <app-btn variant="primary" size="sm" (clicked)="signAgreement1()">Sign Agreement</app-btn>
                    <app-btn variant="ghost" size="sm" (clicked)="go('/application/1/term-sheet')">Preview</app-btn>
                  </div>
                  <div *ngIf="ag1 === 'signed'" class="ag-signed">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Signed on March 9, 2026</span>
                  </div>
                </div>
              </app-card>

              <app-card [padding]="20">
                <div class="ag-card">
                  <div class="ag-top">
                    <div class="ag-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div class="ag-info">
                      <strong>Uhda &amp; Wekala Agreement</strong>
                      <span class="ag-desc">Custody and agency agreement for asset management</span>
                    </div>
                    <app-badge [color]="ag2 === 'signed' ? 'green' : 'amber'">{{ ag2 === 'signed' ? 'Signed' : 'Awaiting' }}</app-badge>
                  </div>
                  <div *ngIf="ag2 === 'pending'" class="ag-actions">
                    <app-btn variant="primary" size="sm" (clicked)="signAgreement2()">Sign Agreement</app-btn>
                    <app-btn variant="ghost" size="sm" (clicked)="go('/application/1/term-sheet')">Preview</app-btn>
                  </div>
                  <div *ngIf="ag2 === 'signed'" class="ag-signed">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Signed on March 9, 2026</span>
                  </div>
                </div>
              </app-card>
            </div>
          </div>
        </div>

        <!-- ===================== DEAL LAUNCH ===================== -->
        <div class="section" [class.section-locked]="!launchUnlocked" [class.section-completed]="allCompleted">
          <div class="section-header" (click)="launchUnlocked && toggleSection('launch')">
            <div class="sh-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="allCompleted ? '${C.green}' : '${C.g400}'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              <div>
                <h2 class="section-title">Deal Launch</h2>
              </div>
            </div>
            <div class="sh-right">
              <app-badge *ngIf="launchUnlocked" [color]="allCompleted ? 'green' : 'amber'">{{ allCompleted ? 'Completed' : 'In Progress' }}</app-badge>
              <svg *ngIf="launchUnlocked" class="chevron" [class.chevron-open]="expandedSection === 'launch'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div *ngIf="!launchUnlocked" class="lock-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Unlocks after agreements are signed</span>
          </div>

          <div *ngIf="launchUnlocked && expandedSection === 'launch'" class="section-body">
            <!-- Admin-triggered timeline steps -->
            <div *ngIf="!allCompleted" class="launch-info-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>These steps are processed by the Safqah team. No action is required from you.</span>
            </div>

            <div class="timeline">
              <ng-container *ngFor="let stage of launchStages; let i = index; let last = last">
                <div class="tl-row">
                  <div class="tl-track">
                    <div *ngIf="i < ls" class="tl-dot tl-done">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div *ngIf="i === ls && ls < launchStages.length" class="tl-dot tl-active">
                      <span class="tl-pulse"></span>
                    </div>
                    <div *ngIf="i > ls" class="tl-dot tl-pending"></div>
                    <div *ngIf="!last" class="tl-line" [class.tl-line-done]="i < ls"></div>
                  </div>
                  <div class="tl-content">
                    <span class="tl-name" [class.tl-name-done]="i < ls" [class.tl-name-active]="i === ls && ls < launchStages.length">{{ stage.name }}</span>
                    <span class="tl-desc" *ngIf="stage.desc">{{ stage.desc }}</span>
                    <span *ngIf="i === ls && ls < launchStages.length" class="tl-admin-tag">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                      Processed by Safqah
                    </span>
                    <button *ngIf="i === ls && ls < launchStages.length" class="demo-advance" (click)="$event.stopPropagation(); advanceLaunch()">Demo: Complete step &darr;</button>
                  </div>
                </div>
              </ng-container>
            </div>

            <!-- All completed celebration -->
            <div *ngIf="allCompleted" class="celebration">
              <div class="celebration-inner">
                <div class="celebration-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 class="celebration-title">Deal Launched!</h3>
                <p class="celebration-desc">Al Noor Residential is now live on the Safqah platform. Investors can begin participating in this financing opportunity.</p>
                <app-btn variant="secondary" size="md" (clicked)="go('/dashboard')">Back to Dashboard</app-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================== CANCEL REQUEST ===================== -->
        <div *ngIf="tsStatus !== 'accepted' && !allCompleted" class="cancel-footer">
          <button class="cancel-toggle" (click)="showCancel = !showCancel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline *ngIf="!showCancel" points="6 9 12 15 18 9"/>
              <polyline *ngIf="showCancel" points="18 15 12 9 6 15"/>
            </svg>
            Cancel this request
          </button>
          <div *ngIf="showCancel" class="cancel-body">
            <p class="cancel-prompt">Please let us know why you'd like to cancel:</p>
            <label *ngFor="let r of cancelReasons" class="radio-row">
              <input type="radio" name="cancelReason" [value]="r" [(ngModel)]="cancelReason" />
              <span>{{ r }}</span>
            </label>
            <app-btn variant="danger" size="sm" [disabled]="!cancelReason" (clicked)="confirmCancel()">Confirm Cancellation</app-btn>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page { min-height: 100vh; background: ${C.bg}; }
    .container { max-width: 680px; margin: 0 auto; padding: 32px; }

    /* ---- Header ---- */
    .header { text-align: center; margin-bottom: 28px; }
    .icon-circle {
      width: 52px; height: 52px; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 14px;
    }
    .title { font-size: 24px; font-weight: 900; color: ${C.g900}; margin: 0 0 6px 0; }
    .subtitle { font-size: 14px; color: ${C.g500}; margin: 0; }

    /* ---- Pipeline ---- */
    .pipeline {
      display: flex; align-items: center; justify-content: center;
      gap: 0; margin-bottom: 32px; padding: 20px 0;
    }
    .pipe-step { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 72px; }
    .pipe-dot {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .pipe-done { background: ${C.green}; }
    .pipe-active { background: ${C.amber100}; position: relative; }
    .pipe-pulse {
      width: 10px; height: 10px; border-radius: 50%;
      background: ${C.amber500}; animation: pulse 2s ease-in-out infinite;
    }
    .pipe-pending { background: ${C.g200}; }
    .pipe-label { font-size: 11px; font-weight: 600; color: ${C.g400}; text-align: center; white-space: nowrap; }
    .pipe-label-active { color: ${C.g700}; }
    .pipe-line { width: 40px; height: 2px; background: ${C.g200}; margin-bottom: 20px; flex-shrink: 0; }
    .pipe-line-done { background: ${C.green}; }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }

    /* ---- Demo bar ---- */
    .demo-bar { display: flex; gap: 6px; justify-content: center; margin-bottom: 24px; flex-wrap: wrap; }
    .demo-toggle {
      background: ${C.g50}; border: 1px dashed ${C.g300}; border-radius: 8px;
      padding: 7px 14px; font-size: 11px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit; transition: all 0.15s;
    }
    .demo-toggle:hover { background: ${C.g100}; color: ${C.g700}; }
    .demo-active { background: ${C.g200}; color: ${C.g700}; border-color: ${C.g400}; }

    .demo-advance {
      background: none; border: 1px dashed ${C.g300};
      border-radius: 6px; padding: 4px 10px; margin-top: 6px;
      font-size: 11px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit;
    }
    .demo-advance:hover { background: ${C.g50}; color: ${C.g700}; }

    .demo-section-btn {
      background: none; border: 1px dashed ${C.g300};
      border-radius: 6px; padding: 4px 10px;
      font-size: 11px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap;
    }
    .demo-section-btn:hover { background: ${C.g50}; color: ${C.g700}; border-color: ${C.g400}; }

    /* ---- Sections (collapsible) ---- */
    .section {
      background: ${C.white}; border: 1px solid ${C.g200};
      border-radius: 16px; margin-bottom: 12px;
      position: relative; overflow: hidden;
      transition: opacity 0.2s, border-color 0.2s;
    }
    .section-locked { opacity: 0.55; pointer-events: none; }
    .section-completed { border-color: ${C.greenMd}; }

    .section-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px; gap: 12px; cursor: pointer;
      transition: background 0.15s;
    }
    .section-header:hover { background: ${C.g50}; }
    .section-locked .section-header { cursor: default; }
    .section-locked .section-header:hover { background: transparent; }

    .sh-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
    .sh-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

    .section-title { font-size: 15px; font-weight: 800; color: ${C.g900}; margin: 0; }
    .section-sub { font-size: 12px; color: ${C.g500}; margin: 2px 0 0; }

    .chevron { transition: transform 0.2s ease; flex-shrink: 0; }
    .chevron-open { transform: rotate(180deg); }

    .section-body { padding: 0 24px 24px; }

    /* ---- IR section special ---- */
    .ir-section { border-color: ${C.amber100}; background: ${C.amber50}; }

    /* ---- Timeline ---- */
    .timeline { padding-left: 4px; }
    .tl-row { display: flex; gap: 14px; min-height: 56px; }
    .tl-track { display: flex; flex-direction: column; align-items: center; width: 24px; flex-shrink: 0; }
    .tl-dot {
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .tl-done { background: ${C.green}; }
    .tl-active { background: ${C.amber100}; position: relative; }
    .tl-pulse {
      width: 8px; height: 8px; border-radius: 50%;
      background: ${C.amber500}; animation: pulse 2s ease-in-out infinite;
    }
    .tl-pending { background: ${C.white}; border: 2px solid ${C.g300}; }
    .tl-line { width: 2px; flex: 1; background: ${C.g200}; min-height: 20px; margin: 4px 0; }
    .tl-line-done { background: ${C.green}; }
    .tl-content { flex: 1; padding-bottom: 20px; }
    .tl-name { font-size: 14px; font-weight: 700; color: ${C.g500}; display: block; }
    .tl-name-done { color: ${C.g800}; }
    .tl-name-active { color: ${C.g900}; }
    .tl-desc { font-size: 12px; color: ${C.g400}; display: block; margin-top: 2px; }
    .tl-sla { font-size: 11px; color: ${C.g400}; display: block; margin-top: 4px; font-style: italic; }
    .tl-admin-tag {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; color: ${C.g400}; margin-top: 4px;
      background: ${C.g50}; padding: 3px 8px; border-radius: 6px;
    }

    /* ---- Alerts ---- */
    .alert-box { display: flex; gap: 12px; padding: 16px; border-radius: 12px; margin-top: 16px; }
    .alert-amber { background: ${C.amber50}; border: 1px solid ${C.amber100}; }
    .alert-red { background: ${C.red50}; border: 1px solid #fecaca; }
    .alert-icon { flex-shrink: 0; padding-top: 2px; }
    .alert-body strong { font-size: 14px; color: ${C.g800}; display: block; }
    .alert-body p { font-size: 13px; color: ${C.g600}; margin: 4px 0 12px; line-height: 1.5; }

    /* ---- Waiting ---- */
    .waiting-box {
      display: flex; gap: 14px; align-items: flex-start;
      padding: 16px; background: ${C.g50}; border-radius: 12px; border: 1px solid ${C.g200};
    }
    .waiting-title { font-size: 14px; font-weight: 700; color: ${C.g700}; display: block; }
    .waiting-sub { font-size: 13px; color: ${C.g500}; display: block; margin-top: 2px; }

    /* ---- Lock overlay ---- */
    .lock-overlay {
      display: flex; align-items: center; justify-content: center;
      gap: 8px; padding: 24px 0; font-size: 13px; font-weight: 600; color: ${C.g400};
    }

    /* ---- Term-sheet ---- */
    .ts-inner { overflow: hidden; }
    .ts-highlight { display: grid; grid-template-columns: 1fr 1fr; }
    .ts-hl-cell { padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .ts-hl-label { font-size: 11px; font-weight: 600; color: ${C.g500}; text-transform: uppercase; letter-spacing: 0.5px; }
    .ts-hl-value { font-size: 24px; font-weight: 900; }
    .ts-details { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 16px 20px 20px; gap: 16px; border-top: 1px solid ${C.g200}; }
    .ts-detail { display: flex; flex-direction: column; gap: 3px; }
    .ts-d-label { font-size: 11px; font-weight: 600; color: ${C.g400}; text-transform: uppercase; letter-spacing: 0.3px; }
    .ts-d-value { font-size: 14px; font-weight: 700; color: ${C.g800}; }
    .ts-actions { display: flex; gap: 10px; margin-top: 16px; align-items: center; }

    /* ---- Accepted ---- */
    .accepted-box { background: ${C.greenLt}; border-radius: 12px; padding: 16px 20px; }
    .accepted-row { display: flex; gap: 12px; align-items: flex-start; }
    .accepted-icon { flex-shrink: 0; padding-top: 2px; }
    .accepted-row strong { font-size: 14px; color: ${C.greenDk}; display: block; }
    .accepted-row p { font-size: 13px; color: ${C.g600}; margin: 4px 0 0; line-height: 1.4; }

    /* ---- Agreements ---- */
    .agreements { display: flex; flex-direction: column; gap: 12px; }
    .ag-top { display: flex; align-items: flex-start; gap: 12px; }
    .ag-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: ${C.g50}; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
    }
    .ag-info { flex: 1; }
    .ag-info strong { font-size: 14px; color: ${C.g800}; display: block; }
    .ag-desc { font-size: 12px; color: ${C.g500}; display: block; margin-top: 2px; }
    .ag-actions { display: flex; gap: 8px; margin-top: 14px; padding-left: 52px; }
    .ag-signed {
      display: flex; align-items: center; gap: 8px;
      margin-top: 12px; padding-left: 52px;
      font-size: 13px; color: ${C.green}; font-weight: 600;
    }

    /* ---- Launch info banner ---- */
    .launch-info-banner {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; background: ${C.blue50}; border-radius: 10px;
      margin-bottom: 16px; font-size: 12px; font-weight: 600; color: ${C.blue500};
    }

    /* ---- Celebration ---- */
    .celebration {
      border-radius: 16px; overflow: hidden; margin-top: 16px;
      background: linear-gradient(135deg, ${C.green} 0%, ${C.greenDk} 100%);
    }
    .celebration-inner { text-align: center; padding: 40px 24px; }
    .celebration-icon {
      width: 60px; height: 60px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }
    .celebration-title { font-size: 22px; font-weight: 900; color: #fff; margin: 0 0 8px 0; }
    .celebration-desc {
      font-size: 14px; color: rgba(255,255,255,0.85);
      margin: 0 0 20px 0; line-height: 1.5;
      max-width: 400px; margin-left: auto; margin-right: auto;
    }

    /* ---- IR ---- */
    .ir-items { display: flex; flex-direction: column; gap: 12px; }
    .ir-item { background: ${C.white}; border: 1px solid ${C.g200}; border-radius: 12px; padding: 16px; }
    .ir-item-header { display: flex; gap: 10px; align-items: flex-start; }
    .ir-type-icon {
      width: 32px; height: 32px; min-width: 32px;
      border-radius: 8px; background: ${C.amber100};
      display: flex; align-items: center; justify-content: center;
    }
    .ir-item-text { flex: 1; }
    .ir-item-title { font-size: 14px; font-weight: 700; color: ${C.g800}; display: block; }
    .ir-item-desc { font-size: 13px; color: ${C.g500}; display: block; margin-top: 2px; line-height: 1.4; }
    .ir-response { margin-top: 12px; padding-left: 42px; }
    .ir-textarea {
      width: 100%; border: 1px solid ${C.g200}; border-radius: 10px;
      padding: 10px 12px; font-size: 13px; font-family: inherit;
      color: ${C.g800}; background: ${C.white}; resize: vertical; outline: none;
      transition: border-color 0.15s;
    }
    .ir-textarea:focus { border-color: ${C.amber500}; }
    .ir-textarea::placeholder { color: ${C.g400}; }
    .ir-upload-box {
      border: 2px dashed ${C.g300}; border-radius: 10px; padding: 20px;
      text-align: center; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      color: ${C.g400}; font-size: 13px; font-weight: 600; transition: all 0.15s;
    }
    .ir-upload-box:hover { border-color: ${C.amber500}; color: ${C.amber600}; background: ${C.amber50}; }
    .ir-uploaded {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 12px; background: ${C.greenLt};
      border-radius: 10px; font-size: 13px; color: ${C.g700};
    }
    .ir-file-name { font-weight: 600; flex: 1; }
    .ir-remove { background: none; border: none; cursor: pointer; font-size: 18px; color: ${C.g400}; padding: 0 4px; font-family: inherit; line-height: 1; }
    .ir-remove:hover { color: ${C.red500}; }
    .ir-attachments { margin-top: 8px; }
    .ir-attach-label { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: ${C.g500}; margin-bottom: 8px; }
    .ir-attach-opt { font-weight: 400; color: ${C.g400}; }
    .ir-attach-file { margin-bottom: 6px; padding: 8px 10px; }
    .ir-add-file {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: 1px dashed ${C.g300}; border-radius: 8px;
      padding: 6px 14px; font-size: 12px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit; transition: all 0.15s;
    }
    .ir-add-file:hover { border-color: ${C.amber500}; color: ${C.amber600}; background: ${C.amber50}; }
    .ir-actions { margin-top: 16px; display: flex; justify-content: flex-end; }
    .ir-confirmed { margin-bottom: 12px; }
    .ir-confirmed-inner {
      display: flex; gap: 12px; align-items: flex-start;
      padding: 16px 20px; background: ${C.greenLt}; border: 1px solid ${C.greenMd}; border-radius: 12px;
    }
    .ir-confirmed-inner strong { font-size: 14px; color: ${C.greenDk}; display: block; }
    .ir-confirmed-inner span { font-size: 13px; color: ${C.g600}; display: block; margin-top: 2px; }

    /* ---- Cancel ---- */
    .cancel-footer { margin-top: 8px; padding: 16px 0 0; text-align: center; }
    .cancel-toggle {
      display: flex; align-items: center; gap: 6px;
      background: none; border: none; cursor: pointer;
      font-size: 13px; font-weight: 600; color: ${C.g500}; font-family: inherit; padding: 0;
    }
    .cancel-toggle:hover { color: ${C.red500}; }
    .cancel-body { margin-top: 12px; padding: 16px; background: ${C.g50}; border-radius: 12px; }
    .cancel-prompt { font-size: 13px; font-weight: 600; color: ${C.g700}; margin: 0 0 12px 0; }
    .radio-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: ${C.g600}; cursor: pointer; padding: 6px 0; }
    .radio-row input[type="radio"] { accent-color: ${C.red500}; cursor: pointer; }
  `]
})
export class SubmittedComponent {
  C = C;

  // --- State ---
  ps = 0;     // project stage progress (0..4)
  cs = 0;     // company stage progress (0..3)
  ls = 0;     // launch stage progress (0..3)
  pReview: 'in_review' | 'approved' | 'rejected' | 'feedback' = 'in_review';
  cReview: 'in_review' | 'approved' | 'rejected' | 'feedback' = 'in_review';
  tsStatus: 'locked' | 'pending' | 'ready' | 'accepted' = 'locked';
  ag1: 'pending' | 'signed' = 'pending';
  ag2: 'pending' | 'signed' = 'pending';
  showCancel = false;
  cancelReason = '';
  expandedSection = 'project-review';
  demoState = 'initial';

  // Information request
  infoRequests: { type: 'clarification' | 'document' | 'information'; title: string; description: string; response: string; fileUploaded: boolean; fileName: string; files: string[] }[] = [];
  infoRequestSubmitted = false;

  // --- Static data ---
  pipelineSteps = ['Review', 'Term-sheet', 'Signing', 'Launch', 'Completed'];

  projectStages = [
    { name: 'Eligibility screening', desc: 'Initial check of project eligibility criteria', sla: '~2 business hours' },
    { name: 'Execution underwriting', desc: 'Detailed assessment of execution plan and milestones', sla: '~4 business hours' },
    { name: 'Exit & market underwriting', desc: 'Market analysis and exit strategy evaluation', sla: '~4 business hours' },
    { name: 'Term-sheet generated', desc: 'Financing terms prepared for review', sla: '' },
  ];

  companyStages = [
    { name: 'Document verification', desc: 'Verification of corporate documents and licenses', sla: '~2 business hours' },
    { name: 'Credit assessment', desc: 'Financial health and creditworthiness evaluation', sla: '~4 business hours' },
    { name: 'Approved', desc: 'Company review complete', sla: '' },
  ];

  launchStages = [
    { name: 'Complete guarantee package', desc: 'Land pledge and promissory notes verification' },
    { name: 'Deal preparation for listing', desc: 'Final deal structuring and listing preparation' },
    { name: 'Deal launch', desc: 'Project goes live on the Safqah platform' },
  ];

  cancelReasons = [
    'Found alternative financing',
    'Project plans changed or cancelled',
    'Terms or timeline don\'t meet my needs',
    'Going with a different provider',
    'Need to update my application details first',
    'Other reason',
  ];

  demoStates = [
    { key: 'initial', label: 'In Review' },
    { key: 'info-request', label: 'Info Request' },
    { key: 'termsheet', label: 'Term-sheet Ready' },
    { key: 'signing', label: 'Signing' },
    { key: 'launch', label: 'Launch Phase' },
    { key: 'completed', label: 'Completed' },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  // --- Derived state ---
  get allReviewsDone(): boolean {
    return this.pReview === 'approved' && this.cReview === 'approved';
  }

  get tsUnlocked(): boolean {
    return this.allReviewsDone;
  }

  get agUnlocked(): boolean {
    return this.tsStatus === 'accepted';
  }

  get allSigned(): boolean {
    return this.ag1 === 'signed' && this.ag2 === 'signed';
  }

  get launchUnlocked(): boolean {
    return this.allSigned;
  }

  get allCompleted(): boolean {
    return this.ls >= this.launchStages.length;
  }

  get pipelineIndex(): number {
    if (this.allCompleted) return 5;
    if (this.launchUnlocked) return 3;
    if (this.agUnlocked) return 2;
    if (this.tsStatus === 'ready' || this.tsStatus === 'accepted') return 1;
    if (this.allReviewsDone) return 1;
    return 0;
  }

  // --- Section toggle ---
  toggleSection(section: string) {
    this.expandedSection = this.expandedSection === section ? '' : section;
  }

  // --- Helpers ---
  reviewBadgeColor(status: string): 'green' | 'amber' | 'red' | 'gray' {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'feedback': return 'amber';
      default: return 'amber';
    }
  }

  reviewBadgeLabel(status: string): string {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'feedback': return 'Feedback Needed';
      default: return 'In Review';
    }
  }

  tsBadgeColor(): 'green' | 'amber' | 'gray' | 'blue' {
    switch (this.tsStatus) {
      case 'accepted': return 'green';
      case 'ready': return 'blue';
      case 'pending': return 'amber';
      default: return 'gray';
    }
  }

  tsBadgeLabel(): string {
    switch (this.tsStatus) {
      case 'accepted': return 'Accepted';
      case 'ready': return 'Ready for Review';
      case 'pending': return 'Preparing';
      default: return 'Locked';
    }
  }

  // --- Actions ---
  advanceProject() {
    if (this.ps < this.projectStages.length) {
      this.ps++;
      if (this.ps >= this.projectStages.length) {
        this.pReview = 'approved';
        this.expandedSection = 'company-review';
        this.syncTermSheet();
      }
    }
  }

  advanceCompany() {
    if (this.cs < this.companyStages.length) {
      this.cs++;
      if (this.cs >= this.companyStages.length) {
        this.cReview = 'approved';
        this.syncTermSheet();
      }
    }
  }

  approveProject() {
    this.ps = this.projectStages.length;
    this.pReview = 'approved';
    this.expandedSection = 'company-review';
    this.syncTermSheet();
  }

  approveCompany() {
    this.cs = this.companyStages.length;
    this.cReview = 'approved';
    this.syncTermSheet();
  }

  signAgreement1() {
    this.ag1 = 'signed';
    if (this.ag1 === 'signed' && this.ag2 === 'signed') {
      this.expandedSection = 'launch';
    }
  }

  signAgreement2() {
    this.ag2 = 'signed';
    if (this.ag1 === 'signed' && this.ag2 === 'signed') {
      this.expandedSection = 'launch';
    }
  }

  advanceLaunch() {
    if (this.ls < this.launchStages.length) {
      this.ls++;
    }
  }

  syncTermSheet() {
    if (this.allReviewsDone && this.tsStatus === 'locked') {
      this.tsStatus = 'pending';
      this.expandedSection = 'termsheet';
      setTimeout(() => {
        if (this.tsStatus === 'pending') { this.tsStatus = 'ready'; }
      }, 800);
    }
  }

  confirmCancel() {
    if (this.cancelReason) { this.go('/dashboard'); }
  }

  // --- Demo state management ---
  setDemoState(key: string) {
    this.demoState = key;
    // Reset everything first
    this.ps = 0; this.cs = 0; this.ls = 0;
    this.pReview = 'in_review'; this.cReview = 'in_review';
    this.tsStatus = 'locked';
    this.ag1 = 'pending'; this.ag2 = 'pending';
    this.showCancel = false; this.cancelReason = '';
    this.infoRequests = []; this.infoRequestSubmitted = false;

    switch (key) {
      case 'initial':
        this.expandedSection = 'project-review';
        break;

      case 'info-request':
        this.simulateInfoRequest();
        this.expandedSection = 'info-request';
        break;

      case 'termsheet':
        this.ps = this.projectStages.length;
        this.cs = this.companyStages.length;
        this.pReview = 'approved';
        this.cReview = 'approved';
        this.tsStatus = 'ready';
        this.expandedSection = 'termsheet';
        break;

      case 'signing':
        this.ps = this.projectStages.length;
        this.cs = this.companyStages.length;
        this.pReview = 'approved';
        this.cReview = 'approved';
        this.tsStatus = 'accepted';
        this.expandedSection = 'agreements';
        break;

      case 'launch':
        this.ps = this.projectStages.length;
        this.cs = this.companyStages.length;
        this.pReview = 'approved';
        this.cReview = 'approved';
        this.tsStatus = 'accepted';
        this.ag1 = 'signed';
        this.ag2 = 'signed';
        this.expandedSection = 'launch';
        break;

      case 'completed':
        this.ps = this.projectStages.length;
        this.cs = this.companyStages.length;
        this.pReview = 'approved';
        this.cReview = 'approved';
        this.tsStatus = 'accepted';
        this.ag1 = 'signed';
        this.ag2 = 'signed';
        this.ls = this.launchStages.length;
        this.expandedSection = 'launch';
        break;
    }
  }

  // --- Information Request ---
  simulateInfoRequest() {
    this.infoRequests = [
      {
        type: 'clarification',
        title: 'Source of equity',
        description: 'Please clarify the source of equity contribution for this project and provide supporting documentation if available.',
        response: '', fileUploaded: false, fileName: '', files: []
      },
      {
        type: 'document',
        title: 'Recent bank statement',
        description: 'Upload a bank statement for the company\'s primary account from the last 3 months.',
        response: '', fileUploaded: false, fileName: '', files: []
      },
      {
        type: 'information',
        title: 'Construction timeline',
        description: 'Provide the expected construction start date and estimated completion date for the project.',
        response: '', fileUploaded: false, fileName: '', files: []
      },
    ];
    this.infoRequestSubmitted = false;
  }

  canSubmitInfoResponse(): boolean {
    return this.infoRequests.every(req => {
      if (req.type === 'document') return req.fileUploaded;
      return req.response.trim().length > 0;
    });
  }

  submitInfoResponse() {
    if (this.canSubmitInfoResponse()) {
      this.infoRequests = [];
      this.infoRequestSubmitted = true;
    }
  }

  resetInfoRequest() {
    this.infoRequests = [];
    this.infoRequestSubmitted = false;
  }

  private fileCounter = 0;
  private mockFileNames = ['supporting_doc.pdf', 'screenshot_evidence.png', 'financial_summary.xlsx', 'contract_copy.pdf', 'site_photo.jpg'];

  addSupportingFile(req: typeof this.infoRequests[0]) {
    const name = this.mockFileNames[this.fileCounter % this.mockFileNames.length];
    req.files.push(name);
    this.fileCounter++;
  }

  removeFile(req: typeof this.infoRequests[0], index: number) {
    req.files.splice(index, 1);
  }

  go(path: string) { this.router.navigateByUrl(path); }
}
