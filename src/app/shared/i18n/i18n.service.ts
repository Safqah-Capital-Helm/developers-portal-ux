import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class I18nService {
  lang: 'en' | 'ar' = 'en';
  dir: 'ltr' | 'rtl' = 'ltr';
  private translations: Record<string, string> = {};
  private loaded = false;

  constructor() {
    // Restore from localStorage
    const saved = localStorage.getItem('safqah_lang') as 'en' | 'ar' | null;
    if (saved) {
      this.lang = saved;
      this.dir = saved === 'ar' ? 'rtl' : 'ltr';
    }
  }

  async init(): Promise<void> {
    await this.loadTranslations(this.lang);
    this.applyDir();
  }

  async setLang(lang: 'en' | 'ar'): Promise<void> {
    this.lang = lang;
    this.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('safqah_lang', lang);
    await this.loadTranslations(lang);
    this.applyDir();
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

  private async loadTranslations(lang: string): Promise<void> {
    try {
      const resp = await fetch(`assets/i18n/${lang}.json`);
      this.translations = await resp.json();
      this.loaded = true;
    } catch {
      // Fallback: keys display as-is
      this.translations = {};
    }
  }

  private applyDir(): void {
    document.documentElement.dir = this.dir;
    document.documentElement.lang = this.lang;
  }
}
