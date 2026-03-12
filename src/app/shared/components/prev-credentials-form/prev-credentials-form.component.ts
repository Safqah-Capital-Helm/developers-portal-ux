import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../theme';
import { InputComponent } from '../input/input.component';
import { CardComponent } from '../card/card.component';

export interface PrevCredentialsData {
  hasPrevProjects: boolean;
  prevCount: string;
  prevValue: string;
  finBank: number;
  finFintech: number;
  finFriends: number;
  finSelf: number;
}

@Component({
  selector: 'app-prev-credentials-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, CardComponent],
  template: `
    <app-card [padding]="32">
      <div class="section-header" *ngIf="showHeader">
        <div class="section-icon" [style.background]="'#eff8ff'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" [attr.stroke]="C.blue500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <h2 class="card-title" style="margin: 0;">Previous Credentials</h2>
      </div>

      <p *ngIf="showHeader" class="card-desc" style="margin: 16px 0 20px;">Tell us about your track record so we can better assess your application.</p>

      <div class="toggle-row">
        <div class="toggle-opt"
          [style.background]="hasPrevProjects ? C.greenLt : '#fff'"
          [style.borderColor]="hasPrevProjects ? C.green : C.g200"
          [style.color]="hasPrevProjects ? C.green : C.g500"
          (click)="hasPrevProjects = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Yes, we've completed projects
        </div>
        <div class="toggle-opt"
          [style.background]="!hasPrevProjects ? C.g50 : '#fff'"
          [style.borderColor]="!hasPrevProjects ? C.g400 : C.g200"
          [style.color]="!hasPrevProjects ? C.g700 : C.g500"
          (click)="hasPrevProjects = false">
          No previous credentials
        </div>
      </div>

      <div *ngIf="hasPrevProjects" class="prev-details">
        <app-input label="Completed projects" placeholder="e.g. 5" [value]="prevCount" (valueChange)="prevCount = $event"></app-input>
        <app-input label="Combined value (SAR)" placeholder="e.g. 50,000,000" [value]="prevValue" (valueChange)="prevValue = $event"></app-input>

        <div class="src-section">
          <div class="src-label">Financing sources</div>

          <div class="src-bar">
            <div class="src-bar-seg" *ngIf="finBank > 0" [style.width.%]="finBank" [style.background]="C.green">{{ finBank }}%</div>
            <div class="src-bar-seg" *ngIf="finFintech > 0" [style.width.%]="finFintech" [style.background]="C.blue500">{{ finFintech }}%</div>
            <div class="src-bar-seg" *ngIf="finFriends > 0" [style.width.%]="finFriends" [style.background]="C.amber500">{{ finFriends }}%</div>
            <div class="src-bar-seg" *ngIf="finSelf > 0" [style.width.%]="finSelf" [style.background]="C.g300">{{ finSelf }}%</div>
          </div>

          <div class="src-row">
            <div class="src-dot" [style.background]="C.green"></div>
            <span class="src-name">Bank</span>
            <div class="src-stepper">
              <button class="src-btn" [disabled]="finBank <= 0" (click)="adjustSource('bank', -5)">-</button>
              <span class="src-pct">{{ finBank }}%</span>
              <button class="src-btn" [disabled]="finSelf <= 0" (click)="adjustSource('bank', 5)">+</button>
            </div>
          </div>
          <div class="src-row">
            <div class="src-dot" [style.background]="C.blue500"></div>
            <span class="src-name">Fintech</span>
            <div class="src-stepper">
              <button class="src-btn" [disabled]="finFintech <= 0" (click)="adjustSource('fintech', -5)">-</button>
              <span class="src-pct">{{ finFintech }}%</span>
              <button class="src-btn" [disabled]="finSelf <= 0" (click)="adjustSource('fintech', 5)">+</button>
            </div>
          </div>
          <div class="src-row">
            <div class="src-dot" [style.background]="C.amber500"></div>
            <span class="src-name">Friends &amp; Family</span>
            <div class="src-stepper">
              <button class="src-btn" [disabled]="finFriends <= 0" (click)="adjustSource('friends', -5)">-</button>
              <span class="src-pct">{{ finFriends }}%</span>
              <button class="src-btn" [disabled]="finSelf <= 0" (click)="adjustSource('friends', 5)">+</button>
            </div>
          </div>
          <div class="src-row src-row-auto">
            <div class="src-dot" [style.background]="C.g300"></div>
            <span class="src-name">Self-Funded</span>
            <span class="src-auto" [style.color]="C.green">{{ finSelf }}%</span>
          </div>
        </div>
      </div>
    </app-card>
  `,
  styles: [`
    .section-header {
      display: flex; align-items: center; gap: 12px; margin-bottom: 4px;
    }
    .section-icon {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .card-title {
      font-size: 18px; font-weight: 900; color: ${C.g900};
    }
    .card-desc {
      font-size: 14px; color: ${C.g500}; line-height: 1.5; margin: 0;
    }

    /* Toggle row */
    .toggle-row { display: flex; gap: 10px; margin-bottom: 20px; }
    .toggle-opt {
      flex: 1; padding: 12px; border-radius: 10px; border: 1.5px solid ${C.g200};
      font-size: 13px; font-weight: 700; cursor: pointer; text-align: center;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: all 0.15s ease;
    }

    .prev-details { margin-top: 4px; }

    /* Financing source section */
    .src-section { margin-top: 8px; }
    .src-label { font-size: 13px; font-weight: 700; color: ${C.g700}; margin-bottom: 12px; }
    .src-bar {
      display: flex; height: 28px; border-radius: 8px; overflow: hidden;
      margin-bottom: 16px; background: ${C.g100};
    }
    .src-bar-seg {
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; color: #fff; min-width: 0;
      transition: width 0.2s ease; overflow: hidden; white-space: nowrap;
    }
    .src-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; background: ${C.g50}; border-radius: 10px; margin-bottom: 6px;
    }
    .src-row-auto { background: transparent; border: 1.5px dashed ${C.g200}; }
    .src-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .src-name { font-size: 13px; font-weight: 700; color: ${C.g700}; flex: 1; }
    .src-stepper {
      display: flex; align-items: center; background: #fff;
      border: 1.5px solid ${C.g200}; border-radius: 8px; overflow: hidden;
    }
    .src-btn {
      width: 32px; height: 32px; border: none; background: transparent;
      font-size: 16px; font-weight: 700; color: ${C.g600}; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: background 0.1s ease;
    }
    .src-btn:hover:not(:disabled) { background: ${C.g100}; }
    .src-btn:disabled { color: ${C.g300}; cursor: default; }
    .src-pct {
      font-size: 13px; font-weight: 800; color: ${C.g900}; width: 40px; text-align: center;
      border-left: 1px solid ${C.g200}; border-right: 1px solid ${C.g200}; padding: 0 4px;
    }
    .src-auto { font-size: 14px; font-weight: 800; margin-left: auto; }
  `]
})
export class PrevCredentialsFormComponent {
  readonly C = C;

  /** Whether to show the header (icon + title + description) */
  @Input() showHeader = true;

  /** Initial values — set these to pre-populate the form */
  @Input() set initialData(data: Partial<PrevCredentialsData> | null) {
    if (data) {
      this.hasPrevProjects = data.hasPrevProjects ?? true;
      this.prevCount = data.prevCount ?? '';
      this.prevValue = data.prevValue ?? '';
      this.finBank = data.finBank ?? 40;
      this.finFintech = data.finFintech ?? 20;
      this.finFriends = data.finFriends ?? 15;
    }
  }

  @Output() dataChange = new EventEmitter<PrevCredentialsData>();

  hasPrevProjects = true;
  prevCount = '';
  prevValue = '';
  finBank = 40;
  finFintech = 20;
  finFriends = 15;

  get finSelf(): number {
    return Math.max(0, 100 - this.finBank - this.finFintech - this.finFriends);
  }

  adjustSource(source: 'bank' | 'fintech' | 'friends', delta: number): void {
    const used = this.finBank + this.finFintech + this.finFriends;
    const remaining = 100 - used;
    if (source === 'bank') {
      this.finBank = Math.max(0, Math.min(this.finBank + delta, this.finBank + remaining));
    } else if (source === 'fintech') {
      this.finFintech = Math.max(0, Math.min(this.finFintech + delta, this.finFintech + remaining));
    } else {
      this.finFriends = Math.max(0, Math.min(this.finFriends + delta, this.finFriends + remaining));
    }
  }

  /** Returns the current form data */
  getData(): PrevCredentialsData {
    return {
      hasPrevProjects: this.hasPrevProjects,
      prevCount: this.prevCount,
      prevValue: this.prevValue,
      finBank: this.finBank,
      finFintech: this.finFintech,
      finFriends: this.finFriends,
      finSelf: this.finSelf,
    };
  }
}
