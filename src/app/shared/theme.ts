export const C = {
  // Brand — Safqah Identity
  green: "#00af3d", greenDk: "#008a30", greenLt: "#e6f9ed", greenMd: "#b3eacc",
  purple: "#5034fa", purpleLt: "#ede9fe", purpleDk: "#3b23c4",
  orange: "#ff825c", orangeLt: "#fff2ee", orangeDk: "#e5603a",

  // Neutrals
  bg: "#fafbfc", white: "#fff",
  g50: "#f8f9fa", g100: "#f1f3f5", g200: "#e2e5e9", g300: "#ced4da",
  g400: "#98a2b3", g500: "#667085", g600: "#475467", g700: "#344054",
  g800: "#1d2939", g900: "#101828",

  // Semantic
  amber50: "#fffcf0", amber100: "#fef0c7", amber500: "#f79009", amber600: "#dc6803",
  red50: "#fef3f2", red500: "#f04438",
  blue50: "#eff8ff", blue100: "#d1e9ff", blue500: "#2e90fa",
} as const;

/** Spacing tokens — standardized across all pages */
export const S = {
  containerPad: '32px 32px 60px',
  containerPadMobile: '20px 16px 40px',
  sectionGap: '24px',
  cardPad: '24px',
  cardRadius: '14px',
  inputGap: '16px',
  btnGap: '12px',
  iconGap: '10px',
} as const;

export type BadgeColor = 'green' | 'amber' | 'gray' | 'blue' | 'red';

export const BADGE_STYLES: Record<BadgeColor, { bg: string; c: string }> = {
  green: { bg: C.greenLt, c: C.green },
  amber: { bg: C.amber100, c: C.amber600 },
  gray: { bg: C.g100, c: C.g500 },
  blue: { bg: C.blue50, c: C.blue500 },
  red: { bg: C.red50, c: C.red500 },
};

/** Shared border-left color for status-coded list cards */
export function borderColorForStatus(sc: string): string {
  switch (sc) {
    case 'green': return C.green;
    case 'amber': return C.amber500;
    case 'blue': return C.blue500;
    case 'red': return C.red500;
    default: return C.g200;
  }
}
