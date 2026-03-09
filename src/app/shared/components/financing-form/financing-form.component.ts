import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { C } from '../../theme';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-financing-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  template: `
    <!-- 1. Total Project Cost -->
    <app-input
      label="Estimated Total Project Cost"
      placeholder="e.g. 50,000,000"
      suffix="SAR"
      helper="Total estimated project cost including land, construction, and other expenses"
      [value]="totalCost"
      (valueChange)="totalCost = $event; totalCostChange.emit($event)"
    ></app-input>

    <!-- 2. Cost Breakdown (shown when cost entered) -->
    <div *ngIf="parsedCost > 0" class="section">
      <div class="section-label">Cost Breakdown</div>
      <div class="breakdown-slider">
        <div class="slider-header">
          <span class="slider-tag" [style.color]="C.amber600">Land {{ landCostPct }}%</span>
          <span class="slider-tag" [style.color]="C.blue500">Development {{ 100 - landCostPct }}%</span>
        </div>
        <div class="dual-track">
          <div class="track-fill-land" [style.width.%]="landCostPct"></div>
          <div class="track-fill-dev" [style.width.%]="100 - landCostPct" [style.left.%]="landCostPct"></div>
          <div class="track-thumb" [style.left.%]="landCostPct">
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <line x1="3" y1="3" x2="3" y2="11" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="7" y1="3" x2="7" y2="11" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <input
            type="range"
            min="0" max="100" step="1"
            class="range-input"
            [ngModel]="landCostPct"
            (ngModelChange)="landCostPct = $event; landCostPctChange.emit($event)"
          />
        </div>
        <div class="drag-hint">Drag to adjust split</div>
      </div>
      <div class="stat-row">
        <div class="stat-box" [style.borderColor]="C.amber100" [style.background]="C.amber50">
          <div class="stat-label" [style.color]="C.amber600">Land Cost</div>
          <div class="stat-value">{{ fmt(landCostVal) }} <span class="stat-unit">SAR</span></div>
          <div class="stat-sub" [style.color]="C.amber500">{{ landCostPct }}% of total</div>
        </div>
        <div class="stat-box" [style.borderColor]="C.blue100" [style.background]="C.blue50">
          <div class="stat-label" [style.color]="C.blue500">Development Cost</div>
          <div class="stat-value">{{ fmt(devCostVal) }} <span class="stat-unit">SAR</span></div>
          <div class="stat-sub" [style.color]="C.blue500">{{ 100 - landCostPct }}% of total</div>
        </div>
      </div>
    </div>

    <!-- 3. Financing Request (shown when cost entered) -->
    <div *ngIf="parsedCost > 0" class="section">
      <div class="section-label">Financing Request</div>
      <div class="amount-display">
        <div class="amount-num">{{ fmt(financingAmount) }}</div>
        <div class="amount-sar">SAR</div>
      </div>
      <div class="amount-pct">{{ financingPct }}% of total project cost</div>
      <div class="slider-wrap">
        <div class="slider-labels">
          <span>10%</span>
          <span>90%</span>
        </div>
        <input
          type="range"
          min="10" max="90" step="1"
          class="range-input green-range"
          [ngModel]="financingPct"
          (ngModelChange)="financingPct = $event; financingPctChange.emit($event)"
        />
      </div>
    </div>

    <!-- 4. Financing Product -->
    <div class="section">
      <div class="section-label">Financing Product</div>
      <div class="product-grid">
        <div
          *ngFor="let p of products"
          class="product-btn"
          [style.borderColor]="product === p.id ? C.green : C.g200"
          [style.background]="product === p.id ? C.greenLt : C.white"
          (click)="product = p.id; productChange.emit(p.id)">
          <div class="product-icon-wrap" [style.color]="product === p.id ? C.green : C.g400">
            <svg *ngIf="p.id==='land'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <svg *ngIf="p.id==='dev'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="16" rx="2"/><path d="M12 2v4m-4 8h8"/></svg>
            <svg *ngIf="p.id==='rawland'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            <svg *ngIf="p.id==='bridge'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1.5-2 4-2 5.5 4 8 4 4-2 4-2V3s-1.5 2-4 2-5.5-4-8-4-4 2-4 2z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          </div>
          <div>
            <div class="product-title" [style.color]="product === p.id ? C.greenDk : C.g800">{{ p.t }}</div>
            <div class="product-desc" [style.color]="product === p.id ? C.green : C.g400">{{ p.d }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Expected Revenue -->
    <div class="section">
      <app-input
        label="Expected Revenue"
        placeholder="e.g. 75,000,000"
        suffix="SAR"
        helper="Total expected revenue from sales"
        [value]="expectedRevenue"
        (valueChange)="expectedRevenue = $event; expectedRevenueChange.emit($event)"
      ></app-input>

      <div *ngIf="parsedRevenue > 0 && (parsedUnits > 0 || parsedArea > 0)" class="stat-row">
        <div *ngIf="parsedUnits > 0" class="stat-box" [style.borderColor]="C.greenMd" [style.background]="C.greenLt">
          <div class="stat-label" [style.color]="C.green">Avg. Revenue per Unit</div>
          <div class="stat-value">{{ fmt(revenuePerUnit) }} <span class="stat-unit">SAR</span></div>
          <div class="stat-sub" [style.color]="C.green">Based on {{ expectedUnits }} units</div>
        </div>
        <div *ngIf="parsedArea > 0" class="stat-box" [style.borderColor]="C.greenMd" [style.background]="C.greenLt">
          <div class="stat-label" [style.color]="C.green">Avg. Revenue per m\u00B2</div>
          <div class="stat-value">{{ fmt(revenuePerSqm) }} <span class="stat-unit">SAR/m\u00B2</span></div>
          <div class="stat-sub" [style.color]="C.green">Based on {{ totalSellingArea }} m\u00B2</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section {
      padding-top: 24px;
      margin-top: 24px;
      border-top: 1px solid ${C.g100};
    }

    .section:first-child {
      padding-top: 0;
      margin-top: 0;
      border-top: none;
    }

    .section-label {
      font-size: 13px;
      font-weight: 700;
      color: ${C.g700};
      margin-bottom: 12px;
    }

    /* Cost Breakdown Slider */
    .breakdown-slider {
      margin-bottom: 20px;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .slider-tag {
      font-size: 12px;
      font-weight: 700;
    }

    .dual-track {
      position: relative;
      height: 14px;
      border-radius: 7px;
      background: ${C.g100};
      margin-bottom: 4px;
      cursor: pointer;
    }

    .track-fill-land {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: ${C.amber500};
      border-radius: 7px 0 0 7px;
      pointer-events: none;
    }

    .track-fill-dev {
      position: absolute;
      top: 0;
      height: 100%;
      background: ${C.blue500};
      border-radius: 0 7px 7px 0;
      pointer-events: none;
    }

    .track-thumb {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: ${C.g700};
      border: 3px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 2;
      transition: box-shadow 0.15s;
    }

    .dual-track:hover .track-thumb {
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
    }

    .dual-track .range-input {
      position: absolute;
      top: -10px;
      left: 0;
      width: 100%;
      height: 34px;
      opacity: 0;
      cursor: pointer;
      z-index: 3;
    }

    .drag-hint {
      font-size: 11px;
      color: ${C.g400};
      text-align: center;
      margin-top: 6px;
    }

    /* Stat Boxes */
    .stat-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    .stat-box {
      border: 1.5px solid ${C.g200};
      border-radius: 14px;
      padding: 18px 20px;
    }

    .stat-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 900;
      color: ${C.g900};
      line-height: 1.2;
    }

    .stat-unit {
      font-size: 13px;
      font-weight: 600;
      color: ${C.g400};
    }

    .stat-sub {
      font-size: 11px;
      font-weight: 600;
      margin-top: 6px;
    }

    /* Financing Amount Display */
    .amount-display {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 8px;
      padding: 24px 0 6px;
    }

    .amount-num {
      font-size: 40px;
      font-weight: 900;
      color: ${C.g900};
    }

    .amount-sar {
      font-size: 16px;
      font-weight: 600;
      color: ${C.g500};
    }

    .amount-pct {
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      color: ${C.green};
      margin-bottom: 20px;
    }

    /* Slider */
    .slider-wrap {
      margin-bottom: 4px;
    }

    .slider-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: ${C.g400};
      font-weight: 600;
      margin-bottom: 6px;
    }

    .green-range {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      appearance: none;
      background: ${C.g200};
      border-radius: 3px;
      outline: none;
      cursor: pointer;
    }

    .green-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: ${C.green};
      border: 3px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      cursor: pointer;
    }

    .green-range::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: ${C.green};
      border: 3px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      cursor: pointer;
    }

    /* Product Grid */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .product-btn {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 16px 14px;
      border-radius: 12px;
      border: 2px solid ${C.g200};
      cursor: pointer;
      text-align: left;
      transition: all 0.15s;
      background: ${C.white};
    }

    .product-btn:hover {
      border-color: ${C.green};
    }

    .product-icon-wrap {
      flex-shrink: 0;
      margin-top: 2px;
      display: flex;
    }

    .product-title {
      font-size: 13px;
      font-weight: 700;
    }

    .product-desc {
      font-size: 11px;
      line-height: 1.4;
      margin-top: 2px;
    }
  `]
})
export class FinancingFormComponent {
  C = C;

  @Input() totalCost = '';
  @Output() totalCostChange = new EventEmitter<string>();

  @Input() financingPct = 60;
  @Output() financingPctChange = new EventEmitter<number>();

  @Input() landCostPct = 40;
  @Output() landCostPctChange = new EventEmitter<number>();

  @Input() product = '';
  @Output() productChange = new EventEmitter<string>();

  @Input() expectedRevenue = '';
  @Output() expectedRevenueChange = new EventEmitter<string>();

  // Read-only inputs from project form
  @Input() expectedUnits = '';
  @Input() totalSellingArea = '';

  products = [
    { id: 'land', t: 'Land Acquisition', d: 'Acquire a land for development purposes' },
    { id: 'dev', t: 'Development', d: 'Develop residential or commercial units' },
    { id: 'rawland', t: 'Raw Lands Development', d: 'Develop raw lands' },
    { id: 'bridge', t: 'Bridge Financing', d: 'Short-term financing < 9 months' },
  ];

  private parseNum(s: string): number {
    return parseFloat(s.replace(/,/g, '')) || 0;
  }

  get parsedCost(): number { return this.parseNum(this.totalCost); }
  get parsedRevenue(): number { return this.parseNum(this.expectedRevenue); }
  get parsedUnits(): number { return this.parseNum(this.expectedUnits); }
  get parsedArea(): number { return this.parseNum(this.totalSellingArea); }

  get landCostVal(): number { return Math.round(this.parsedCost * this.landCostPct / 100); }
  get devCostVal(): number { return Math.round(this.parsedCost * (100 - this.landCostPct) / 100); }
  get financingAmount(): number { return Math.round(this.parsedCost * this.financingPct / 100); }

  get revenuePerUnit(): number {
    return this.parsedUnits > 0 ? Math.round(this.parsedRevenue / this.parsedUnits) : 0;
  }

  get revenuePerSqm(): number {
    return this.parsedArea > 0 ? Math.round(this.parsedRevenue / this.parsedArea) : 0;
  }

  fmt(n: number): string {
    return n.toLocaleString('en-US');
  }
}
