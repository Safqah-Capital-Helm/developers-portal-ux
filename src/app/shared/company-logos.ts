/**
 * AI-generated company logos as SVG data URIs.
 * Each logo is a clean geometric design on a brand-colored gradient background.
 */

// ── Al Omran Real Estate Dev Co. ── Green building skyline
const AL_OMRAN_LOGO = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00c847"/>
      <stop offset="1" stop-color="#007a2e"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#g)"/>
  <rect x="16" y="44" width="20" height="38" rx="3" fill="#fff" opacity=".82"/>
  <rect x="40" y="20" width="20" height="62" rx="3" fill="#fff"/>
  <rect x="64" y="32" width="20" height="50" rx="3" fill="#fff" opacity=".88"/>
  <rect x="44" y="26" width="4" height="4" rx="1" fill="#00af3d" opacity=".35"/>
  <rect x="52" y="26" width="4" height="4" rx="1" fill="#00af3d" opacity=".35"/>
  <rect x="44" y="36" width="4" height="4" rx="1" fill="#00af3d" opacity=".35"/>
  <rect x="52" y="36" width="4" height="4" rx="1" fill="#00af3d" opacity=".35"/>
  <rect x="44" y="46" width="4" height="4" rx="1" fill="#00af3d" opacity=".35"/>
  <rect x="52" y="46" width="4" height="4" rx="1" fill="#00af3d" opacity=".35"/>
  <rect x="44" y="56" width="4" height="4" rx="1" fill="#00af3d" opacity=".35"/>
  <rect x="52" y="56" width="4" height="4" rx="1" fill="#00af3d" opacity=".35"/>
  <rect x="44" y="66" width="4" height="4" rx="1" fill="#00af3d" opacity=".35"/>
  <rect x="52" y="66" width="4" height="4" rx="1" fill="#00af3d" opacity=".35"/>
</svg>`)}`;

// ── Al Jazeera Development Co. ── Purple upward growth chevrons
const AL_JAZEERA_LOGO = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6c5ce7"/>
      <stop offset="1" stop-color="#3b23c4"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#g)"/>
  <path d="M50 20L74 48H26Z" fill="#fff" opacity=".45"/>
  <path d="M50 34L74 62H26Z" fill="#fff" opacity=".65"/>
  <path d="M50 48L74 76H26Z" fill="#fff" opacity=".9"/>
</svg>`)}`;

/** Map CR number → logo data URI */
const LOGOS_BY_CR: Record<string, string> = {
  '1551515151516515': AL_OMRAN_LOGO,
  '1020304050607': AL_JAZEERA_LOGO,
};

/** Map short/full company names → CR number */
const NAME_TO_CR: Record<string, string> = {
  'Al Omran Real Estate Dev Co.': '1551515151516515',
  'Al Omran Real Estate': '1551515151516515',
  'Al Jazeera Development Co.': '1020304050607',
  'Al Jazeera Development': '1020304050607',
};

/** Get company logo by CR number */
export function getCompanyLogo(cr: string): string {
  return LOGOS_BY_CR[cr] || '';
}

/** Get company logo by company name (short or full) */
export function getCompanyLogoByName(name: string): string {
  const cr = NAME_TO_CR[name];
  return cr ? LOGOS_BY_CR[cr] || '' : '';
}
