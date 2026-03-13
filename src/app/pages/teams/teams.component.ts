import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import { ButtonComponent, BadgeComponent, ModalComponent, InputComponent, AvatarComponent, PageHeaderComponent, TranslatePipe, I18nService } from '../../shared';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, BadgeComponent, ModalComponent, InputComponent, AvatarComponent, PageHeaderComponent, TranslatePipe],
  template: `
    <div class="container">
      <app-page-header [title]="('teams.title' | t)" [count]="team.length">
        <app-btn variant="primary" size="sm" (clicked)="openInviteModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          {{ 'teams.invite_member' | t }}
        </app-btn>
      </app-page-header>

      <!-- Member cards -->
      <div *ngFor="let m of team" class="member-card" (click)="openMemberModal(m)">
        <app-avatar [initials]="m.name.charAt(0)" [color]="m.active ? 'green' : 'gray'"></app-avatar>
        <div class="member-info">
          <div class="member-name-row">
            <span class="member-name">{{ m.name }}</span>
            <span *ngIf="m.you" class="you-tag">{{ 'teams.you' | t }}</span>
          </div>
          <div class="member-email">{{ m.email }}</div>
        </div>
        <div class="member-right">
          <app-badge [color]="roleBadgeColor(m.role)">{{ translateRole(m.role) }}</app-badge>
          <span class="active-dot" [style.background]="m.active ? C.green : C.amber500"></span>
        </div>
      </div>

      <!-- Member Detail Modal -->
      <app-modal *ngIf="showMemberModal && selectedMember" [title]="('teams.modal_title' | t)" [wide]="true" (closed)="showMemberModal = false">
        <!-- Profile card -->
        <div class="mm-profile">
          <div class="mm-avatar-ring">
            <app-avatar [initials]="selectedMember.name.charAt(0)" size="xl" color="green"></app-avatar>
            <span class="mm-status-dot" [style.background]="selectedMember.active ? C.green : C.amber500"></span>
          </div>
          <div class="mm-profile-info">
            <div class="mm-name">{{ selectedMember.name }} <span *ngIf="selectedMember.you" class="you-tag">{{ 'teams.you' | t }}</span></div>
            <div class="mm-email">{{ selectedMember.email }}</div>
          </div>
        </div>

        <div class="mm-meta-row">
          <div class="mm-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            <span>+966 50 123 4567</span>
          </div>
          <div class="mm-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Joined Jan 15, 2026</span>
          </div>
          <div class="mm-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>{{ selectedMember.active ? ('teams.status_active' | t) : ('teams.status_pending' | t) }}</span>
          </div>
        </div>

        <!-- Role selection -->
        <div class="mm-section">
          <div class="mm-section-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
            <span>{{ 'teams.modal_role' | t }}</span>
          </div>
          <div class="role-grid">
            <div *ngFor="let r of roleOptions" class="role-option"
                 [class.selected]="memberEditRole === r.key"
                 (click)="memberEditRole = r.key">
              <div class="role-option-left">
                <div class="role-option-radio">
                  <div *ngIf="memberEditRole === r.key" class="role-option-dot"></div>
                </div>
                <div class="role-option-text">
                  <span class="role-option-name">{{ r.name }}</span>
                  <span class="role-option-desc">{{ r.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Company access -->
        <div class="mm-section">
          <div class="mm-section-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
            <span>{{ 'teams.modal_companies' | t }}</span>
          </div>
          <div class="mm-company-list">
            <label *ngFor="let co of companies; let i = index" class="mm-company-item" [class.checked]="memberCompanyAccess[i]">
              <input type="checkbox" [(ngModel)]="memberCompanyAccess[i]" />
              <div class="mm-checkbox">
                <svg *ngIf="memberCompanyAccess[i]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div class="mm-company-icon" [style.background]="C.blue50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
              </div>
              <span class="mm-company-name">{{ co.name }}</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="mm-actions">
          <app-btn variant="primary" (clicked)="showMemberModal = false">{{ 'teams.modal_save' | t }}</app-btn>
          <app-btn *ngIf="!selectedMember.you" variant="dangerOutline" (clicked)="showMemberModal = false">{{ 'teams.modal_remove' | t }}</app-btn>
        </div>
      </app-modal>

      <!-- Invite Modal -->
      <app-modal *ngIf="showInviteModal" [title]="('teams.invite_member' | t)" (closed)="showInviteModal = false; inviteSent = false">
        <div *ngIf="!inviteSent">
          <app-input [label]="'teams.full_name' | t" [placeholder]="'teams.full_name_placeholder' | t" [(value)]="inviteName"></app-input>
          <app-input [label]="'teams.email_address' | t" [placeholder]="'teams.email_placeholder' | t" [(value)]="inviteEmail"></app-input>

          <div class="mm-section" style="margin-top: 4px;">
            <div class="mm-section-header">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
              <span>{{ 'teams.modal_role' | t }}</span>
            </div>
            <div class="role-grid">
              <div *ngFor="let r of roleOptions" class="role-option"
                   [class.selected]="inviteRole === r.key"
                   (click)="inviteRole = r.key">
                <div class="role-option-left">
                  <div class="role-option-radio">
                    <div *ngIf="inviteRole === r.key" class="role-option-dot"></div>
                  </div>
                  <div class="role-option-text">
                    <span class="role-option-name">{{ r.name }}</span>
                    <span class="role-option-desc">{{ r.desc }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mm-section">
            <div class="mm-section-header">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
              <span>{{ 'teams.modal_companies' | t }}</span>
            </div>
            <div class="mm-company-list">
              <label *ngFor="let co of companies; let i = index" class="mm-company-item" [class.checked]="inviteCompanyAccess[i]">
                <input type="checkbox" [(ngModel)]="inviteCompanyAccess[i]" />
                <div class="mm-checkbox">
                  <svg *ngIf="inviteCompanyAccess[i]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="mm-company-icon" [style.background]="C.blue50">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                </div>
                <span class="mm-company-name">{{ co.name }}</span>
              </label>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <app-btn variant="primary" [full]="true" (clicked)="sendInvite()">{{ 'team_invite.send_continue' | t }}</app-btn>
          </div>
        </div>

        <div *ngIf="inviteSent" class="invite-success">
          <div class="invite-success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="invite-success-title">{{ 'teams.invitation_sent' | t }}</div>
          <div class="invite-success-sub">{{ 'teams.invitation_sent_desc' | t }}</div>
          <div style="margin-top: 20px;">
            <app-btn variant="secondary" (clicked)="showInviteModal = false; inviteSent = false">{{ 'common.close' | t }}</app-btn>
          </div>
        </div>
      </app-modal>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 32px 60px;
    }

    /* Member cards */
    .member-card {
      display: flex; align-items: center; gap: 12px;
      background: #fff; border: 1px solid ${C.g200};
      border-radius: 12px; padding: 12px 14px;
      margin-bottom: 8px; cursor: pointer; transition: box-shadow 0.2s;
    }
    .member-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
    .member-info { flex: 1; min-width: 0; }
    .member-name-row { display: flex; align-items: center; gap: 5px; }
    .member-name {
      font-size: 13px; font-weight: 700; color: ${C.g900};
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .you-tag {
      font-size: 10px; font-weight: 700; color: ${C.green};
      background: ${C.greenLt}; padding: 1px 6px; border-radius: 6px; flex-shrink: 0;
    }
    .member-email {
      font-size: 11px; color: ${C.g400};
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .member-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .active-dot { width: 8px; height: 8px; border-radius: 50%; }

    /* Member modal — profile section */
    .mm-profile {
      display: flex; align-items: center; gap: 16px;
      padding-bottom: 20px; margin-bottom: 20px;
      border-bottom: 1px solid ${C.g100};
    }
    .mm-avatar-ring { position: relative; flex-shrink: 0; }
    .mm-status-dot {
      position: absolute; bottom: 2px; right: 2px;
      width: 12px; height: 12px; border-radius: 50%;
      border: 2.5px solid #fff;
    }
    .mm-profile-info { flex: 1; min-width: 0; }
    .mm-name { font-size: 17px; font-weight: 800; color: ${C.g900}; display: flex; align-items: center; gap: 6px; }
    .mm-email { font-size: 13px; color: ${C.g500}; margin-top: 2px; }

    .mm-meta-row {
      display: flex; flex-wrap: wrap; gap: 20px;
      padding-bottom: 20px; margin-bottom: 4px;
      border-bottom: 1px solid ${C.g100};
    }
    .mm-meta-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 600; color: ${C.g500};
    }

    /* Sections */
    .mm-section { margin-top: 20px; }
    .mm-section-header {
      display: flex; align-items: center; gap: 7px;
      font-size: 13px; font-weight: 800; color: ${C.g700};
      margin-bottom: 10px;
    }

    /* Role grid */
    .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .role-option {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 14px; border: 1.5px solid ${C.g200};
      border-radius: 12px; cursor: pointer;
      transition: all 0.15s ease;
    }
    .role-option:hover { border-color: ${C.g300}; background: ${C.g50}; }
    .role-option.selected { border-color: ${C.green}; background: ${C.greenLt}; }
    .role-option-left { display: flex; align-items: flex-start; gap: 10px; }
    .role-option-radio {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid ${C.g300};
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      margin-top: 1px;
    }
    .role-option.selected .role-option-radio { border-color: ${C.green}; }
    .role-option-dot { width: 10px; height: 10px; border-radius: 50%; background: ${C.green}; }
    .role-option-text { display: flex; flex-direction: column; gap: 2px; }
    .role-option-name { font-size: 13px; font-weight: 700; color: ${C.g700}; }
    .role-option.selected .role-option-name { color: ${C.green}; }
    .role-option-desc { font-size: 11px; color: ${C.g400}; line-height: 1.3; }
    .role-option.selected .role-option-desc { color: ${C.greenDk}; opacity: 0.7; }

    /* Company access checkboxes */
    .mm-company-list { display: flex; flex-direction: column; gap: 8px; }
    .mm-company-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 14px; border: 1.5px solid ${C.g200};
      border-radius: 12px; cursor: pointer; transition: all 0.15s ease;
    }
    .mm-company-item:hover { border-color: ${C.g300}; background: ${C.g50}; }
    .mm-company-item.checked { border-color: ${C.green}; background: ${C.greenLt}; }
    .mm-company-item input[type="checkbox"] { position: absolute; opacity: 0; pointer-events: none; }
    .mm-checkbox {
      width: 20px; height: 20px; border-radius: 6px;
      border: 2px solid ${C.g300}; background: #fff;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.15s ease;
    }
    .mm-company-item.checked .mm-checkbox { background: ${C.green}; border-color: ${C.green}; }
    .mm-company-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .mm-company-name { font-size: 13px; font-weight: 700; color: ${C.g700}; }
    .mm-company-item.checked .mm-company-name { color: ${C.green}; }

    /* Modal actions */
    .mm-actions {
      display: flex; gap: 10px; margin-top: 24px;
      padding-top: 20px; border-top: 1px solid ${C.g100};
    }

    .invite-success { text-align: center; padding: 20px 0 8px; }
    .invite-success-icon { margin-bottom: 14px; }
    .invite-success-title { font-size: 18px; font-weight: 800; color: ${C.g900}; margin-bottom: 6px; }
    .invite-success-sub {
      font-size: 13px; color: ${C.g500}; line-height: 1.5;
      max-width: 340px; margin: 0 auto;
    }

    @media (max-width: 900px) {
      .container { padding: 20px 16px 40px; }
    }

    @media (max-width: 768px) {
      .role-grid { grid-template-columns: 1fr; }
      .member-card { padding: 10px 12px; }
      .mm-meta-row { gap: 12px; }
    }

    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .member-right { flex-direction: column; align-items: flex-end; gap: 4px; }
      .mm-profile { flex-direction: column; text-align: center; gap: 10px; }
      .mm-name { justify-content: center; }
      .mm-meta-row { flex-direction: column; gap: 8px; }
      .mm-actions { flex-direction: column; }
    }
  `]
})
export class TeamsPageComponent {
  C = C;

  team = [
    { name: "Ahmed Al-Salem", email: "ahmed@alomran.com", role: "Admin", active: true, you: true },
    { name: "Mohammad Al-Salem", email: "mohammad@alomran.com", role: "Admin", active: true, you: false },
    { name: "Fahad Al-Harbi", email: "fahad@alomran.com", role: "Viewer", active: true, you: false },
    { name: "Sarah Ahmad", email: "sarah@alomran.com", role: "Editor", active: false, you: false }
  ];

  companies = [
    { name: "Al Omran Real Estate Dev Co." },
    { name: "Al Jazeera Development Co." }
  ];

  get roles() {
    return [this.i18n.t('teams.role_admin'), this.i18n.t('teams.role_editor'), this.i18n.t('teams.role_contributor'), this.i18n.t('teams.role_viewer')];
  }

  get roleOptions() {
    return [
      { name: this.i18n.t('teams.role_admin'), desc: this.i18n.t('teams.role_admin_desc'), key: 'Admin' },
      { name: this.i18n.t('teams.role_editor'), desc: this.i18n.t('teams.role_editor_desc'), key: 'Editor' },
      { name: this.i18n.t('teams.role_contributor'), desc: this.i18n.t('teams.role_contributor_desc'), key: 'Contributor' },
      { name: this.i18n.t('teams.role_viewer'), desc: this.i18n.t('teams.role_viewer_desc'), key: 'Viewer' },
    ];
  }

  private roleKeyMap: Record<string, string> = {
    Admin: 'teams.role_admin',
    Editor: 'teams.role_editor',
    Contributor: 'teams.role_contributor',
    Viewer: 'teams.role_viewer',
  };

  translateRole(role: string): string {
    return this.roleKeyMap[role] ? this.i18n.t(this.roleKeyMap[role]) : role;
  }

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

  constructor(private router: Router, private i18n: I18nService) {}

  roleBadgeColor(role: string): 'green' | 'amber' | 'gray' | 'blue' | 'red' {
    const map: Record<string, 'green' | 'amber' | 'gray' | 'blue' | 'red'> = {
      Admin: 'blue', Editor: 'green', Contributor: 'amber', Viewer: 'gray'
    };
    return map[role] || 'gray';
  }

  openMemberModal(m: any) {
    this.selectedMember = m;
    this.memberEditRole = m.role;
    this.memberCompanyAccess = this.companies.map(() => true);
    this.showMemberModal = true;
  }

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
