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
          <div class="icon-circle" [style.background]="allLaunched ? '${C.greenLt}' : '${C.amber100}'">
            <!-- Launched: check -->
            <svg *ngIf="allLaunched" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <!-- Default: clock -->
            <svg *ngIf="!allLaunched" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h1 class="title">{{ allLaunched ? 'Project Launched!' : 'Application Status' }}</h1>
          <p class="subtitle">Al Noor Residential &middot; Al Omran Real Estate Dev Co.</p>
        </div>

        <!-- ===================== PIPELINE ===================== -->
        <div class="pipeline">
          <ng-container *ngFor="let step of pipelineSteps; let i = index; let last = last">
            <div class="pipe-step">
              <!-- Done check -->
              <div *ngIf="pipelineIndex > i" class="pipe-dot pipe-done">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <!-- Active dot -->
              <div *ngIf="pipelineIndex === i" class="pipe-dot pipe-active">
                <span class="pipe-pulse"></span>
              </div>
              <!-- Pending dot -->
              <div *ngIf="pipelineIndex < i" class="pipe-dot pipe-pending"></div>
              <span class="pipe-label" [class.pipe-label-active]="pipelineIndex >= i">{{ step }}</span>
            </div>
            <div *ngIf="!last" class="pipe-line" [class.pipe-line-done]="pipelineIndex > i"></div>
          </ng-container>
        </div>

        <!-- Demo ready toggle -->
        <div class="demo-bar">
          <button class="demo-toggle" (click)="toggleReady()">
            {{ ready ? 'Reset to Initial State' : 'Demo: Skip to Term-sheet Ready' }}
          </button>
        </div>

        <!-- ===================== PROJECT REVIEW ===================== -->
        <div class="section">
          <div class="section-header">
            <div>
              <h2 class="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                Project Review
              </h2>
              <p class="section-sub">Al Noor Residential</p>
            </div>
            <div class="badge-row">
              <app-badge [color]="reviewBadgeColor(pReview)">{{ reviewBadgeLabel(pReview) }}</app-badge>
              <button class="cycle-btn" (click)="cycleReview('project')" title="Cycle review status">&#10227;</button>
            </div>
          </div>

          <!-- Project timeline -->
          <div class="timeline">
            <ng-container *ngFor="let stage of projectStages; let i = index; let last = last">
              <div class="tl-row">
                <div class="tl-track">
                  <!-- Done -->
                  <div *ngIf="i < ps" class="tl-dot tl-done">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <!-- Active -->
                  <div *ngIf="i === ps && ps < projectStages.length" class="tl-dot tl-active">
                    <span class="tl-pulse"></span>
                  </div>
                  <!-- Pending -->
                  <div *ngIf="i > ps" class="tl-dot tl-pending"></div>
                  <div *ngIf="!last" class="tl-line" [class.tl-line-done]="i < ps"></div>
                </div>
                <div class="tl-content">
                  <span class="tl-name" [class.tl-name-done]="i < ps" [class.tl-name-active]="i === ps && ps < projectStages.length">{{ stage.name }}</span>
                  <span class="tl-desc" *ngIf="stage.desc">{{ stage.desc }}</span>
                  <span class="tl-sla" *ngIf="stage.sla">{{ stage.sla }}</span>
                  <button *ngIf="i === ps && ps < projectStages.length" class="demo-advance" (click)="advanceProject()">Demo &darr;</button>
                </div>
              </div>
            </ng-container>
          </div>

          <!-- Review alerts -->
          <div *ngIf="pReview === 'feedback'" class="alert-box alert-amber">
            <div class="alert-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div class="alert-body">
              <strong>Additional information needed</strong>
              <p>Our review team has requested more details about the project. Please check your messages and respond to continue.</p>
              <app-btn variant="secondary" size="sm" (clicked)="pReview = 'in_review'">Respond to Feedback</app-btn>
            </div>
          </div>
          <div *ngIf="pReview === 'rejected'" class="alert-box alert-red">
            <div class="alert-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.red500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <div class="alert-body">
              <strong>Project review was not approved</strong>
              <p>The project did not meet eligibility criteria at this time. You may contact support for more details.</p>
            </div>
          </div>
        </div>

        <!-- ===================== COMPANY REVIEW ===================== -->
        <div class="section">
          <div class="section-header">
            <div>
              <h2 class="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Company Review
              </h2>
              <p class="section-sub">Al Omran Real Estate Dev Co.</p>
            </div>
            <div class="badge-row">
              <app-badge [color]="reviewBadgeColor(cReview)">{{ reviewBadgeLabel(cReview) }}</app-badge>
              <button class="cycle-btn" (click)="cycleReview('company')" title="Cycle review status">&#10227;</button>
            </div>
          </div>

          <!-- Company timeline -->
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
                  <button *ngIf="i === cs && cs < companyStages.length" class="demo-advance" (click)="advanceCompany()">Demo &darr;</button>
                </div>
              </div>
            </ng-container>
          </div>

          <!-- Company review alerts -->
          <div *ngIf="cReview === 'feedback'" class="alert-box alert-amber">
            <div class="alert-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.amber600}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div class="alert-body">
              <strong>Additional information needed</strong>
              <p>The review team needs more company documentation. Please respond to continue.</p>
              <app-btn variant="secondary" size="sm" (clicked)="cReview = 'in_review'">Respond to Feedback</app-btn>
            </div>
          </div>
          <div *ngIf="cReview === 'rejected'" class="alert-box alert-red">
            <div class="alert-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.red500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <div class="alert-body">
              <strong>Company review was not approved</strong>
              <p>The company did not meet the required criteria. Contact support for further assistance.</p>
            </div>
          </div>
        </div>

        <!-- ===================== SUBMIT / CANCEL ===================== -->
        <div *ngIf="!ready && tsStatus !== 'accepted'" class="section">
          <!-- All reviews approved: submit -->
          <div *ngIf="allReviewsDone" class="submit-box">
            <div class="submit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 class="submit-title">All reviews are complete</h3>
            <p class="submit-desc">Both project and company reviews have been approved. You may now submit your request to proceed.</p>
            <label class="checkbox-row">
              <input type="checkbox" [(ngModel)]="accuracy" />
              <span>I confirm all information provided is accurate and complete</span>
            </label>
            <app-btn variant="primary" size="md" [disabled]="!accuracy" (clicked)="submitRequest()">Submit Request &rarr;</app-btn>
          </div>

          <!-- Reviews pending: waiting -->
          <div *ngIf="!allReviewsDone" class="waiting-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div>
              <span class="waiting-title">Awaiting review completion</span>
              <span class="waiting-sub">Both project and company reviews must be approved before you can proceed.</span>
            </div>
          </div>

          <!-- Cancel request -->
          <div class="cancel-section">
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

        <!-- ===================== TERM-SHEET ===================== -->
        <div class="section" [class.section-locked]="!tsUnlocked">
          <div class="section-header">
            <h2 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Term-sheet
            </h2>
            <app-badge *ngIf="tsUnlocked" [color]="tsBadgeColor()">{{ tsBadgeLabel() }}</app-badge>
          </div>

          <!-- Lock overlay -->
          <div *ngIf="!tsUnlocked" class="lock-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Unlocks after review</span>
          </div>

          <!-- Term-sheet content when unlocked -->
          <div *ngIf="tsUnlocked && tsStatus !== 'accepted'">
            <!-- Term-sheet summary card -->
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
              <app-btn variant="primary" size="sm" (clicked)="tsStatus = 'accepted'">Demo: Accept &rarr;</app-btn>
            </div>
            <div *ngIf="tsStatus === 'pending'" class="waiting-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div>
                <span class="waiting-title">Term-sheet is being prepared</span>
                <span class="waiting-sub">You will be notified when your term-sheet is ready for review.</span>
              </div>
            </div>
          </div>

          <!-- Term-sheet accepted -->
          <div *ngIf="tsUnlocked && tsStatus === 'accepted'" class="accepted-box">
            <div class="accepted-row">
              <div class="accepted-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <strong>Term-sheet accepted</strong>
                <p>You accepted the financing term-sheet on March 9, 2026. Proceeding to agreements.</p>
              </div>
            </div>
            <button class="demo-advance" (click)="tsStatus = 'ready'">Demo: Reset</button>
          </div>
        </div>

        <!-- ===================== AGREEMENT SIGNING ===================== -->
        <div class="section" [class.section-locked]="!agUnlocked">
          <div class="section-header">
            <h2 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Agreement Signing
            </h2>
            <app-badge *ngIf="agUnlocked" [color]="allSigned ? 'green' : 'amber'">{{ allSigned ? 'Completed' : 'Awaiting Signatures' }}</app-badge>
          </div>

          <div *ngIf="!agUnlocked" class="lock-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Unlocks after term-sheet acceptance</span>
          </div>

          <div *ngIf="agUnlocked" class="agreements">
            <!-- Agreement 1 -->
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
                  <app-btn variant="primary" size="sm" (clicked)="ag1 = 'signed'">Sign Agreement</app-btn>
                  <app-btn variant="ghost" size="sm" (clicked)="go('/application/1/term-sheet')">Preview</app-btn>
                </div>
                <div *ngIf="ag1 === 'signed'" class="ag-signed">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Signed on March 9, 2026</span>
                  <button class="demo-advance" style="margin-left:auto" (click)="ag1 = 'pending'">Demo: Reset</button>
                </div>
              </div>
            </app-card>

            <!-- Agreement 2 -->
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
                  <app-btn variant="primary" size="sm" (clicked)="ag2 = 'signed'">Sign Agreement</app-btn>
                  <app-btn variant="ghost" size="sm" (clicked)="go('/application/1/term-sheet')">Preview</app-btn>
                </div>
                <div *ngIf="ag2 === 'signed'" class="ag-signed">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Signed on March 9, 2026</span>
                  <button class="demo-advance" style="margin-left:auto" (click)="ag2 = 'pending'">Demo: Reset</button>
                </div>
              </div>
            </app-card>
          </div>
        </div>

        <!-- ===================== READY TO LAUNCH ===================== -->
        <div class="section" [class.section-locked]="!launchUnlocked">
          <div class="section-header">
            <h2 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Ready to Launch
            </h2>
            <app-badge *ngIf="launchUnlocked" [color]="allLaunched ? 'green' : 'amber'">{{ allLaunched ? 'All Approved' : 'In Progress' }}</app-badge>
          </div>

          <div *ngIf="!launchUnlocked" class="lock-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Unlocks after agreements are signed</span>
          </div>

          <div *ngIf="launchUnlocked && !allLaunched" class="launch-items">
            <!-- Deal Prospect Review -->
            <app-card [padding]="20">
              <div class="launch-card">
                <div class="launch-top">
                  <div>
                    <strong>Deal Prospect Review</strong>
                    <span class="launch-desc">Final internal review of the financing prospect</span>
                  </div>
                  <app-badge [color]="launchProspect === 'approved' ? 'green' : 'gray'">{{ launchProspect === 'approved' ? 'Approved' : 'Pending' }}</app-badge>
                </div>
                <div *ngIf="launchProspect === 'pending'" class="launch-actions">
                  <app-btn variant="primary" size="sm" (clicked)="launchProspect = 'approved'">Demo: Approve</app-btn>
                  <app-btn variant="ghost" size="sm">Preview</app-btn>
                </div>
                <div *ngIf="launchProspect === 'approved'" class="ag-signed">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Approved</span>
                  <button class="demo-advance" style="margin-left:auto" (click)="launchProspect = 'pending'">Demo: Reset</button>
                </div>
              </div>
            </app-card>

            <!-- Marketing Material Review -->
            <app-card [padding]="20">
              <div class="launch-card">
                <div class="launch-top">
                  <div>
                    <strong>Marketing Material Review</strong>
                    <span class="launch-desc">Review and approval of marketing collateral</span>
                  </div>
                  <app-badge [color]="launchMarketing === 'approved' ? 'green' : 'gray'">{{ launchMarketing === 'approved' ? 'Approved' : 'Pending' }}</app-badge>
                </div>
                <div *ngIf="launchMarketing === 'pending'" class="launch-actions">
                  <app-btn variant="primary" size="sm" (clicked)="launchMarketing = 'approved'">Demo: Approve</app-btn>
                  <app-btn variant="ghost" size="sm">Preview</app-btn>
                </div>
                <div *ngIf="launchMarketing === 'approved'" class="ag-signed">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Approved</span>
                  <button class="demo-advance" style="margin-left:auto" (click)="launchMarketing = 'pending'">Demo: Reset</button>
                </div>
              </div>
            </app-card>
          </div>

          <!-- All launched celebration -->
          <div *ngIf="launchUnlocked && allLaunched" class="celebration">
            <div class="celebration-inner">
              <div class="celebration-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 class="celebration-title">Project Launched!</h3>
              <p class="celebration-desc">Al Noor Residential is now live on the Safqah platform. Investors can begin participating in this financing opportunity.</p>
              <app-btn variant="secondary" size="md" (clicked)="go('/dashboard')">Back to Dashboard</app-btn>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page {
      min-height: 100vh;
      background: ${C.bg};
    }

    .container {
      max-width: 680px;
      margin: 0 auto;
      padding: 32px;
    }

    /* ---- Header ---- */
    .header {
      text-align: center;
      margin-bottom: 28px;
    }

    .icon-circle {
      width: 52px; height: 52px; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 14px;
    }

    .title {
      font-size: 24px; font-weight: 900; color: ${C.g900};
      margin: 0 0 6px 0;
    }

    .subtitle {
      font-size: 14px; color: ${C.g500}; margin: 0;
    }

    /* ---- Pipeline ---- */
    .pipeline {
      display: flex; align-items: center; justify-content: center;
      gap: 0; margin-bottom: 32px; padding: 20px 0;
    }

    .pipe-step {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      min-width: 72px;
    }

    .pipe-dot {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .pipe-done { background: ${C.green}; }
    .pipe-active {
      background: ${C.amber100}; position: relative;
    }
    .pipe-pulse {
      width: 10px; height: 10px; border-radius: 50%;
      background: ${C.amber500};
      animation: pulse 2s ease-in-out infinite;
    }
    .pipe-pending { background: ${C.g200}; }

    .pipe-label {
      font-size: 11px; font-weight: 600; color: ${C.g400};
      text-align: center; white-space: nowrap;
    }
    .pipe-label-active { color: ${C.g700}; }

    .pipe-line {
      width: 40px; height: 2px; background: ${C.g200};
      margin-bottom: 20px; flex-shrink: 0;
    }
    .pipe-line-done { background: ${C.green}; }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }

    /* ---- Sections ---- */
    .section {
      background: ${C.white}; border: 1px solid ${C.g200};
      border-radius: 16px; padding: 24px; margin-bottom: 16px;
      position: relative; overflow: hidden;
    }

    .section-locked {
      opacity: 0.55; pointer-events: none;
    }

    .section-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 20px; gap: 12px;
    }

    .section-title {
      font-size: 16px; font-weight: 800; color: ${C.g900};
      margin: 0; display: flex; align-items: center; gap: 8px;
    }

    .section-sub {
      font-size: 13px; color: ${C.g500}; margin: 4px 0 0 26px;
    }

    .badge-row {
      display: flex; align-items: center; gap: 8px; flex-shrink: 0;
    }

    .cycle-btn {
      width: 28px; height: 28px; border-radius: 50%;
      border: 1px solid ${C.g200}; background: ${C.g50};
      cursor: pointer; font-size: 16px; color: ${C.g500};
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .cycle-btn:hover { background: ${C.g100}; color: ${C.g700}; }

    /* ---- Timeline ---- */
    .timeline { padding-left: 4px; }

    .tl-row {
      display: flex; gap: 14px; min-height: 56px;
    }

    .tl-track {
      display: flex; flex-direction: column; align-items: center;
      width: 24px; flex-shrink: 0;
    }

    .tl-dot {
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .tl-done { background: ${C.green}; }
    .tl-active {
      background: ${C.amber100}; position: relative;
    }
    .tl-pulse {
      width: 8px; height: 8px; border-radius: 50%;
      background: ${C.amber500};
      animation: pulse 2s ease-in-out infinite;
    }
    .tl-pending {
      background: ${C.white}; border: 2px solid ${C.g300};
    }

    .tl-line {
      width: 2px; flex: 1; background: ${C.g200};
      min-height: 20px; margin: 4px 0;
    }
    .tl-line-done { background: ${C.green}; }

    .tl-content {
      flex: 1; padding-bottom: 20px;
    }

    .tl-name {
      font-size: 14px; font-weight: 700; color: ${C.g500};
      display: block;
    }
    .tl-name-done { color: ${C.g800}; }
    .tl-name-active { color: ${C.g900}; }

    .tl-desc {
      font-size: 12px; color: ${C.g400}; display: block; margin-top: 2px;
    }

    .tl-sla {
      font-size: 11px; color: ${C.g400}; display: block; margin-top: 4px;
      font-style: italic;
    }

    /* ---- Demo buttons ---- */
    .demo-bar {
      text-align: center; margin-bottom: 24px;
    }

    .demo-toggle {
      background: ${C.g50}; border: 1px dashed ${C.g300};
      border-radius: 8px; padding: 8px 16px;
      font-size: 12px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit;
      transition: all 0.15s;
    }
    .demo-toggle:hover { background: ${C.g100}; color: ${C.g700}; }

    .demo-advance {
      background: none; border: 1px dashed ${C.g300};
      border-radius: 6px; padding: 4px 10px; margin-top: 6px;
      font-size: 11px; font-weight: 600; color: ${C.g500};
      cursor: pointer; font-family: inherit;
    }
    .demo-advance:hover { background: ${C.g50}; color: ${C.g700}; }

    /* ---- Alerts ---- */
    .alert-box {
      display: flex; gap: 12px; padding: 16px;
      border-radius: 12px; margin-top: 16px;
    }

    .alert-amber {
      background: ${C.amber50}; border: 1px solid ${C.amber100};
    }

    .alert-red {
      background: ${C.red50}; border: 1px solid #fecaca;
    }

    .alert-icon { flex-shrink: 0; padding-top: 2px; }

    .alert-body strong {
      font-size: 14px; color: ${C.g800}; display: block;
    }

    .alert-body p {
      font-size: 13px; color: ${C.g600}; margin: 4px 0 12px;
      line-height: 1.5;
    }

    /* ---- Submit/Waiting ---- */
    .submit-box {
      text-align: center; padding: 8px 0;
    }

    .submit-icon { margin-bottom: 12px; }

    .submit-title {
      font-size: 16px; font-weight: 800; color: ${C.g900};
      margin: 0 0 6px 0;
    }

    .submit-desc {
      font-size: 13px; color: ${C.g500}; margin: 0 0 16px 0;
      line-height: 1.5;
    }

    .checkbox-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: ${C.g600}; cursor: pointer;
      margin-bottom: 16px; justify-content: center;
    }

    .checkbox-row input[type="checkbox"] {
      width: 16px; height: 16px; accent-color: ${C.green};
      cursor: pointer;
    }

    .waiting-box {
      display: flex; gap: 14px; align-items: flex-start;
      padding: 16px; background: ${C.g50}; border-radius: 12px;
      border: 1px solid ${C.g200};
    }

    .waiting-title {
      font-size: 14px; font-weight: 700; color: ${C.g700};
      display: block;
    }

    .waiting-sub {
      font-size: 13px; color: ${C.g500}; display: block; margin-top: 2px;
    }

    /* ---- Cancel ---- */
    .cancel-section {
      margin-top: 20px; border-top: 1px solid ${C.g200};
      padding-top: 16px;
    }

    .cancel-toggle {
      display: flex; align-items: center; gap: 6px;
      background: none; border: none; cursor: pointer;
      font-size: 13px; font-weight: 600; color: ${C.g500};
      font-family: inherit; padding: 0;
    }
    .cancel-toggle:hover { color: ${C.red500}; }

    .cancel-body {
      margin-top: 12px; padding: 16px;
      background: ${C.g50}; border-radius: 12px;
    }

    .cancel-prompt {
      font-size: 13px; font-weight: 600; color: ${C.g700};
      margin: 0 0 12px 0;
    }

    .radio-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: ${C.g600}; cursor: pointer;
      padding: 6px 0;
    }

    .radio-row input[type="radio"] {
      accent-color: ${C.red500}; cursor: pointer;
    }

    /* ---- Lock overlay ---- */
    .lock-overlay {
      display: flex; align-items: center; justify-content: center;
      gap: 8px; padding: 32px 0;
      font-size: 13px; font-weight: 600; color: ${C.g400};
    }

    /* ---- Term-sheet ---- */
    .ts-inner { overflow: hidden; }

    .ts-highlight {
      display: grid; grid-template-columns: 1fr 1fr;
    }

    .ts-hl-cell {
      padding: 20px;
      display: flex; flex-direction: column; align-items: center; gap: 4px;
    }

    .ts-hl-label {
      font-size: 11px; font-weight: 600; color: ${C.g500};
      text-transform: uppercase; letter-spacing: 0.5px;
    }

    .ts-hl-value {
      font-size: 24px; font-weight: 900;
    }

    .ts-details {
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      padding: 16px 20px 20px; gap: 16px;
      border-top: 1px solid ${C.g200};
    }

    .ts-detail {
      display: flex; flex-direction: column; gap: 3px;
    }

    .ts-d-label {
      font-size: 11px; font-weight: 600; color: ${C.g400};
      text-transform: uppercase; letter-spacing: 0.3px;
    }

    .ts-d-value {
      font-size: 14px; font-weight: 700; color: ${C.g800};
    }

    .ts-actions {
      display: flex; gap: 10px; margin-top: 16px; align-items: center;
    }

    /* ---- Accepted ---- */
    .accepted-box {
      background: ${C.greenLt}; border-radius: 12px;
      padding: 16px 20px;
    }

    .accepted-row {
      display: flex; gap: 12px; align-items: flex-start;
    }

    .accepted-icon { flex-shrink: 0; padding-top: 2px; }

    .accepted-row strong {
      font-size: 14px; color: ${C.greenDk}; display: block;
    }

    .accepted-row p {
      font-size: 13px; color: ${C.g600}; margin: 4px 0 0;
      line-height: 1.4;
    }

    /* ---- Agreements ---- */
    .agreements {
      display: flex; flex-direction: column; gap: 12px;
    }

    .ag-card {}

    .ag-top {
      display: flex; align-items: flex-start; gap: 12px;
    }

    .ag-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: ${C.g50}; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
    }

    .ag-info {
      flex: 1;
    }

    .ag-info strong {
      font-size: 14px; color: ${C.g800}; display: block;
    }

    .ag-desc {
      font-size: 12px; color: ${C.g500}; display: block; margin-top: 2px;
    }

    .ag-actions {
      display: flex; gap: 8px; margin-top: 14px; padding-left: 52px;
    }

    .ag-signed {
      display: flex; align-items: center; gap: 8px;
      margin-top: 12px; padding-left: 52px;
      font-size: 13px; color: ${C.green}; font-weight: 600;
    }

    /* ---- Launch ---- */
    .launch-items {
      display: flex; flex-direction: column; gap: 12px;
    }

    .launch-card {}

    .launch-top {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
    }

    .launch-top strong {
      font-size: 14px; color: ${C.g800}; display: block;
    }

    .launch-desc {
      font-size: 12px; color: ${C.g500}; display: block; margin-top: 2px;
    }

    .launch-actions {
      display: flex; gap: 8px; margin-top: 14px;
    }

    /* ---- Celebration ---- */
    .celebration {
      border-radius: 16px; overflow: hidden;
      background: linear-gradient(135deg, ${C.green} 0%, ${C.greenDk} 100%);
    }

    .celebration-inner {
      text-align: center; padding: 40px 24px;
    }

    .celebration-icon {
      width: 60px; height: 60px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }

    .celebration-title {
      font-size: 22px; font-weight: 900; color: #fff;
      margin: 0 0 8px 0;
    }

    .celebration-desc {
      font-size: 14px; color: rgba(255,255,255,0.85);
      margin: 0 0 20px 0; line-height: 1.5;
      max-width: 400px; margin-left: auto; margin-right: auto;
    }
  `]
})
export class SubmittedComponent {
  C = C;

  // --- State ---
  ps = 0;     // project stage progress (0..4)
  cs = 0;     // company stage progress (0..3)
  pReview: 'in_review' | 'approved' | 'rejected' | 'feedback' = 'in_review';
  cReview: 'in_review' | 'approved' | 'rejected' | 'feedback' = 'in_review';
  tsStatus: 'locked' | 'pending' | 'ready' | 'accepted' = 'locked';
  ag1: 'pending' | 'signed' = 'pending';
  ag2: 'pending' | 'signed' = 'pending';
  launchProspect: 'pending' | 'approved' = 'pending';
  launchMarketing: 'pending' | 'approved' = 'pending';
  showCancel = false;
  cancelReason = '';
  accuracy = false;
  ready = false;

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

  cancelReasons = [
    'Found alternative financing',
    'Project plans changed or cancelled',
    'Terms or timeline don\'t meet my needs',
    'Going with a different provider',
    'Need to update my application details first',
    'Other reason',
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

  get allLaunched(): boolean {
    return this.launchProspect === 'approved' && this.launchMarketing === 'approved';
  }

  get pipelineIndex(): number {
    if (this.allLaunched) return 5;
    if (this.launchUnlocked) return 3;
    if (this.agUnlocked) return 2;
    if (this.tsStatus === 'ready' || this.tsStatus === 'accepted') return 1;
    if (this.allReviewsDone) return 1;
    return 0;
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
  cycleReview(type: 'project' | 'company') {
    const order: Array<'in_review' | 'approved' | 'rejected' | 'feedback'> = ['in_review', 'approved', 'rejected', 'feedback'];
    if (type === 'project') {
      const idx = order.indexOf(this.pReview);
      this.pReview = order[(idx + 1) % order.length];
      if (this.pReview === 'approved') { this.ps = this.projectStages.length; }
    } else {
      const idx = order.indexOf(this.cReview);
      this.cReview = order[(idx + 1) % order.length];
      if (this.cReview === 'approved') { this.cs = this.companyStages.length; }
    }
    this.syncTermSheet();
  }

  advanceProject() {
    if (this.ps < this.projectStages.length) {
      this.ps++;
      if (this.ps >= this.projectStages.length) {
        this.pReview = 'approved';
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

  syncTermSheet() {
    if (this.allReviewsDone && this.tsStatus === 'locked') {
      this.tsStatus = 'pending';
      // Auto-advance to ready after a moment in a real app; here we set ready
      setTimeout(() => {
        if (this.tsStatus === 'pending') { this.tsStatus = 'ready'; }
      }, 800);
    }
  }

  submitRequest() {
    if (this.accuracy && this.allReviewsDone) {
      this.tsStatus = 'ready';
      this.ready = true;
    }
  }

  confirmCancel() {
    if (this.cancelReason) {
      this.go('/dashboard');
    }
  }

  toggleReady() {
    if (!this.ready) {
      // Skip to ready state
      this.ps = this.projectStages.length;
      this.cs = this.companyStages.length;
      this.pReview = 'approved';
      this.cReview = 'approved';
      this.tsStatus = 'ready';
      this.ready = true;
    } else {
      // Reset all
      this.ps = 0;
      this.cs = 0;
      this.pReview = 'in_review';
      this.cReview = 'in_review';
      this.tsStatus = 'locked';
      this.ag1 = 'pending';
      this.ag2 = 'pending';
      this.launchProspect = 'pending';
      this.launchMarketing = 'pending';
      this.showCancel = false;
      this.cancelReason = '';
      this.accuracy = false;
      this.ready = false;
    }
  }

  go(path: string) { this.router.navigateByUrl(path); }
}
