import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { C } from '../../theme';

export interface TimelineEvent {
  date: string;
  time: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  type?: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for (group of grouped; track group.date) {
      <div class="date-group">
        <div class="date-header">
          <span class="date-label">{{ group.date }}</span>
          <div class="date-line"></div>
        </div>
        @for (event of group.events; track event.time + event.title; let last = $last) {
          <div class="event-row">
            <div class="timeline-track">
              <div class="dot"></div>
              @if (!last) {
                <div class="connector"></div>
              }
            </div>
            <div class="event-icon" [style.background]="event.color + '18'">
              <span [innerHTML]="safe(event.icon)"></span>
            </div>
            <div class="event-content">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-desc">{{ event.desc }}</div>
              <div class="event-time">{{ event.time }}</div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .date-group { margin-bottom: 8px; }
    .date-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }
    .date-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      white-space: nowrap;
    }
    .date-line {
      flex: 1;
      height: 1px;
      background: ${C.g200};
    }
    .event-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid ${C.g100};
      position: relative;
    }
    .timeline-track {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      padding-top: 6px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${C.white};
      border: 2px solid ${C.g300};
      z-index: 1;
      flex-shrink: 0;
    }
    .connector {
      width: 2px;
      flex: 1;
      background: ${C.g200};
      min-height: 24px;
      margin-top: 4px;
    }
    .event-icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .event-icon span { display: flex; align-items: center; justify-content: center; }
    .event-content { flex: 1; min-width: 0; }
    .event-title {
      font-size: 14px;
      font-weight: 700;
      color: ${C.g800};
    }
    .event-desc {
      font-size: 12px;
      color: ${C.g500};
      margin-top: 2px;
    }
    .event-time {
      font-size: 11px;
      color: ${C.g400};
      margin-top: 4px;
    }
  `]
})
export class TimelineComponent {
  @Input() events: TimelineEvent[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  get grouped(): { date: string; events: TimelineEvent[] }[] {
    const map = new Map<string, TimelineEvent[]>();
    for (const e of this.events) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return Array.from(map.entries()).map(([date, events]) => ({ date, events }));
  }

  safe(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
