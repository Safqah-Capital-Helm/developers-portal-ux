/**
 * Central mock data store — single source of truth for the prototype.
 * All domain services pull from here, ensuring consistency across pages.
 */

// ─── Models ──────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  cr: string;
  status: string;           // key: 'approved' | 'pending_verification' | 'missing_credentials'
  statusColor: string;
  projectCount: number;
  memberCount: number;
  owners?: CompanyOwner[];
}

export interface CompanyOwner {
  name: string;
  nid: string;
  role: string;
  verified: boolean;
}

export interface Project {
  id: string;
  name: string;
  type: string;             // key: 'mixed_use' | 'commercial' | etc.
  location: string;
  companyName: string;
  cost: string;
  financingAmount: string;
  product: string;          // key: 'development' | 'construction' | etc.
  financingStatus: string;  // key: 'active' | 'in_review' | 'pending' | ''
  draft: boolean;
  draftRoute?: string;
  image: string;
}

export interface Application {
  id: number;
  projectName: string;
  company: string;
  amount: string;
  product: string;          // translated label
  status: string;           // translated status
  statusKey: string;        // raw status key for filtering
  statusColor: string;
  submitted: string;
  route: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;             // 'Admin' | 'Editor' | 'Contributor' | 'Viewer'
  active: boolean;
  you: boolean;
  joinedDate: string;
}

export interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  route: string;
  borderColor: string;
  iconBg: string;
  icon: string;
}

export interface DashboardStats {
  label: string;
  value: number;
  iconBg: string;
  icon: string;
}

export interface OnboardingStep {
  title: string;
  desc: string;
  action: string;
  route: string;
  done: boolean;
}

export interface ActivityEvent {
  id: number;
  type: string;
  title: string;
  description: string;
  actor: string;
  time: string;
  badge: string;
  badgeLabel: string;
  model: 'company' | 'project' | 'application';
  modelName: string;
  modelRoute: string;
}

export interface FaqItem {
  q: string;
  a: string;
  open: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  nid: string;
  avatar?: string;
}

// ─── Raw mock data (language-independent where possible) ──────────

export const MOCK_COMPANIES_RAW = [
  { id: '0', name: 'Al Omran Real Estate Dev Co.', nameAr: 'شركة العمران للتطوير العقاري', cr: '1551515151516515', statusKey: 'approved', sc: 'green', proj: 8, mem: 3 },
  { id: '1', name: 'Al Jazeera Development Co.', nameAr: 'شركة الجزيرة للتطوير', cr: '1020304050607', statusKey: 'pending_verification', sc: 'amber', proj: 2, mem: 1 },
  { id: '2', name: 'Riyad Construction Group', nameAr: 'مجموعة رياض للمقاولات', cr: '3080706050403', statusKey: 'missing_credentials', sc: 'red', proj: 1, mem: 2 },
];

export const MOCK_COMPANY_OWNERS: Record<string, (CompanyOwner & { nameAr?: string })[]> = {
  '0': [
    { name: 'Ahmed Al-Salem', nameAr: 'أحمد السالم', nid: '1020304050', role: 'ceo', verified: true },
    { name: 'Mohammad Al-Salem', nameAr: 'محمد السالم', nid: '1020304051', role: 'partner', verified: true },
    { name: 'Khalid Al-Dossary', nameAr: 'خالد الدوسري', nid: '1020304052', role: 'partner', verified: false },
  ],
  '1': [
    { name: 'Fahad Al-Rashidi', nameAr: 'فهد الرشيدي', nid: '2030405060', role: 'ceo', verified: false },
  ],
  '2': [
    { name: 'Sultan Al-Otaibi', nameAr: 'سلطان العتيبي', nid: '3040506070', role: 'ceo', verified: false },
    { name: 'Omar Al-Ghamdi', nameAr: 'عمر الغامدي', nid: '3040506071', role: 'partner', verified: false },
  ],
};

export const MOCK_PROJECTS_RAW = [
  { id: '0', name: 'Khobar Mixed-Use Tower', nameAr: 'برج الخبر متعدد الاستخدام', typeKey: 'mixed_use', loc: 'Khobar', locAr: 'الخبر', compShort: 'Al Omran Real Estate', compShortAr: 'العمران العقارية', cost: '20-50M', fin: '', prodKey: 'development', finStatusKey: '', draft: true, draftRoute: '/project/new', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=480&h=320&fit=crop' },
  { id: '1', name: 'Al Noor Residential', nameAr: 'مجمع النور السكني', typeKey: 'mixed_use', loc: 'Dammam', locAr: 'الدمام', compShort: 'Al Omran Real Estate', compShortAr: 'العمران العقارية', cost: 'SAR 28M', fin: '~21M', prodKey: 'development', finStatusKey: 'active', draft: false, img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=480&h=320&fit=crop' },
  { id: '2', name: 'Riyadh Commercial Plaza', nameAr: 'بلازا الرياض التجارية', typeKey: 'commercial', loc: 'Riyadh', locAr: 'الرياض', compShort: 'Al Omran Real Estate', compShortAr: 'العمران العقارية', cost: 'SAR 65M', fin: '~45M', prodKey: 'construction', finStatusKey: 'in_review', draft: false, img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=480&h=320&fit=crop' },
  { id: '3', name: 'Tabuk Residential Complex', nameAr: 'مجمع تبوك السكني', typeKey: 'residential', loc: 'Tabuk', locAr: 'تبوك', compShort: 'Al Omran Real Estate', compShortAr: 'العمران العقارية', cost: 'SAR 12M', fin: '~8M', prodKey: 'development', finStatusKey: 'in_review', draft: false, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=480&h=320&fit=crop' },
  { id: '4', name: 'Jeddah Waterfront Villas', nameAr: 'فلل جدة الواجهة البحرية', typeKey: 'residential', loc: 'Jeddah', locAr: 'جدة', compShort: 'Al Omran Real Estate', compShortAr: 'العمران العقارية', cost: 'SAR 32M', fin: '~18M', prodKey: 'development', finStatusKey: 'pending', draft: false, img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=480&h=320&fit=crop' },
  { id: '5', name: 'Abha Mountain Villas', nameAr: 'فلل أبها الجبلية', typeKey: 'residential', loc: 'Abha', locAr: 'أبها', compShort: 'Al Omran Real Estate', compShortAr: 'العمران العقارية', cost: 'SAR 14M', fin: '', prodKey: 'land_acquisition', finStatusKey: '', draft: false, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=480&h=320&fit=crop' },
  { id: '6', name: 'Al Rawdah Gardens', nameAr: 'حدائق الروضة', typeKey: 'residential', loc: 'Riyadh', locAr: 'الرياض', compShort: 'Al Omran Real Estate', compShortAr: 'العمران العقارية', cost: 'SAR 30M', fin: '', prodKey: 'development', finStatusKey: '', draft: false, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=480&h=320&fit=crop' },
  { id: '7', name: 'Eastern Industrial Park', nameAr: 'المنطقة الصناعية الشرقية', typeKey: 'industrial', loc: 'Dammam', locAr: 'الدمام', compShort: 'Al Jazeera Development', compShortAr: 'الجزيرة للتطوير', cost: 'SAR 75M', fin: '~60M', prodKey: 'bridge', finStatusKey: 'active', draft: false, img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=480&h=320&fit=crop' },
  { id: '8', name: 'Madinah Commercial Hub', nameAr: 'مركز المدينة التجاري', typeKey: 'commercial', loc: 'Madinah', locAr: 'المدينة المنورة', compShort: 'Al Jazeera Development', compShortAr: 'الجزيرة للتطوير', cost: 'SAR 40M', fin: '', prodKey: 'construction', finStatusKey: '', draft: false, img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=480&h=320&fit=crop' },
];

export const MOCK_APPLICATIONS_RAW = [
  { id: 1, projectName: 'Al Noor Residential', projectNameAr: 'مجمع النور السكني', company: 'Al Omran Real Estate', companyAr: 'العمران العقارية', amount: '~21M SAR', amountAr: '~٢١ مليون ر.س', prodKey: 'development', statusKey: 'termsheet_ready', sc: 'green', submitted: 'Feb 12, 2026', submittedAr: '١٢ فبراير ٢٠٢٦', route: '/application/1/status' },
  { id: 2, projectName: 'Riyadh Commercial Plaza', projectNameAr: 'بلازا الرياض التجارية', company: 'Al Omran Real Estate', companyAr: 'العمران العقارية', amount: '~45M SAR', amountAr: '~٤٥ مليون ر.س', prodKey: 'construction', statusKey: 'in_review', sc: 'amber', submitted: 'Feb 28, 2026', submittedAr: '٢٨ فبراير ٢٠٢٦', route: '/application/2/status' },
  { id: 3, projectName: 'Tabuk Residential Complex', projectNameAr: 'مجمع تبوك السكني', company: 'Al Omran Real Estate', companyAr: 'العمران العقارية', amount: '~8M SAR', amountAr: '~٨ مليون ر.س', prodKey: 'development', statusKey: 'feedback_requested', sc: 'amber', submitted: 'Mar 1, 2026', submittedAr: '١ مارس ٢٠٢٦', route: '/application/3/status' },
  { id: 4, projectName: 'Jeddah Waterfront Villas', projectNameAr: 'فلل جدة الواجهة البحرية', company: 'Al Omran Real Estate', companyAr: 'العمران العقارية', amount: '~18M SAR', amountAr: '~١٨ مليون ر.س', prodKey: 'development', statusKey: 'pending_signing', sc: 'blue', submitted: 'Jan 15, 2026', submittedAr: '١٥ يناير ٢٠٢٦', route: '/application/4/accepted' },
  { id: 5, projectName: 'Abha Mountain Villas', projectNameAr: 'فلل أبها الجبلية', company: 'Al Omran Real Estate', companyAr: 'العمران العقارية', amount: '~10M SAR', amountAr: '~١٠ مليون ر.س', prodKey: 'land_acquisition', statusKey: 'signed', sc: 'green', submitted: 'Dec 8, 2025', submittedAr: '٨ ديسمبر ٢٠٢٥', route: '/dashboard' },
];

export const MOCK_TEAM_RAW = [
  { id: 't1', name: 'Ahmed Al-Salem', nameAr: 'أحمد السالم', email: 'ahmed@alomran.com', phone: '+966 50 123 4567', role: 'Admin', roleKey: 'admin', active: true, you: true, joinedDate: 'Jan 15, 2026', joinedDateAr: '١٥ يناير ٢٠٢٦' },
  { id: 't2', name: 'Mohammad Al-Salem', nameAr: 'محمد السالم', email: 'mohammad@alomran.com', phone: '+966 50 234 5678', role: 'Admin', roleKey: 'admin', active: true, you: false, joinedDate: 'Jan 15, 2026', joinedDateAr: '١٥ يناير ٢٠٢٦' },
  { id: 't3', name: 'Fahad Al-Harbi', nameAr: 'فهد الحربي', email: 'fahad@alomran.com', phone: '+966 50 345 6789', role: 'Viewer', roleKey: 'viewer', active: true, you: false, joinedDate: 'Feb 3, 2026', joinedDateAr: '٣ فبراير ٢٠٢٦' },
  { id: 't4', name: 'Sarah Ahmad', nameAr: 'سارة أحمد', email: 'sarah@alomran.com', phone: '+966 50 456 7890', role: 'Editor', roleKey: 'editor', active: false, you: false, joinedDate: 'Feb 20, 2026', joinedDateAr: '٢٠ فبراير ٢٠٢٦' },
];

export const MOCK_ACTIVITY_EVENTS_RAW = [
  { id: 1,  type: 'termsheet',   titleKey: 'activity.ev_ts_accepted',        descKey: 'activity.ev_ts_accepted_desc',        actor: 'Ahmed Al-Salem', actorAr: 'أحمد السالم',   time: 'Mar 8, 2026 at 2:15 PM',  timeAr: '٨ مارس ٢٠٢٦ الساعة ٢:١٥ م',    badge: 'green', badgeLabelKey: 'activity.badge_accepted',   model: 'application', modelName: 'Al Noor Residential — Development', modelNameAr: 'مجمع النور السكني — تطوير', modelRoute: '/application/1/term-sheet' },
  { id: 2,  type: 'review',      titleKey: 'activity.ev_feedback_requested',  descKey: 'activity.ev_feedback_requested_desc',  actor: 'Safqah Team', actorAr: 'فريق صفقة',      time: 'Mar 7, 2026 at 3:00 PM',  timeAr: '٧ مارس ٢٠٢٦ الساعة ٣:٠٠ م',    badge: 'amber', badgeLabelKey: 'activity.badge_action',     model: 'application', modelName: 'Riyadh Commercial Plaza — Construction', modelNameAr: 'بلازا الرياض التجارية — بناء', modelRoute: '/application/2/status' },
  { id: 3,  type: 'termsheet',   titleKey: 'activity.ev_ts_issued',           descKey: 'activity.ev_ts_issued_desc',           actor: 'Safqah Team', actorAr: 'فريق صفقة',      time: 'Mar 6, 2026 at 9:00 AM',  timeAr: '٦ مارس ٢٠٢٦ الساعة ٩:٠٠ ص',    badge: 'blue',  badgeLabelKey: 'activity.badge_info',      model: 'application', modelName: 'Al Noor Residential — Development', modelNameAr: 'مجمع النور السكني — تطوير', modelRoute: '/application/1/term-sheet' },
  { id: 4,  type: 'review',      titleKey: 'activity.ev_company_approved',    descKey: 'activity.ev_company_approved_desc',    actor: 'Safqah Team', actorAr: 'فريق صفقة',      time: 'Mar 5, 2026 at 4:20 PM',  timeAr: '٥ مارس ٢٠٢٦ الساعة ٤:٢٠ م',    badge: 'green', badgeLabelKey: 'activity.badge_approved',   model: 'company',     modelName: 'Al Omran Real Estate Dev Co.', modelNameAr: 'شركة العمران للتطوير العقاري', modelRoute: '/dashboard/company/0' },
  { id: 5,  type: 'review',      titleKey: 'activity.ev_project_approved',    descKey: 'activity.ev_project_approved_desc',    actor: 'Safqah Team', actorAr: 'فريق صفقة',      time: 'Mar 4, 2026 at 3:45 PM',  timeAr: '٤ مارس ٢٠٢٦ الساعة ٣:٤٥ م',    badge: 'green', badgeLabelKey: 'activity.badge_approved',   model: 'project',     modelName: 'Al Noor Residential', modelNameAr: 'مجمع النور السكني', modelRoute: '/dashboard/project/1' },
  { id: 6,  type: 'document',    titleKey: 'activity.ev_docs_uploaded',       descKey: 'activity.ev_docs_uploaded_desc',       actor: 'Ahmed Al-Salem', actorAr: 'أحمد السالم',   time: 'Mar 3, 2026 at 2:30 PM',  timeAr: '٣ مارس ٢٠٢٦ الساعة ٢:٣٠ م',    badge: 'blue',  badgeLabelKey: 'activity.badge_info',      model: 'project',     modelName: 'Riyadh Commercial Plaza', modelNameAr: 'بلازا الرياض التجارية', modelRoute: '/dashboard/project/2' },
  { id: 7,  type: 'declaration', titleKey: 'activity.ev_declaration_signed',  descKey: 'activity.ev_declaration_signed_desc',  actor: 'Ahmed Al-Salem', actorAr: 'أحمد السالم',   time: 'Mar 3, 2026 at 10:00 AM', timeAr: '٣ مارس ٢٠٢٦ الساعة ١٠:٠٠ ص',   badge: 'green', badgeLabelKey: 'activity.badge_completed',  model: 'application', modelName: 'Al Noor Residential — Development', modelNameAr: 'مجمع النور السكني — تطوير', modelRoute: '/application/1/status' },
  { id: 8,  type: 'team',        titleKey: 'activity.ev_member_joined',       descKey: 'activity.ev_member_joined_desc',       actor: 'Sara Al-Noor', actorAr: 'سارة النور',     time: 'Mar 2, 2026 at 11:15 AM', timeAr: '٢ مارس ٢٠٢٦ الساعة ١١:١٥ ص',   badge: 'blue',  badgeLabelKey: 'activity.badge_info',      model: 'company',     modelName: 'Al Omran Real Estate Dev Co.', modelNameAr: 'شركة العمران للتطوير العقاري', modelRoute: '/dashboard/company/0' },
  { id: 9,  type: 'submit',      titleKey: 'activity.ev_app_submitted',       descKey: 'activity.ev_app_submitted_desc',       actor: 'Ahmed Al-Salem', actorAr: 'أحمد السالم',   time: 'Mar 1, 2026 at 1:30 PM',  timeAr: '١ مارس ٢٠٢٦ الساعة ١:٣٠ م',    badge: 'green', badgeLabelKey: 'activity.badge_submitted', model: 'application', modelName: 'Al Noor Residential — Development', modelNameAr: 'مجمع النور السكني — تطوير', modelRoute: '/application/1/status' },
  { id: 10, type: 'credit',      titleKey: 'activity.ev_credit_authorized',   descKey: 'activity.ev_credit_authorized_desc',   actor: 'Ahmed Al-Salem', actorAr: 'أحمد السالم',   time: 'Feb 28, 2026 at 1:45 PM', timeAr: '٢٨ فبراير ٢٠٢٦ الساعة ١:٤٥ م', badge: 'amber', badgeLabelKey: 'activity.badge_authorized', model: 'company',     modelName: 'Al Omran Real Estate Dev Co.', modelNameAr: 'شركة العمران للتطوير العقاري', modelRoute: '/dashboard/company/0' },
  { id: 11, type: 'team',        titleKey: 'activity.ev_invite_sent',         descKey: 'activity.ev_invite_sent_desc',         actor: 'Ahmed Al-Salem', actorAr: 'أحمد السالم',   time: 'Feb 28, 2026 at 4:00 PM', timeAr: '٢٨ فبراير ٢٠٢٦ الساعة ٤:٠٠ م', badge: 'gray',  badgeLabelKey: 'activity.badge_sent',      model: 'company',     modelName: 'Al Jazeera Development Co.', modelNameAr: 'شركة الجزيرة للتطوير', modelRoute: '/dashboard/company/1' },
  { id: 12, type: 'system',      titleKey: 'activity.ev_app_created',         descKey: 'activity.ev_app_created_desc',         actor: 'System', actorAr: 'النظام',               time: 'Feb 27, 2026 at 9:00 AM', timeAr: '٢٧ فبراير ٢٠٢٦ الساعة ٩:٠٠ ص', badge: 'gray',  badgeLabelKey: 'activity.badge_created',   model: 'application', modelName: 'Al Noor Residential — Development', modelNameAr: 'مجمع النور السكني — تطوير', modelRoute: '/application/1/status' },
];

export const MOCK_FAQS_RAW = [
  { qKey: 'support.faq_review_q', aKey: 'support.faq_review_a' },
  { qKey: 'support.faq_docs_q', aKey: 'support.faq_docs_a' },
  { qKey: 'support.faq_projects_q', aKey: 'support.faq_projects_a' },
  { qKey: 'support.faq_products_q', aKey: 'support.faq_products_a' },
  { qKey: 'support.faq_credit_q', aKey: 'support.faq_credit_a' },
  { qKey: 'support.faq_team_q', aKey: 'support.faq_team_a' },
];

export const MOCK_CREDENTIALS_RAW = [
  { hasPrevProjects: true, prevCount: '12', prevValue: 'SAR 180M', finBank: 40, finFintech: 20, finFriends: 15 },
  { hasPrevProjects: true, prevCount: '3', prevValue: 'SAR 45M', finBank: 60, finFintech: 0, finFriends: 30 },
  { hasPrevProjects: false, prevCount: '', prevValue: '', finBank: 0, finFintech: 0, finFriends: 0 },
];

export const MOCK_USER_PROFILE = {
  name: 'Ahmed Al-Salem',
  nameAr: 'أحمد السالم',
  email: 'ahmed@alomran.com',
  phone: '+966 50 123 4567',
  nid: '1023456789',
};
