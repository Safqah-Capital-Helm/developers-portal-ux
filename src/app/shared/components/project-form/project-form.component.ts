import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../theme';
import { InputComponent } from '../input/input.component';
import { MapPickerComponent } from '../map-picker/map-picker.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, MapPickerComponent],
  template: `
    <!-- Project Name -->
    <app-input
      label="Project Name"
      placeholder="e.g. Al Noor Residential"
      [value]="name"
      (valueChange)="name = $event; nameChange.emit($event)"
    ></app-input>

    <!-- Project Type -->
    <div class="section-label">Project Type</div>
    <div class="selector-grid">
      <div
        *ngFor="let t of types"
        class="selector-card"
        [style.borderColor]="type === t.id ? C.green : C.g200"
        [style.background]="type === t.id ? C.greenLt : '#fff'"
        (click)="type = t.id; typeChange.emit(t.id)"
      >
        <div
          class="selector-icon"
          [style.background]="type === t.id ? C.green : C.g100"
          [style.color]="type === t.id ? '#fff' : C.g500"
        >
          <svg *ngIf="t.id === 'res'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <svg *ngIf="t.id === 'com'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
            <line x1="9" y1="6" x2="9" y2="6.01"/>
            <line x1="15" y1="6" x2="15" y2="6.01"/>
            <line x1="9" y1="10" x2="9" y2="10.01"/>
            <line x1="15" y1="10" x2="15" y2="10.01"/>
            <line x1="9" y1="14" x2="9" y2="14.01"/>
            <line x1="15" y1="14" x2="15" y2="14.01"/>
            <path d="M9 18h6"/>
          </svg>
          <svg *ngIf="t.id === 'mix'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="9" height="15" rx="1"/>
            <rect x="13" y="2" width="9" height="20" rx="1"/>
            <line x1="5" y1="10" x2="8" y2="10"/>
            <line x1="5" y1="14" x2="8" y2="14"/>
            <line x1="16" y1="6" x2="19" y2="6"/>
            <line x1="16" y1="10" x2="19" y2="10"/>
            <line x1="16" y1="14" x2="19" y2="14"/>
          </svg>
          <svg *ngIf="t.id === 'ind'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 20h20"/>
            <path d="M5 20V8l5 4V8l5 4V4h5v16"/>
            <line x1="17" y1="8" x2="17" y2="8.01"/>
            <line x1="17" y1="12" x2="17" y2="12.01"/>
            <line x1="17" y1="16" x2="17" y2="16.01"/>
          </svg>
          <svg *ngIf="t.id === 'land'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
        </div>
        <div class="selector-label">{{ t.t }}</div>
        <div class="selector-desc">{{ t.d }}</div>
      </div>
    </div>

    <!-- Current Stage (Horizontal Stepper) -->
    <div class="section-label" style="margin-top: 8px;">Current Stage</div>
    <div class="stepper">
      <ng-container *ngFor="let s of stages; let i = index; let last = last">
        <div class="stage-node" (click)="stage = s.id; stageChange.emit(s.id)">
          <div
            class="stage-dot"
            [style.width.px]="stage === s.id ? 22 : 14"
            [style.height.px]="stage === s.id ? 22 : 14"
            [style.background]="getDotBg(s, i)"
            [style.borderColor]="getDotBorder(s, i)"
            [style.borderWidth]="stage === s.id ? '3px' : (stageIdx(s.id) > selectedIdx ? '2px' : '0')"
            [style.boxShadow]="stage === s.id ? '0 2px 8px ' + s.c + '40' : 'none'"
          ></div>
          <div
            class="stage-label"
            [style.color]="stage === s.id ? s.c : (i <= selectedIdx ? C.g700 : C.g400)"
            [style.fontWeight]="stage === s.id ? '700' : '600'"
          >{{ s.l }}</div>
        </div>
        <div
          *ngIf="!last"
          class="stage-line"
          [style.background]="i < selectedIdx ? stages[i].c : C.g200"
        ></div>
      </ng-container>
    </div>

    <!-- Project Location -->
    <div class="section-label" style="margin-top: 24px;">Project Location</div>
    <app-map-picker></app-map-picker>

    <!-- Project Specifications -->
    <div class="section-label" style="margin-top: 24px;">Project Specifications</div>
    <div class="specs-grid">
      <app-input
        label="Expected Units"
        placeholder="e.g. 120"
        helper="Total number of units planned for sale"
        [value]="expectedUnits"
        (valueChange)="expectedUnits = $event; expectedUnitsChange.emit($event)"
      ></app-input>
      <app-input
        label="Total Building Area"
        placeholder="e.g. 15,000"
        suffix="m\u00B2"
        helper="Gross floor area in square meters"
        [value]="totalBuildingArea"
        (valueChange)="totalBuildingArea = $event; totalBuildingAreaChange.emit($event)"
      ></app-input>
      <app-input
        label="Total Selling Area"
        placeholder="e.g. 12,000"
        suffix="m\u00B2"
        helper="Net sellable area in square meters"
        [value]="totalSellingArea"
        (valueChange)="totalSellingArea = $event; totalSellingAreaChange.emit($event)"
      ></app-input>
      <app-input
        label="Project Period"
        placeholder="e.g. 24"
        suffix="months"
        helper="Estimated project duration in months"
        [value]="projectPeriod"
        (valueChange)="projectPeriod = $event; projectPeriodChange.emit($event)"
      ></app-input>
    </div>
  `,
  styles: [`
    .section-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      margin-bottom: 10px;
    }

    /* Type selector grid */
    .selector-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }

    .selector-card {
      border: 1.5px solid ${C.g200};
      border-radius: 12px;
      padding: 14px 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .selector-card:hover {
      border-color: ${C.g300};
    }

    .selector-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 8px;
      transition: all 0.15s ease;
    }

    .selector-label {
      font-size: 12px;
      font-weight: 700;
      color: ${C.g800};
      margin-bottom: 2px;
    }

    .selector-desc {
      font-size: 11px;
      color: ${C.g400};
    }

    /* Horizontal Stage Stepper */
    .stepper {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      padding: 8px 0;
    }

    .stage-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      min-width: 0;
      flex: 0 0 auto;
    }

    .stage-dot {
      border-radius: 50%;
      border-style: solid;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .stage-label {
      font-size: 11px;
      margin-top: 8px;
      white-space: nowrap;
      transition: color 0.15s ease;
    }

    .stage-line {
      flex: 1;
      height: 3px;
      border-radius: 2px;
      margin-top: 10px;
      min-width: 20px;
      transition: background 0.2s ease;
    }

    /* Project Specifications Grid */
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0 20px;
    }
  `]
})
export class ProjectFormComponent {
  C = C;

  @Input() name = '';
  @Output() nameChange = new EventEmitter<string>();

  @Input() type = '';
  @Output() typeChange = new EventEmitter<string>();

  @Input() stage = '';
  @Output() stageChange = new EventEmitter<string>();

  @Input() expectedUnits = '';
  @Output() expectedUnitsChange = new EventEmitter<string>();

  @Input() totalBuildingArea = '';
  @Output() totalBuildingAreaChange = new EventEmitter<string>();

  @Input() totalSellingArea = '';
  @Output() totalSellingAreaChange = new EventEmitter<string>();

  @Input() projectPeriod = '';
  @Output() projectPeriodChange = new EventEmitter<string>();

  types = [
    { id: 'res', t: 'Residential', d: 'Homes' },
    { id: 'com', t: 'Commercial', d: 'Offices' },
    { id: 'mix', t: 'Mixed Use', d: 'Combined' },
    { id: 'ind', t: 'Industrial', d: 'Warehouses' },
    { id: 'land', t: 'Land Dev', d: 'Raw land' },
  ];

  stages = [
    { id: 'plan', l: 'Planning', c: '#2e90fa' },
    { id: 'design', l: 'Design', c: '#8b5cf6' },
    { id: 'permit', l: 'Permits', c: '#f79009' },
    { id: 'build', l: 'Construction', c: '#00a15a' },
    { id: 'sale', l: 'Pre-Sale', c: '#ec4899' },
  ];

  get selectedIdx(): number {
    return this.stages.findIndex(s => s.id === this.stage);
  }

  stageIdx(id: string): number {
    return this.stages.findIndex(s => s.id === id);
  }

  getDotBg(s: { id: string; c: string }, i: number): string {
    if (this.stage === s.id) return '#fff';
    if (i <= this.selectedIdx) return s.c;
    return '#fff';
  }

  getDotBorder(s: { id: string; c: string }, i: number): string {
    if (this.stage === s.id) return s.c;
    if (i <= this.selectedIdx) return s.c;
    return C.g300;
  }
}
