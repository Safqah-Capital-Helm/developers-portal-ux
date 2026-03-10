import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import { NavComponent, ButtonComponent, CardComponent, BadgeComponent, ModalComponent, InputComponent } from '../../shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent, ButtonComponent, CardComponent, BadgeComponent, ModalComponent, InputComponent],
  template: `
    <div class="page">
      <app-nav></app-nav>

      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1 class="header-title">Welcome back, Ahmed</h1>
          <p class="header-sub">Manage your companies, projects, and team from one place.</p>
        </div>

        <!-- 2-column grid -->
        <div class="grid">

          <!-- ============ LEFT COLUMN ============ -->
          <div class="left-col">

            <!-- Companies Section -->
            <div class="section">
              <div class="section-header">
                <div class="section-icon" [style.background]="C.blue50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
                    <line x1="9" y1="9" x2="9" y2="9.01"/><line x1="9" y1="13" x2="9" y2="13.01"/><line x1="9" y1="17" x2="9" y2="17.01"/>
                  </svg>
                </div>
                <span class="section-title">Companies</span>
                <span class="section-count">{{ companies.length }}</span>
              </div>

              <div *ngFor="let co of companies" class="company-card" [style.border-left-color]="borderColor(co.sc)" (click)="openCompanyModal(co)">
                <div class="company-top">
                  <span class="company-name">{{ co.name }}</span>
                  <app-badge [color]="$any(co.sc)">{{ co.status }}</app-badge>
                </div>
                <div class="company-cr">CR: {{ co.cr }}</div>
                <div class="company-meta">
                  <span class="meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7l2 2h9v16H3z"/></svg>
                    {{ co.proj }} projects
                  </span>
                  <span class="meta-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                    {{ co.mem }} members
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

              <div *ngFor="let m of team" class="member-card" (click)="openMemberModal(m)">
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

              <div class="dashed-btn" (click)="openInviteModal()">
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
                <span class="section-count">{{ filteredProjects.length }}<span *ngIf="isFiltered"> / {{ projects.length }}</span></span>
              </div>

              <!-- Filters -->
              <div class="filter-bar">
                <div class="filter-group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                  <select class="filter-select" [(ngModel)]="filterCompany">
                    <option value="">All Companies</option>
                    <option *ngFor="let c of uniqueCompanies" [value]="c">{{ c }}</option>
                  </select>
                </div>
                <div class="filter-group">
                  <select class="filter-select" [(ngModel)]="filterStatus">
                    <option value="">All Statuses</option>
                    <option *ngFor="let s of uniqueStatuses" [value]="s">{{ s }}</option>
                  </select>
                </div>
                <button *ngIf="isFiltered" class="filter-clear" (click)="filterCompany = ''; filterStatus = ''">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Clear
                </button>
              </div>

              <div *ngFor="let p of filteredProjects"
                   class="project-card"
                   [class.draft]="p.sc === 'gray'"
                   [class.dead]="p.sc === 'red'"
                   [style.border-left-color]="borderColor(p.sc)"
                   (click)="onProjectClick(p)">

                <div class="proj-top">
                  <span class="proj-name">{{ p.name }}</span>
                  <app-badge [color]="p.sc">{{ p.status }}</app-badge>
                </div>

                <div class="proj-sub">
                  <span>{{ p.compShort }}</span>
                  <span class="proj-dot">&#183;</span>
                  <span>{{ p.type }}</span>
                  <span class="proj-dot">&#183;</span>
                  <span>{{ p.loc }}</span>
                </div>

                <div class="proj-grid">
                  <div class="proj-cell">
                    <div class="cell-label">Total Cost</div>
                    <div class="cell-value">{{ p.cost }}</div>
                  </div>
                  <div class="proj-cell">
                    <div class="cell-label">Financing</div>
                    <div class="cell-value">{{ p.fin }}</div>
                  </div>
                  <div class="proj-cell">
                    <div class="cell-label">Product</div>
                    <div class="cell-value">{{ p.prod }}</div>
                  </div>
                  <div class="proj-cell">
                    <div class="cell-label">Submitted</div>
                    <div class="cell-value">{{ p.submitted || '\u2014' }}</div>
                  </div>
                  <div class="proj-cell">
                    <div class="cell-label">Accepted</div>
                    <div class="cell-value">{{ p.accepted || '\u2014' }}</div>
                  </div>
                  <div class="proj-cell">
                    <div class="cell-label">Signed</div>
                    <div class="cell-value">{{ p.signed || '\u2014' }}</div>
                  </div>
                </div>

                <div *ngIf="p.sc === 'gray'" class="proj-cta" (click)="$event.stopPropagation(); go(p.route)">
                  <app-badge color="green">Continue setup &rarr;</app-badge>
                </div>
              </div>

              <!-- New project dashed button -->
              <div class="dashed-btn project-dashed" (click)="go('/project/new')">
                <div class="project-dashed-inner">
                  <div class="project-dashed-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </div>
                  <div>
                    <div class="project-dashed-title">Create a new project</div>
                    <div class="project-dashed-sub">Start a financing application for a new development</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <!-- Referral prompt (one-time) -->
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

      <!-- ============ COMPANY DETAIL MODAL ============ -->
      <app-modal *ngIf="showCompanyModal && selectedCompany" [title]="selectedCompany.name" [wide]="true" (closed)="showCompanyModal = false">
        <!-- Status header -->
        <div class="modal-status-header" [style.background]="borderColor(selectedCompany.sc)" [style.border-radius]="'12px'">
          <div class="modal-status-row">
            <div>
              <div class="modal-status-label">Status</div>
              <div class="modal-status-value">{{ selectedCompany.status }}</div>
            </div>
            <div>
              <div class="modal-status-label">CR Number</div>
              <div class="modal-status-value">{{ selectedCompany.cr }}</div>
            </div>
            <div>
              <div class="modal-status-label">Projects</div>
              <div class="modal-status-value">{{ selectedCompany.proj }}</div>
            </div>
            <div>
              <div class="modal-status-label">Members</div>
              <div class="modal-status-value">{{ selectedCompany.mem }}</div>
            </div>
          </div>
        </div>

        <!-- Company projects -->
        <div class="modal-section-title">Projects</div>
        <div *ngFor="let p of getCompanyProjects(selectedCompany.name)" class="modal-list-item">
          <div class="modal-list-left">
            <span class="modal-list-name">{{ p.name }}</span>
            <span class="modal-list-sub">{{ p.type }} &middot; {{ p.loc }}</span>
          </div>
          <app-badge [color]="p.sc">{{ p.status }}</app-badge>
        </div>
        <div *ngIf="getCompanyProjects(selectedCompany.name).length === 0" class="modal-empty">No projects yet.</div>

        <!-- Company members -->
        <div class="modal-section-title" style="margin-top: 20px;">Members</div>
        <div *ngFor="let m of team" class="modal-list-item">
          <div class="modal-list-left" style="display: flex; align-items: center; gap: 10px;">
            <div class="mini-avatar" [style.background]="C.greenLt" [style.color]="C.green">{{ m.name.charAt(0) }}</div>
            <div>
              <span class="modal-list-name">{{ m.name }}</span>
              <span class="modal-list-sub">{{ m.email }}</span>
            </div>
          </div>
          <app-badge [color]="roleBadgeColor(m.role)">{{ m.role }}</app-badge>
        </div>
      </app-modal>

      <!-- ============ MEMBER DETAIL MODAL ============ -->
      <app-modal *ngIf="showMemberModal && selectedMember" [title]="selectedMember.name" [wide]="true" (closed)="showMemberModal = false">
        <div class="member-modal-top">
          <div class="member-modal-avatar" [style.background]="C.greenLt" [style.color]="C.green">
            {{ selectedMember.name.charAt(0) }}
          </div>
          <div class="member-modal-info">
            <div class="member-modal-name">{{ selectedMember.name }} <span *ngIf="selectedMember.you" class="you-tag">(you)</span></div>
            <div class="member-modal-email">{{ selectedMember.email }}</div>
            <div class="member-modal-detail">Phone: +966 50 123 4567</div>
            <div class="member-modal-detail">Joined: Jan 15, 2026</div>
            <div class="member-modal-detail">Current role: <strong>{{ selectedMember.role }}</strong></div>
          </div>
        </div>

        <!-- Role selector -->
        <div class="modal-section-title">Role</div>
        <div class="role-grid">
          <div *ngFor="let r of roles" class="role-option"
               [class.selected]="memberEditRole === r"
               (click)="memberEditRole = r">
            <div class="role-option-radio">
              <div *ngIf="memberEditRole === r" class="role-option-dot"></div>
            </div>
            {{ r }}
          </div>
        </div>

        <!-- Linked companies -->
        <div class="modal-section-title" style="margin-top: 20px;">Linked Companies</div>
        <div *ngFor="let co of companies; let i = index" class="checkbox-row">
          <input type="checkbox" [id]="'co-check-' + i" [(ngModel)]="memberCompanyAccess[i]" />
          <label [for]="'co-check-' + i">{{ co.name }}</label>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <app-btn variant="primary" size="sm" (clicked)="showMemberModal = false">Save Changes</app-btn>
          <app-btn *ngIf="!selectedMember.you" variant="dangerOutline" size="sm" (clicked)="showMemberModal = false">Remove Member</app-btn>
        </div>
      </app-modal>

      <!-- ============ INVITE MODAL ============ -->
      <app-modal *ngIf="showInviteModal" title="Invite Team Member" (closed)="showInviteModal = false; inviteSent = false">
        <div *ngIf="!inviteSent">
          <app-input label="Full Name" placeholder="e.g. Omar Al-Harbi" [(value)]="inviteName"></app-input>
          <app-input label="Email Address" placeholder="e.g. omar@company.com" [(value)]="inviteEmail"></app-input>

          <div class="modal-section-title">Role</div>
          <div class="role-grid">
            <div *ngFor="let r of roles" class="role-option"
                 [class.selected]="inviteRole === r"
                 (click)="inviteRole = r">
              <div class="role-option-radio">
                <div *ngIf="inviteRole === r" class="role-option-dot"></div>
              </div>
              {{ r }}
            </div>
          </div>

          <div class="modal-section-title" style="margin-top: 20px;">Company Access</div>
          <div *ngFor="let co of companies; let i = index" class="checkbox-row">
            <input type="checkbox" [id]="'inv-co-' + i" [(ngModel)]="inviteCompanyAccess[i]" />
            <label [for]="'inv-co-' + i">{{ co.name }}</label>
          </div>

          <div style="margin-top: 24px;">
            <app-btn variant="primary" [full]="true" (clicked)="sendInvite()">Send Invitation</app-btn>
          </div>
        </div>

        <!-- Success state -->
        <div *ngIf="inviteSent" class="invite-success">
          <div class="invite-success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="invite-success-title">Invitation Sent!</div>
          <div class="invite-success-sub">An invitation has been sent to {{ inviteEmail }}. They will receive an email with instructions to join.</div>
          <div style="margin-top: 20px;">
            <app-btn variant="secondary" (clicked)="showInviteModal = false; inviteSent = false">Close</app-btn>
          </div>
        </div>
      </app-modal>

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

    /* Filter bar */
    .filter-bar {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 14px; flex-wrap: wrap;
    }

    .filter-group {
      display: flex; align-items: center; gap: 6px;
      position: relative;
    }

    .filter-select {
      appearance: none;
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-radius: 8px;
      padding: 6px 28px 6px 10px;
      font-size: 12px; font-weight: 600;
      color: ${C.g700};
      font-family: inherit;
      cursor: pointer;
      outline: none;
      transition: border-color 0.15s;
      background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }
    .filter-select:hover { border-color: ${C.g300}; }
    .filter-select:focus { border-color: ${C.green}; }

    .filter-clear {
      display: inline-flex; align-items: center; gap: 4px;
      background: none; border: none;
      font-size: 11px; font-weight: 700;
      color: ${C.g400}; cursor: pointer;
      font-family: inherit; padding: 4px 6px;
      border-radius: 6px;
      transition: all 0.15s;
    }
    .filter-clear:hover { color: ${C.red500}; background: ${C.red50}; }

    /* Company cards */
    .company-card {
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g300};
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: box-shadow 0.2s, border-color 0.2s;
    }
    .company-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.07);
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
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
    .member-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.07);
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

    /* Project cards */
    .project-card {
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-left: 3.5px solid ${C.g300};
      border-radius: 16px;
      padding: 18px 20px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
    .project-card:hover {
      box-shadow: 0 6px 24px rgba(0,0,0,0.08);
    }
    .project-card.draft {
      border-style: dashed;
      border-width: 2px;
      border-left-width: 3.5px;
      cursor: default;
    }
    .project-card.draft:hover {
      box-shadow: none;
    }
    .project-card.dead {
      opacity: 0.6;
      cursor: default;
      pointer-events: none;
    }
    .proj-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 4px;
    }
    .proj-name {
      font-size: 15px;
      font-weight: 700;
      color: ${C.g900};
      line-height: 1.3;
    }
    .proj-sub {
      font-size: 12px;
      color: ${C.g500};
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }
    .proj-dot { font-size: 16px; font-weight: 900; color: ${C.g300}; }
    .proj-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }
    .proj-cell {
      background: ${C.g50};
      border-radius: 8px;
      padding: 8px 10px;
    }
    .cell-label {
      font-size: 10px;
      font-weight: 700;
      color: ${C.g400};
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 2px;
    }
    .cell-value {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
    }
    .proj-cta {
      margin-top: 12px;
      cursor: pointer;
    }

    /* Project dashed button */
    .project-dashed {
      padding: 20px;
    }
    .project-dashed-inner {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .project-dashed-icon {
      width: 40px; height: 40px;
      border-radius: 12px;
      background: ${C.g100};
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .project-dashed-title {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g700};
      margin-bottom: 2px;
    }
    .project-dashed-sub {
      font-size: 12px;
      color: ${C.g400};
      font-weight: 500;
    }

    /* ============ MODAL STYLES ============ */

    /* Company modal */
    .modal-status-header {
      padding: 16px 20px;
      color: #fff;
      margin-bottom: 20px;
    }
    .modal-status-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .modal-status-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      opacity: 0.8;
      margin-bottom: 2px;
    }
    .modal-status-value {
      font-size: 14px;
      font-weight: 800;
    }

    .modal-section-title {
      font-size: 13px;
      font-weight: 800;
      color: ${C.g700};
      margin-bottom: 10px;
    }

    .modal-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: ${C.g50};
      border-radius: 10px;
      margin-bottom: 6px;
    }
    .modal-list-left { display: flex; flex-direction: column; gap: 2px; }
    .modal-list-name {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g900};
    }
    .modal-list-sub {
      font-size: 11px;
      color: ${C.g400};
    }
    .modal-empty {
      font-size: 13px;
      color: ${C.g400};
      padding: 10px 0;
    }

    .mini-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800; flex-shrink: 0;
    }

    /* Member modal */
    .member-modal-top {
      display: flex;
      gap: 18px;
      margin-bottom: 24px;
    }
    .member-modal-avatar {
      width: 56px; height: 56px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 800; flex-shrink: 0;
    }
    .member-modal-info { flex: 1; }
    .member-modal-name {
      font-size: 16px;
      font-weight: 800;
      color: ${C.g900};
      margin-bottom: 2px;
    }
    .member-modal-email {
      font-size: 13px;
      color: ${C.g500};
      margin-bottom: 8px;
    }
    .member-modal-detail {
      font-size: 12px;
      color: ${C.g500};
      line-height: 1.7;
    }

    /* Role grid */
    .role-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .role-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      transition: border-color 0.2s;
    }
    .role-option:hover {
      border-color: ${C.g300};
    }
    .role-option.selected {
      border-color: ${C.green};
      background: ${C.greenLt};
      color: ${C.green};
    }
    .role-option-radio {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid ${C.g300};
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .role-option.selected .role-option-radio {
      border-color: ${C.green};
    }
    .role-option-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: ${C.green};
    }

    /* Checkbox row */
    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      font-size: 13px;
      color: ${C.g700};
      font-weight: 600;
    }
    .checkbox-row input[type="checkbox"] {
      width: 16px; height: 16px;
      accent-color: ${C.green};
      cursor: pointer;
    }
    .checkbox-row label {
      cursor: pointer;
    }

    /* Modal actions */
    .modal-actions {
      display: flex;
      gap: 10px;
      margin-top: 28px;
      padding-top: 18px;
      border-top: 1px solid ${C.g200};
    }

    /* Invite success */
    .invite-success {
      text-align: center;
      padding: 20px 0 8px;
    }
    .invite-success-icon {
      margin-bottom: 14px;
    }
    .invite-success-title {
      font-size: 18px;
      font-weight: 800;
      color: ${C.g900};
      margin-bottom: 6px;
    }
    .invite-success-sub {
      font-size: 13px;
      color: ${C.g500};
      line-height: 1.5;
      max-width: 340px;
      margin: 0 auto;
    }

    /* Referral card */
    .referral-card {
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-radius: 16px;
      padding: 20px 24px;
      margin-top: 28px;
    }

    .referral-top {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 16px;
    }

    .referral-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .referral-text {
      flex: 1;
    }

    .referral-title {
      font-size: 15px;
      font-weight: 800;
      color: ${C.g900};
      margin-bottom: 2px;
    }

    .referral-desc {
      font-size: 13px;
      color: ${C.g500};
    }

    .referral-dismiss {
      background: none;
      border: none;
      font-size: 20px;
      color: ${C.g400};
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
    }

    .referral-dismiss:hover {
      color: ${C.g600};
    }

    .referral-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .referral-chip {
      padding: 8px 16px;
      border-radius: 20px;
      border: 1.5px solid ${C.g200};
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .referral-chip:hover {
      border-color: ${C.g300};
    }

    .referral-save {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
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
export class DashboardComponent {
  C = C;

  // Border color map
  borderColor(sc: string): string {
    const map: Record<string, string> = {
      green: C.green, amber: C.amber500, blue: C.blue500, red: C.red500, gray: C.g300
    };
    return map[sc] || C.g300;
  }

  roleBadgeColor(role: string): 'green' | 'amber' | 'gray' | 'blue' | 'red' {
    const map: Record<string, 'green' | 'amber' | 'gray' | 'blue' | 'red'> = {
      Admin: 'blue', Editor: 'green', Contributor: 'amber', Viewer: 'gray'
    };
    return map[role] || 'gray';
  }

  // ========== DATA ==========
  companies = [
    { name: "Al Omran Real Estate Dev Co.", cr: "1551515151516515", status: "Approved", sc: "green", proj: 8, mem: 3 },
    { name: "Al Jazeera Development Co.", cr: "1020304050607", status: "Under Review", sc: "amber", proj: 2, mem: 1 }
  ];

  team = [
    { name: "Ahmed Al-Salem", email: "ahmed@alomran.com", role: "Admin", active: true, you: true },
    { name: "Mohammad Al-Salem", email: "mohammad@alomran.com", role: "Admin", active: true, you: false },
    { name: "Fahad Al-Harbi", email: "fahad@alomran.com", role: "Viewer", active: true, you: false },
    { name: "Sarah Ahmad", email: "sarah@alomran.com", role: "Editor", active: false, you: false }
  ];

  projects: any[] = [
    { name: "Khobar Mixed-Use Tower", type: "Mixed Use", loc: "Khobar", comp: "Al Omran Real Estate Dev Co.", compShort: "Al Omran Real Estate", status: "New", sc: "gray", cost: "20-50M", fin: "~25M", prod: "Development", route: "/onboarding/complete" },
    { name: "Al Noor Residential", type: "Mixed Use", loc: "Dammam", compShort: "Al Omran Real Estate", status: "Term-sheet Ready", sc: "green", cost: "20-50M", fin: "~21M", prod: "Development", route: "/application/1/status", submitted: "Feb 12, 2026" },
    { name: "Riyadh Commercial Plaza", type: "Commercial", loc: "Riyadh", compShort: "Al Omran Real Estate", status: "In Review", sc: "amber", cost: "50-100M", fin: "~45M", prod: "Construction", route: "/application/2/status", submitted: "Feb 28, 2026" },
    { name: "Tabuk Residential Complex", type: "Residential", loc: "Tabuk", compShort: "Al Omran Real Estate", status: "Feedback Requested", sc: "amber", cost: "5-20M", fin: "~8M", prod: "Development", route: "/application/3/status", submitted: "Mar 1, 2026" },
    { name: "Jeddah Waterfront Villas", type: "Residential", loc: "Jeddah", compShort: "Al Omran Real Estate", status: "Pending Signing", sc: "blue", cost: "20-50M", fin: "~18M", prod: "Development", route: "/application/4/accepted", submitted: "Jan 15, 2026", accepted: "Feb 5, 2026" },
    { name: "Abha Mountain Villas", type: "Residential", loc: "Abha", compShort: "Al Omran Real Estate", status: "Signed", sc: "green", cost: "5-20M", fin: "~10M", prod: "Land Acquisition", route: "/dashboard", submitted: "Dec 8, 2025", accepted: "Jan 2, 2026", signed: "Jan 20, 2026" },
    { name: "Al Rawdah Gardens", type: "Residential", loc: "Riyadh", compShort: "Al Omran Real Estate", status: "Completed", sc: "green", cost: "20-50M", fin: "~22M", prod: "Development", route: "/dashboard", submitted: "Aug 15, 2025", accepted: "Sep 3, 2025", signed: "Sep 28, 2025" },
    { name: "Eastern Industrial Park", type: "Industrial", loc: "Dammam", comp: "Al Jazeera Development Co.", compShort: "Al Jazeera Development", status: "Cancelled", sc: "red", cost: "50-100M", fin: "~60M", prod: "Bridge", route: "/dashboard", submitted: "Nov 20, 2025" },
    { name: "Madinah Commercial Hub", type: "Commercial", loc: "Madinah", compShort: "Al Jazeera Development", status: "Term-sheet Rejected", sc: "red", cost: "20-50M", fin: "~30M", prod: "Construction", route: "/dashboard", submitted: "Jan 10, 2026" },
  ];

  roles = ['Admin', 'Editor', 'Contributor', 'Viewer'];

  // ========== FILTER STATE ==========
  filterCompany = '';
  filterStatus = '';

  get uniqueCompanies(): string[] {
    return [...new Set(this.projects.map(p => p.compShort))];
  }

  get uniqueStatuses(): string[] {
    return [...new Set(this.projects.map(p => p.status))];
  }

  get isFiltered(): boolean {
    return this.filterCompany !== '' || this.filterStatus !== '';
  }

  get filteredProjects(): any[] {
    return this.projects.filter(p => {
      if (this.filterCompany && p.compShort !== this.filterCompany) return false;
      if (this.filterStatus && p.status !== this.filterStatus) return false;
      return true;
    });
  }

  // ========== MODAL STATE ==========
  showCompanyModal = false;
  selectedCompany: any = null;

  showMemberModal = false;
  selectedMember: any = null;
  memberEditRole = '';
  memberCompanyAccess: boolean[] = [];

  showInviteModal = false;
  inviteName = '';
  inviteEmail = '';
  inviteRole = 'Viewer';
  inviteCompanyAccess: boolean[] = [];
  inviteSent = false;

  // Referral
  showReferral = true;
  referralOptions = ['X (Twitter)', 'Instagram', 'Snapchat', 'LinkedIn', 'Website', 'A friend', 'Other'];
  referralSource = '';
  referralExtra = '';

  constructor(private router: Router) {}

  go(path: string) {
    this.router.navigateByUrl(path);
  }

  // ========== PROJECT CLICK ==========
  onProjectClick(p: any) {
    if (p.sc === 'red') return; // Dead projects not clickable
    if (p.sc === 'gray') return; // Draft: handled by CTA badge
    this.go(p.route);
  }

  // ========== COMPANY MODAL ==========
  openCompanyModal(co: any) {
    this.selectedCompany = co;
    this.showCompanyModal = true;
  }

  getCompanyProjects(companyName: string): any[] {
    return this.projects.filter(p => p.comp === companyName || (p.compShort && companyName.startsWith(p.compShort)));
  }

  // ========== MEMBER MODAL ==========
  openMemberModal(m: any) {
    this.selectedMember = m;
    this.memberEditRole = m.role;
    this.memberCompanyAccess = this.companies.map(() => true);
    this.showMemberModal = true;
  }

  // ========== INVITE MODAL ==========
  openInviteModal() {
    this.inviteName = '';
    this.inviteEmail = '';
    this.inviteRole = 'Viewer';
    this.inviteCompanyAccess = this.companies.map(() => false);
    this.inviteSent = false;
    this.showInviteModal = true;
  }

  sendInvite() {
    this.inviteSent = true;
  }
}
