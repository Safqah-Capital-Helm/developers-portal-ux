import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import { ButtonComponent, BadgeComponent, ModalComponent, InputComponent, AvatarComponent, DashedButtonComponent, PageHeaderComponent } from '../../shared';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, BadgeComponent, ModalComponent, InputComponent, AvatarComponent, DashedButtonComponent, PageHeaderComponent],
  template: `
    <div class="container">
      <app-page-header title="Team" [count]="team.length"></app-page-header>

      <!-- Member cards -->
      <div *ngFor="let m of team" class="member-card" (click)="openMemberModal(m)">
        <app-avatar [initials]="m.name.charAt(0)" [color]="m.active ? 'green' : 'gray'"></app-avatar>
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

      <app-dashed-btn label="Invite member" [fullWidth]="true" (clicked)="openInviteModal()"></app-dashed-btn>

      <!-- Member Detail Modal -->
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

        <div class="modal-section-title" style="margin-top: 20px;">Linked Companies</div>
        <div *ngFor="let co of companies; let i = index" class="checkbox-row">
          <input type="checkbox" [id]="'co-check-' + i" [(ngModel)]="memberCompanyAccess[i]" />
          <label [for]="'co-check-' + i">{{ co.name }}</label>
        </div>

        <div class="modal-actions">
          <app-btn variant="primary" size="sm" (clicked)="showMemberModal = false">Save Changes</app-btn>
          <app-btn *ngIf="!selectedMember.you" variant="dangerOutline" size="sm" (clicked)="showMemberModal = false">Remove Member</app-btn>
        </div>
      </app-modal>

      <!-- Invite Modal -->
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

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 28px 40px 60px;
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

    /* Member modal */
    .member-modal-top { display: flex; gap: 18px; margin-bottom: 24px; }
    .member-modal-avatar {
      width: 56px; height: 56px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 800; flex-shrink: 0;
    }
    .member-modal-info { flex: 1; }
    .member-modal-name { font-size: 16px; font-weight: 800; color: ${C.g900}; margin-bottom: 2px; }
    .member-modal-email { font-size: 13px; color: ${C.g500}; margin-bottom: 8px; }
    .member-modal-detail { font-size: 12px; color: ${C.g500}; line-height: 1.7; }

    .modal-section-title { font-size: 13px; font-weight: 800; color: ${C.g700}; margin-bottom: 10px; }

    .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .role-option {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 14px; border: 1.5px solid ${C.g200};
      border-radius: 10px; cursor: pointer;
      font-size: 13px; font-weight: 700; color: ${C.g700};
      transition: border-color 0.2s;
    }
    .role-option:hover { border-color: ${C.g300}; }
    .role-option.selected { border-color: ${C.green}; background: ${C.greenLt}; color: ${C.green}; }
    .role-option-radio {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid ${C.g300};
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .role-option.selected .role-option-radio { border-color: ${C.green}; }
    .role-option-dot { width: 10px; height: 10px; border-radius: 50%; background: ${C.green}; }

    .checkbox-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 0; font-size: 13px; color: ${C.g700}; font-weight: 600;
    }
    .checkbox-row input[type="checkbox"] { width: 16px; height: 16px; accent-color: ${C.green}; cursor: pointer; }
    .checkbox-row label { cursor: pointer; }

    .modal-actions {
      display: flex; gap: 10px; margin-top: 28px;
      padding-top: 18px; border-top: 1px solid ${C.g200};
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

  roles = ['Admin', 'Editor', 'Contributor', 'Viewer'];

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

  constructor(private router: Router) {}

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
