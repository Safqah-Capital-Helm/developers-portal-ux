import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { I18nService } from '../i18n/i18n.service';
import { C } from '../theme';
import { getCompanyLogo, getCompanyLogoByName } from '../company-logos';
import {
  Company, CompanyOwner, Project, Application, TeamMember,
  Notification, DashboardStats, OnboardingStep, ActivityEvent,
  FaqItem, UserProfile,
  MOCK_COMPANIES_RAW, MOCK_COMPANY_OWNERS, MOCK_PROJECTS_RAW,
  MOCK_APPLICATIONS_RAW, MOCK_TEAM_RAW, MOCK_ACTIVITY_EVENTS_RAW,
  MOCK_FAQS_RAW, MOCK_CREDENTIALS_RAW, MOCK_USER_PROFILE,
} from './mock-data';

/** Simulated API delay (ms) — just enough to show skeletons */
const API_DELAY = 600;
const API_DELAY_SHORT = 350;

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private i18n: I18nService) {}

  // ─── HELPERS ──────────────────────────────────────────────────

  private t(key: string, params?: Record<string, string>): string {
    return this.i18n.t(key, params);
  }

  private statusKeyToLabel(key: string): string {
    const map: Record<string, string> = {
      approved: 'common.status_approved',
      pending_verification: 'common.status_pending_verification',
      missing_credentials: 'common.status_missing_credentials',
      termsheet_ready: 'common.status_termsheet_ready',
      in_review: 'common.status_in_review',
      feedback_requested: 'common.status_feedback_requested',
      pending_signing: 'common.status_pending_signing',
      signed: 'common.status_signed',
      active: 'common.status_active',
      pending: 'common.status_pending',
    };
    return map[key] ? this.t(map[key]) : key;
  }

  private prodKeyToLabel(key: string): string {
    const map: Record<string, string> = {
      development: 'common.stage_development',
      construction: 'common.stage_construction',
      land_acquisition: 'common.stage_land_acquisition',
      bridge: 'common.stage_bridge',
    };
    return map[key] ? this.t(map[key]) : key;
  }

  private typeKeyToLabel(key: string): string {
    const map: Record<string, string> = {
      mixed_use: 'common.type_mixed_use',
      commercial: 'common.type_commercial',
      residential: 'common.type_residential',
      industrial: 'common.type_industrial',
    };
    return map[key] ? this.t(map[key]) : key;
  }

  // ─── COMPANIES ────────────────────────────────────────────────

  getCompanies(): Observable<Company[]> {
    const data: Company[] = MOCK_COMPANIES_RAW.map(c => ({
      id: c.id,
      name: c.name,
      cr: c.cr,
      status: this.statusKeyToLabel(c.statusKey),
      statusColor: c.sc,
      projectCount: c.proj,
      memberCount: c.mem,
    }));
    return of(data).pipe(delay(API_DELAY));
  }

  getCompanyById(id: string): Observable<Company & { logo: string }> {
    const c = MOCK_COMPANIES_RAW.find(co => co.id === id) || MOCK_COMPANIES_RAW[0];
    const data = {
      id: c.id,
      name: c.name,
      cr: c.cr,
      status: this.statusKeyToLabel(c.statusKey),
      statusColor: c.sc,
      projectCount: c.proj,
      memberCount: c.mem,
      logo: getCompanyLogo(c.cr) || '',
      owners: MOCK_COMPANY_OWNERS[c.id] || [],
    };
    return of(data).pipe(delay(API_DELAY));
  }

  getCompanyOwners(companyId: string): Observable<CompanyOwner[]> {
    const owners = MOCK_COMPANY_OWNERS[companyId] || [];
    return of(owners).pipe(delay(API_DELAY_SHORT));
  }

  getCompanyCredentials(companyId: string): Observable<any> {
    const idx = parseInt(companyId, 10);
    const data = MOCK_CREDENTIALS_RAW[idx] || MOCK_CREDENTIALS_RAW[0];
    return of(data).pipe(delay(API_DELAY));
  }

  // ─── PROJECTS ─────────────────────────────────────────────────

  getProjects(): Observable<(Project & { compLogo: string })[]> {
    const data = MOCK_PROJECTS_RAW.map(p => ({
      id: p.id,
      name: p.name,
      type: this.typeKeyToLabel(p.typeKey),
      location: p.loc,
      companyName: p.compShort,
      compLogo: getCompanyLogoByName(p.compShort) || '',
      cost: p.cost,
      financingAmount: p.fin,
      product: this.prodKeyToLabel(p.prodKey),
      financingStatus: p.finStatusKey ? this.statusKeyToLabel(p.finStatusKey) : '',
      draft: p.draft,
      draftRoute: p.draftRoute,
      image: p.img,
    }));
    return of(data).pipe(delay(API_DELAY));
  }

  getProjectById(id: string): Observable<Project & { compLogo: string }> {
    const p = MOCK_PROJECTS_RAW.find(pr => pr.id === id) || MOCK_PROJECTS_RAW[1];
    const data = {
      id: p.id,
      name: p.name,
      type: this.typeKeyToLabel(p.typeKey),
      location: p.loc,
      companyName: p.compShort,
      compLogo: getCompanyLogoByName(p.compShort) || '',
      cost: p.cost,
      financingAmount: p.fin,
      product: this.prodKeyToLabel(p.prodKey),
      financingStatus: p.finStatusKey ? this.statusKeyToLabel(p.finStatusKey) : '',
      draft: p.draft,
      draftRoute: p.draftRoute,
      image: p.img,
    };
    return of(data).pipe(delay(API_DELAY));
  }

  // ─── APPLICATIONS ─────────────────────────────────────────────

  getApplications(): Observable<Application[]> {
    const data: Application[] = MOCK_APPLICATIONS_RAW.map(a => ({
      id: a.id,
      projectName: a.projectName,
      company: a.company,
      amount: a.amount,
      product: this.prodKeyToLabel(a.prodKey),
      status: this.statusKeyToLabel(a.statusKey),
      statusKey: a.statusKey,
      statusColor: a.sc,
      submitted: a.submitted,
      route: a.route,
    }));
    return of(data).pipe(delay(API_DELAY));
  }

  /** Dashboard uses different data sets depending on demo mode */
  getDashboardApplications(mode: 'full' | 'clear'): Observable<Application[]> {
    if (mode === 'full') {
      return of([
        { id: 1, projectName: 'Al Noor Residential', company: 'Al Omran Real Estate', amount: '~21M SAR', product: this.prodKeyToLabel('development'), status: this.statusKeyToLabel('termsheet_ready'), statusKey: 'termsheet_ready', statusColor: 'green', submitted: '', route: '/application/1/status' },
        { id: 2, projectName: 'Riyadh Commercial Plaza', company: 'Al Omran Real Estate', amount: '~45M SAR', product: this.prodKeyToLabel('construction'), status: this.t('common.status_in_review'), statusKey: 'in_review', statusColor: 'amber', submitted: '', route: '/application/2/status' },
        { id: 3, projectName: 'Tabuk Residential Complex', company: 'Al Omran Real Estate', amount: '~8M SAR', product: this.prodKeyToLabel('development'), status: this.statusKeyToLabel('feedback_requested'), statusKey: 'feedback_requested', statusColor: 'amber', submitted: '', route: '/application/3/status' },
      ]).pipe(delay(API_DELAY));
    }
    return of([
      { id: 1, projectName: 'Al Noor Residential', company: 'Al Omran Real Estate', amount: '~21M SAR', product: this.prodKeyToLabel('development'), status: this.t('common.status_approved'), statusKey: 'approved', statusColor: 'green', submitted: '', route: '/application/1/status' },
      { id: 2, projectName: 'Riyadh Commercial Plaza', company: 'Al Omran Real Estate', amount: '~45M SAR', product: this.prodKeyToLabel('construction'), status: this.t('common.status_in_review'), statusKey: 'in_review', statusColor: 'blue', submitted: '', route: '/application/2/status' },
      { id: 3, projectName: 'Tabuk Residential Complex', company: 'Al Omran Real Estate', amount: '~8M SAR', product: this.prodKeyToLabel('development'), status: this.t('common.status_in_review'), statusKey: 'in_review', statusColor: 'blue', submitted: '', route: '/application/3/status' },
    ]).pipe(delay(API_DELAY));
  }

  // ─── TEAMS ────────────────────────────────────────────────────

  getTeamMembers(): Observable<TeamMember[]> {
    return of(MOCK_TEAM_RAW.map(m => ({ ...m }))).pipe(delay(API_DELAY));
  }

  getTeamCompanies(): Observable<{ name: string }[]> {
    return of([
      { name: 'Al Omran Real Estate Dev Co.' },
      { name: 'Al Jazeera Development Co.' },
    ]).pipe(delay(API_DELAY_SHORT));
  }

  // ─── DASHBOARD ────────────────────────────────────────────────

  getDashboardStats(mode: 'full' | 'clear' | 'single'): Observable<DashboardStats[]> {
    const statsMap: Record<string, DashboardStats[]> = {
      full: [
        { label: this.t('dashboard.total_apps'), value: 3, iconBg: C.blue50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
        { label: this.t('dashboard.under_review'), value: 1, iconBg: C.amber50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.amber500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
        { label: this.t('dashboard.action_required'), value: 1, iconBg: '#fff2ee', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>` },
        { label: this.t('dashboard.termsheet_ready'), value: 1, iconBg: C.greenLt, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="16 13 12 17 9 14"/></svg>` },
      ],
      clear: [
        { label: this.t('dashboard.total_apps'), value: 3, iconBg: C.blue50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
        { label: this.t('dashboard.under_review'), value: 2, iconBg: C.amber50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.amber500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
        { label: this.t('dashboard.action_required'), value: 0, iconBg: '#fff2ee', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>` },
        { label: this.t('dashboard.approved'), value: 1, iconBg: C.greenLt, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` },
      ],
      single: [
        { label: this.t('dashboard.total_apps'), value: 0, iconBg: C.blue50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
        { label: this.t('dashboard.under_review'), value: 0, iconBg: C.amber50, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.amber500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
        { label: this.t('dashboard.action_required'), value: 0, iconBg: '#fff2ee', icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>` },
        { label: this.t('dashboard.termsheet_ready'), value: 0, iconBg: C.greenLt, icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="16 13 12 17 9 14"/></svg>` },
      ],
    };
    return of(statsMap[mode] || statsMap['full']).pipe(delay(API_DELAY_SHORT));
  }

  getNotifications(): Observable<Notification[]> {
    const data: Notification[] = [
      {
        id: 'n1',
        title: this.t('dashboard.notif_pending_verify'),
        desc: this.t('dashboard.notif_pending_verify_desc', { company: 'Al Jazeera Development Co.' }),
        time: this.t('nav.time_2h'),
        route: '/onboarding/company-verify?from=dashboard',
        borderColor: C.amber500,
        iconBg: C.amber50,
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.amber500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      },
      {
        id: 'n2',
        title: this.t('dashboard.notif_feedback'),
        desc: this.t('dashboard.notif_feedback_desc', { project: 'Tabuk Residential Complex' }),
        time: this.t('nav.time_5h'),
        route: '/application/3/status',
        borderColor: C.orange,
        iconBg: '#fff2ee',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
      },
      {
        id: 'n3',
        title: this.t('dashboard.notif_termsheet'),
        desc: this.t('dashboard.notif_termsheet_desc', { project: 'Al Noor Residential' }),
        time: this.t('nav.time_1d'),
        route: '/application/1/status',
        borderColor: C.green,
        iconBg: C.greenLt,
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="16 13 12 17 9 14"/></svg>`,
      },
      {
        id: 'n4',
        title: this.t('dashboard.notif_signing'),
        desc: this.t('dashboard.notif_signing_desc', { project: 'Riyadh Commercial Plaza' }),
        time: this.t('nav.time_2d'),
        route: '/application/2/status',
        borderColor: C.blue500,
        iconBg: C.blue50,
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
      },
    ];
    return of(data).pipe(delay(API_DELAY));
  }

  getOnboardingSteps(variant: 'new' | 'single'): Observable<OnboardingStep[]> {
    const steps: OnboardingStep[] = [
      { title: this.t('dashboard.step_profile'), desc: this.t('dashboard.step_profile_desc'), action: this.t('dashboard.step_profile_action'), route: '/profile?from=onboarding', done: variant === 'single' },
      { title: this.t('dashboard.step_verify'), desc: this.t('dashboard.step_verify_desc'), action: this.t('dashboard.step_verify_action'), route: '/onboarding/company-verify?from=dashboard', done: false },
      { title: this.t('dashboard.step_credentials'), desc: this.t('dashboard.step_credentials_desc'), action: this.t('dashboard.step_credentials_action'), route: '/company/0/credentials', done: false },
      { title: this.t('dashboard.step_project'), desc: this.t('dashboard.step_project_desc'), action: this.t('dashboard.step_project_action'), route: '/project/new?fresh=true', done: variant === 'single' },
      { title: this.t('dashboard.step_team'), desc: this.t('dashboard.step_team_desc'), action: this.t('dashboard.step_team_action'), route: '/dashboard/teams', done: false },
      { title: this.t('dashboard.step_financing'), desc: this.t('dashboard.step_financing_desc'), action: this.t('dashboard.step_financing_action'), route: '/application/new', done: false },
    ];
    return of(steps).pipe(delay(API_DELAY));
  }

  // ─── ACTIVITY LOG ─────────────────────────────────────────────

  getActivityEvents(applicationId?: number): Observable<ActivityEvent[]> {
    const data: ActivityEvent[] = MOCK_ACTIVITY_EVENTS_RAW.map(e => ({
      id: e.id,
      type: e.type,
      title: this.t(e.titleKey),
      description: this.t(e.descKey),
      actor: e.actor,
      time: e.time,
      badge: e.badge,
      badgeLabel: this.t(e.badgeLabelKey),
    }));
    return of(data).pipe(delay(API_DELAY));
  }

  // ─── SUPPORT ──────────────────────────────────────────────────

  getFaqs(): Observable<FaqItem[]> {
    const data: FaqItem[] = MOCK_FAQS_RAW.map(f => ({
      q: this.t(f.qKey),
      a: this.t(f.aKey),
      open: false,
    }));
    return of(data).pipe(delay(API_DELAY));
  }

  // ─── USER PROFILE ─────────────────────────────────────────────

  getUserProfile(): Observable<UserProfile> {
    return of({ ...MOCK_USER_PROFILE }).pipe(delay(API_DELAY_SHORT));
  }

  // ─── DRAFTS (save / load simulation) ──────────────────────────

  saveDraft(key: string, data: any): Observable<boolean> {
    try {
      localStorage.setItem(`draft_${key}`, JSON.stringify(data));
    } catch { /* quota exceeded — silently fail */ }
    return of(true).pipe(delay(200));
  }

  loadDraft(key: string): Observable<any | null> {
    try {
      const raw = localStorage.getItem(`draft_${key}`);
      return of(raw ? JSON.parse(raw) : null).pipe(delay(API_DELAY_SHORT));
    } catch {
      return of(null).pipe(delay(API_DELAY_SHORT));
    }
  }

  deleteDraft(key: string): Observable<boolean> {
    localStorage.removeItem(`draft_${key}`);
    return of(true).pipe(delay(100));
  }
}
