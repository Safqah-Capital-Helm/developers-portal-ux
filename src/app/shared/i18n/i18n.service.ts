import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class I18nService {
  lang: 'en' | 'ar' = 'en';
  dir: 'ltr' | 'rtl' = 'ltr';
  private translations: Record<string, string> = {};
  private loaded = false;
  private initPromise: Promise<void> | null = null;

  constructor(private zone: NgZone) {
    // Restore from localStorage
    const saved = this.getStoredLang() as 'en' | 'ar' | null;
    if (saved) {
      this.lang = saved;
      this.dir = saved === 'ar' ? 'rtl' : 'ltr';
    }
  }

  init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    this.initPromise = this.loadTranslations(this.lang).then(() => this.applyDir());
    return this.initPromise;
  }

  async setLang(lang: 'en' | 'ar'): Promise<void> {
    this.lang = lang;
    this.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.storeLang(lang);
    // Reload to ensure all computed data uses new translations
    window.location.reload();
  }

  t(key: string, params?: Record<string, string>): string {
    let val = this.translations[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        val = val.replace(new RegExp(`{{${k}}}`, 'g'), v);
      });
    }
    return val;
  }

  private getStoredLang(): string | null {
    try { return localStorage.getItem('safqah_lang'); } catch { return null; }
  }

  private storeLang(lang: string): void {
    try { localStorage.setItem('safqah_lang', lang); } catch {}
  }

  private async loadTranslations(lang: string): Promise<void> {
    try {
      const resp = await fetch(`assets/i18n/${lang}.json`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      this.translations = await resp.json();
      this.loaded = true;
    } catch (err) {
      console.error('[i18n] Failed to load translations for', lang, err);
      // Fallback: keys display as-is
      this.translations = {};
    }
  }

  private applyDir(): void {
    document.documentElement.dir = this.dir;
    document.documentElement.lang = this.lang;
  }
}
