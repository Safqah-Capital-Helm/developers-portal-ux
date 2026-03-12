import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="modal-overlay" (click)="closed.emit()">
      <div
        class="modal-container"
        [class.wide]="wide"
        (click)="$event.stopPropagation()"
      >
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" (click)="closed.emit()">&#x2715;</button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .modal-container {
        width: 540px;
        max-height: 90vh;
        overflow-y: auto;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      }

      .modal-container.wide {
        width: 680px;
      }

      .modal-header {
        padding: 18px 24px;
        border-bottom: 1px solid #e2e5e9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        background: #fff;
        z-index: 10;
        border-radius: 20px 20px 0 0;
      }

      .modal-title {
        font-size: 16px;
        font-weight: 800;
        color: #101828;
        margin: 0;
      }

      .modal-close {
        background: #f1f3f5;
        border: none;
        border-radius: 8px;
        padding: 5px 12px;
        font-size: 13px;
        cursor: pointer;
        font-weight: 600;
        color: #475467;
      }

      .modal-body {
        padding: 24px;
      }

      @media (max-width: 480px) {
        .modal-container {
          width: 100%;
          max-height: 100vh;
          height: 100vh;
          border-radius: 0;
        }
        .modal-container.wide {
          width: 100%;
        }
        .modal-header {
          border-radius: 0;
        }
        .modal-body {
          padding: 16px;
        }
      }
    `,
  ],
})
export class ModalComponent {
  @Input() title = '';
  @Input() wide = false;
  @Output() closed = new EventEmitter<void>();
}
