import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { C } from '../../theme';

interface AppNotification {
  id: number;
  type: 'status' | 'feedback' | 'termsheet' | 'agreement' | 'invite';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const TYPE_COLORS: Record<string, { bg: string; fg: string }> = {
  status:    { bg: C.greenLt, fg: C.green },
  feedback:  { bg: '#fef0c7', fg: C.amber500 },
  termsheet: { bg: '#eff8ff', fg: C.blue500 },
  agreement: { bg: C.greenLt, fg: C.green },
  invite:    { bg: '#eff8ff', fg: C.blue500 },
};

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [LogoComponent, CommonModule],
  template: `
    <nav class="top-nav">
      <app-logo *ngIf="showLogo" [size]="28"></app-logo>
      <div *ngIf="!showLogo" class="nav-spacer"></div>

      <div class="nav-right">
        <!-- Bell icon -->
        <div class="bell-wrap">
          <div class="bell-btn" (click)="toggleNotif()" [style.background]="notifOpen ? C.g50 : 'transparent'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g500" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span *ngIf="unreadCount > 0" class="bell-dot"></span>
          </div>

          <!-- Notification overlay -->
          <div *ngIf="notifOpen" class="overlay" (click)="notifOpen=false"></div>

          <!-- Notification panel -->
          <div *ngIf="notifOpen" class="notif-panel">
            <div class="notif-header">
              <span class="notif-title">Notifications</span>
              <span *ngIf="unreadCount > 0" class="notif-mark" (click)="markAllRead()">Mark all as read</span>
            </div>
            <div class="notif-list">
              <div
                *ngFor="let n of notifications"
                class="notif-item"
                [class.unread]="!n.read"
                [style.border-left-color]="!n.read ? typeColor(n.type).fg : 'transparent'"
                (click)="markRead(n.id)"
              >
                <div class="notif-icon" [style.background]="typeColor(n.type).bg">
                  <!-- status: refresh -->
                  <svg *ngIf="n.type==='status'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="typeColor(n.type).fg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                  </svg>
                  <!-- feedback: chat bubble -->
                  <svg *ngIf="n.type==='feedback'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="typeColor(n.type).fg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  <!-- termsheet: document -->
                  <svg *ngIf="n.type==='termsheet'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="typeColor(n.type).fg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <!-- agreement: shield check -->
                  <svg *ngIf="n.type==='agreement'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="typeColor(n.type).fg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
                  </svg>
                  <!-- invite: user plus -->
                  <svg *ngIf="n.type==='invite'" width="15" height="15" viewBox="0 0 24 24" fill="none" [attr.stroke]="typeColor(n.type).fg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                </div>
                <div class="notif-body">
                  <div class="notif-item-title">{{ n.title }}</div>
                  <div class="notif-msg">{{ n.message }}</div>
                  <div class="notif-time">{{ n.time }}</div>
                </div>
                <span *ngIf="!n.read" class="notif-unread-dot" [style.background]="typeColor(n.type).fg"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Avatar dropdown -->
        <div class="dd-wrap">
          <div class="avatar-area" (click)="toggleAvatar()" [style.background]="open ? C.g50 : 'transparent'">
            <span class="name">Ahmed</span>
            <div class="avatar">A</div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div *ngIf="open" class="overlay" (click)="open=false"></div>
          <div *ngIf="open" class="dropdown">
            <div class="dd-header">
              <div class="dd-name">Ahmed Al-Salem</div>
              <div class="dd-email">ahmed&#64;alomran.com</div>
            </div>
            <div class="dd-sep"></div>
            <div class="dd-item" (click)="go('/profile')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile Settings
            </div>
            <div class="dd-item" (click)="go('/support')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.g400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Help &amp; Support
            </div>
            <div class="dd-sep"></div>
            <div class="dd-signout">Sign out</div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .top-nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 32px; border-bottom: 1px solid #e2e5e9;
      background: #fff; position: sticky; top: 0; z-index: 50;
    }
    .nav-right { display: flex; align-items: center; gap: 4px; }

    /* Bell */
    .bell-wrap { position: relative; }
    .bell-btn {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border-radius: 10px; cursor: pointer;
      position: relative; transition: background 0.15s;
    }
    .bell-btn:hover { background: ${C.g50}; }
    .bell-dot {
      position: absolute; top: 7px; right: 8px;
      width: 8px; height: 8px; border-radius: 50%;
      background: ${C.red500}; border: 2px solid #fff;
    }

    /* Notification panel */
    .notif-panel {
      position: absolute; right: 0; top: 100%; margin-top: 6px;
      width: 380px; background: #fff; border-radius: 16px;
      border: 1px solid #e2e5e9; box-shadow: 0 12px 36px rgba(0,0,0,0.12);
      z-index: 100; overflow: hidden;
    }
    .notif-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 18px 12px; border-bottom: 1px solid ${C.g100};
      position: sticky; top: 0; background: #fff; z-index: 1;
    }
    .notif-title { font-size: 14px; font-weight: 800; color: ${C.g900}; }
    .notif-mark {
      font-size: 12px; font-weight: 600; color: ${C.green};
      cursor: pointer; transition: opacity 0.15s;
    }
    .notif-mark:hover { opacity: 0.7; }
    .notif-list { max-height: 420px; overflow-y: auto; }
    .notif-item {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 18px; cursor: pointer; transition: background 0.15s;
      border-left: 3px solid transparent; position: relative;
    }
    .notif-item:hover { background: ${C.g50}; }
    .notif-item.unread { background: #fafcff; }
    .notif-item + .notif-item { border-top: 1px solid ${C.g100}; }
    .notif-icon {
      width: 34px; height: 34px; min-width: 34px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; margin-top: 1px;
    }
    .notif-body { flex: 1; min-width: 0; }
    .notif-item-title { font-size: 13px; font-weight: 700; color: ${C.g800}; }
    .notif-msg {
      font-size: 12px; color: ${C.g500}; margin-top: 2px; line-height: 1.4;
      overflow: hidden; text-overflow: ellipsis; display: -webkit-box;
      -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    }
    .notif-time { font-size: 11px; color: ${C.g400}; margin-top: 4px; }
    .notif-unread-dot {
      width: 7px; height: 7px; min-width: 7px; border-radius: 50%; margin-top: 6px;
    }

    /* Avatar dropdown (unchanged) */
    .dd-wrap { position: relative; }
    .avatar-area { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 5px 8px; border-radius: 10px; }
    .name { font-size: 13px; color: #667085; }
    .avatar {
      width: 32px; height: 32px; border-radius: 50%; background: #e6f7ee;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: #00a15a;
    }
    .overlay { position: fixed; inset: 0; z-index: 99; }
    .dropdown {
      position: absolute; right: 0; top: 100%; margin-top: 6px; width: 200px;
      background: #fff; border-radius: 12px; border: 1px solid #e2e5e9;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 100; overflow: hidden;
    }
    .dd-header { padding: 14px 14px 10px; }
    .dd-name { font-size: 14px; font-weight: 700; color: #101828; }
    .dd-email { font-size: 11px; color: #98a2b3; margin-top: 1px; }
    .dd-sep { height: 1px; background: #f1f3f5; }
    .dd-item { padding: 10px 14px; font-size: 13px; font-weight: 600; color: #344054; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.15s; }
    .dd-item:hover { background: #f8f9fa; }
    .dd-signout { padding: 10px 14px; font-size: 13px; color: #f04438; font-weight: 600; cursor: pointer; }
  `]
})
export class NavComponent {
  @Input() showLogo = true;
  C = C;
  open = false;
  notifOpen = false;

  notifications: AppNotification[] = [
    { id: 1, type: 'status',    title: 'Application Under Review',  message: 'Your application for Al Noor Residential is now being reviewed by our team.', time: '2 hours ago', read: false },
    { id: 2, type: 'termsheet', title: 'Term Sheet Ready',          message: 'A term sheet has been prepared for your Al Noor Residential project.',        time: '5 hours ago', read: false },
    { id: 3, type: 'invite',    title: 'Team Invitation Sent',      message: 'An invitation has been sent to omar@alnoor.com to join your team.',           time: '1 day ago',   read: false },
    { id: 4, type: 'feedback',  title: 'Feedback Requested',        message: 'Our team has requested additional details about your project timeline.',      time: '2 days ago',  read: true },
    { id: 5, type: 'agreement', title: 'Agreement Available',       message: 'Your financing agreement is ready for review and signature.',                 time: '3 days ago',  read: true },
    { id: 6, type: 'status',    title: 'Application Approved',      message: 'Congratulations! Your preliminary application has been approved.',            time: '5 days ago',  read: true },
    { id: 7, type: 'feedback',  title: 'Document Review Complete',  message: 'Your uploaded documents have been reviewed successfully.',                    time: '1 week ago',  read: true },
    { id: 8, type: 'invite',    title: 'Team Member Joined',        message: 'sara@alnoor.com has accepted your team invitation.',                         time: '1 week ago',  read: true },
  ];

  constructor(private router: Router) {}

  get unreadCount() { return this.notifications.filter(n => !n.read).length; }

  typeColor(type: string) { return TYPE_COLORS[type] || TYPE_COLORS['status']; }

  toggleNotif() {
    this.notifOpen = !this.notifOpen;
    if (this.notifOpen) this.open = false;
  }

  toggleAvatar() {
    this.open = !this.open;
    if (this.open) this.notifOpen = false;
  }

  markAllRead() { this.notifications.forEach(n => n.read = true); }

  markRead(id: number) {
    const n = this.notifications.find(x => x.id === id);
    if (n) n.read = true;
  }

  go(path: string) { this.open = false; this.router.navigate([path]); }
}
