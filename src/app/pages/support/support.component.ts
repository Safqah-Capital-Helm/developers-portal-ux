import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../shared/theme';
import { NavComponent, BackLinkComponent, CardComponent, InputComponent, ButtonComponent } from '../../shared';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent, BackLinkComponent, CardComponent, InputComponent, ButtonComponent],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link to="/dashboard" label="Back to Dashboard"></app-back-link>

        <h1 class="page-title">Help & Support</h1>
        <p class="page-subtitle">Get in touch or find answers to common questions</p>

        <!-- Contact channels -->
        <div class="channels-grid">
          <div class="channel-card">
            <div class="channel-icon" style="background: ${C.greenLt};">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <span class="channel-label">Email</span>
            <span class="channel-value">support&#64;safqah.com</span>
            <span class="channel-sub">4h response</span>
          </div>
          <div class="channel-card">
            <div class="channel-icon" style="background: ${C.blue50};">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.blue500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <span class="channel-label">Phone</span>
            <span class="channel-value">+966 800 000 000</span>
            <span class="channel-sub">Sun-Thu 9-5</span>
          </div>
          <div class="channel-card">
            <div class="channel-icon" style="background: #e6faf0;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25d366"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#25d366" stroke-width="1.5" fill="none"/>
              </svg>
            </div>
            <span class="channel-label">WhatsApp</span>
            <span class="channel-value">+966 5XX XXX</span>
            <span class="channel-sub">Fastest</span>
          </div>
        </div>

        <!-- FAQ Section -->
        <h2 class="section-title">Frequently Asked Questions</h2>

        <div class="faq-list">
          <div class="faq-item" *ngFor="let faq of faqs; let i = index">
            <button class="faq-header" (click)="toggleFaq(i)">
              <span class="faq-question">{{ faq.q }}</span>
              <svg class="faq-chevron" [class.open]="faq.open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.g400}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="faq-answer-wrapper" [class.open]="faq.open">
              <div class="faq-answer">{{ faq.a }}</div>
            </div>
          </div>
        </div>

        <!-- Send a message -->
        <h2 class="section-title">Send a Message</h2>

        <app-card [padding]="24">
          <div *ngIf="!sent">
            <app-input
              label="Subject"
              placeholder="What can we help with?"
              [value]="subj"
              (valueChange)="subj = $event"
            ></app-input>

            <div class="textarea-wrapper">
              <label class="textarea-label">Message</label>
              <textarea
                class="textarea-field"
                placeholder="Describe your question or issue..."
                [(ngModel)]="msg"
                rows="5"
              ></textarea>
            </div>

            <app-btn
              variant="primary"
              [full]="true"
              [disabled]="!subj.trim() || !msg.trim()"
              (clicked)="send()"
            >Send Message</app-btn>
          </div>

          <div *ngIf="sent" class="sent-state">
            <div class="sent-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 class="sent-title">Message sent!</h3>
            <p class="sent-sub">We'll respond within 4 hours.</p>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page {
      min-height: 100vh;
      background: ${C.bg};
    }

    .container {
      max-width: 680px;
      margin: 0 auto;
      padding: 32px;
    }

    .page-title {
      font-size: 22px;
      font-weight: 900;
      color: ${C.g900};
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: ${C.g500};
      margin: 0 0 24px 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: ${C.g900};
      margin: 32px 0 16px 0;
    }

    /* Contact channels grid */
    .channels-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .channel-card {
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-radius: 14px;
      padding: 20px 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .channel-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }

    .channel-label {
      font-size: 11px;
      font-weight: 700;
      color: ${C.g400};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .channel-value {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g900};
    }

    .channel-sub {
      font-size: 11px;
      color: ${C.g400};
    }

    /* FAQ list */
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 0;
      background: ${C.white};
      border: 1px solid ${C.g200};
      border-radius: 14px;
      overflow: hidden;
    }

    .faq-item {
      border-bottom: 1px solid ${C.g100};
    }

    .faq-item:last-child {
      border-bottom: none;
    }

    .faq-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
      text-align: left;
    }

    .faq-header:hover {
      background: ${C.g50};
    }

    .faq-question {
      font-size: 14px;
      font-weight: 600;
      color: ${C.g800};
    }

    .faq-chevron {
      flex-shrink: 0;
      transition: transform 0.25s ease;
    }

    .faq-chevron.open {
      transform: rotate(180deg);
    }

    .faq-answer-wrapper {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .faq-answer-wrapper.open {
      max-height: 200px;
    }

    .faq-answer {
      padding: 0 20px 16px 20px;
      font-size: 13px;
      color: ${C.g500};
      line-height: 1.6;
    }

    /* Textarea */
    .textarea-wrapper {
      margin-bottom: 16px;
    }

    .textarea-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      display: block;
      margin-bottom: 6px;
    }

    .textarea-field {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid ${C.g200};
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      background: ${C.white};
      color: ${C.g900};
      box-sizing: border-box;
      font-family: inherit;
      resize: vertical;
    }

    .textarea-field:focus {
      border-color: ${C.green};
    }

    /* Sent state */
    .sent-state {
      text-align: center;
      padding: 24px 0;
    }

    .sent-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${C.green};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
      box-shadow: 0 6px 20px rgba(0, 161, 90, 0.25);
    }

    .sent-title {
      font-size: 18px;
      font-weight: 800;
      color: ${C.g900};
      margin: 0 0 4px 0;
    }

    .sent-sub {
      font-size: 14px;
      color: ${C.g500};
      margin: 0;
    }
  `]
})
export class SupportComponent {
  subj = '';
  msg = '';
  sent = false;

  faqs = [
    { q: 'How long does review take?', a: 'Company: ~1 day. Project: 1-2 days. Term-sheet within 48h of submission.', open: false },
    { q: 'What documents do I need?', a: 'Most data is pulled automatically. You can optionally upload project profiles and supporting docs.', open: false },
    { q: 'Can I add multiple projects?', a: 'Yes! Add unlimited projects under any registered company.', open: false },
    { q: 'What financing products are available?', a: 'Land acquisition, development, construction, and bridge financing — all Sharia-compliant.', open: false },
    { q: 'How is the credit check done?', a: 'Via a licensed credit bureau. It does not affect your credit score.', open: false },
    { q: 'Can I invite team members?', a: 'Yes, with Admin, Editor, Contributor, or Viewer roles.', open: false },
  ];

  constructor(private router: Router) {}

  go(path: string) { this.router.navigateByUrl(path); }

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }

  send() {
    this.sent = true;
  }
}
