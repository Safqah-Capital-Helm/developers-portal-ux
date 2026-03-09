import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-steps',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-steps">
      <ng-container *ngFor="let step of steps; let i = index; let last = last">
        <div class="step-wrapper" [class.has-connector]="!last">
          <div class="step-label">
            <div
              class="step-circle"
              [class.done]="i < current"
              [class.active]="i === current"
            >
              <svg
                *ngIf="i < current"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span *ngIf="i >= current">{{ i + 1 }}</span>
            </div>
            <span
              class="step-text"
              [class.done]="i < current"
              [class.active]="i === current"
            >
              {{ step }}
            </span>
          </div>
          <div *ngIf="!last" class="connector" [class.done]="i < current"></div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .progress-steps {
        display: flex;
        align-items: center;
        gap: 0;
        margin-bottom: 28px;
      }

      .step-wrapper {
        display: flex;
        align-items: center;
      }

      .step-wrapper.has-connector {
        flex: 1;
      }

      .step-label {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .step-circle {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #f1f3f5;
        border: 2px solid #e2e5e9;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 800;
        color: #98a2b3;
        flex-shrink: 0;
      }

      .step-circle.done {
        background: #00a15a;
        border-color: #00a15a;
        color: #fff;
      }

      .step-circle.active {
        background: #fff;
        border-color: #00a15a;
        color: #00a15a;
      }

      .step-text {
        font-size: 12px;
        font-weight: 500;
        color: #98a2b3;
        white-space: nowrap;
      }

      .step-text.done {
        color: #00a15a;
      }

      .step-text.active {
        font-weight: 700;
        color: #101828;
      }

      .connector {
        flex: 1;
        height: 2px;
        background: #e2e5e9;
        margin: 0 10px;
        border-radius: 1px;
      }

      .connector.done {
        background: #00a15a;
      }
    `,
  ],
})
export class ProgressStepsComponent {
  @Input() steps: string[] = [];
  @Input() current: number = 0;
}
