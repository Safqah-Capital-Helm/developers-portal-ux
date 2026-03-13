import { Component, EventEmitter, Input, Output, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

let modalIdCounter = 0;

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="modal-overlay"
         role="dialog"
         aria-modal="true"
         [attr.aria-labelledby]="titleId"
         (click)="closed.emit()"
         (keydown)="onKeydown($event)">
      <div
        class="modal-container"
        [class.wide]="wide"
        (click)="$event.stopPropagation()"
        #modalContainer
      >
        <div class="modal-header">
          <h3 class="modal-title" [id]="titleId">{{ title }}</h3>
          <button class="modal-close" (click)="closed.emit()" aria-label="Close dialog">&#x2715;</button>
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
        max-width: calc(100vw - 32px);
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
export class ModalComponent implements AfterViewInit, OnDestroy {
  @Input() title = '';
  @Input() wide = false;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('modalContainer') modalContainer!: ElementRef<HTMLElement>;

  titleId = `modal-title-${++modalIdCounter}`;

  private previouslyFocusedElement: HTMLElement | null = null;

  ngAfterViewInit() {
    // Store the element that had focus before the modal opened
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Focus the first focusable element inside the modal
    setTimeout(() => {
      const firstFocusable = this.getFocusableElements()[0];
      if (firstFocusable) {
        (firstFocusable as HTMLElement).focus();
      }
    });
  }

  ngOnDestroy() {
    // Restore focus to the previously focused element
    if (this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
      this.previouslyFocusedElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closed.emit();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent) {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      // Shift+Tab: if focus is on the first element, move to the last
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: if focus is on the last element, move to the first
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private getFocusableElements(): Element[] {
    if (!this.modalContainer) return [];
    const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(this.modalContainer.nativeElement.querySelectorAll(selector));
  }
}
