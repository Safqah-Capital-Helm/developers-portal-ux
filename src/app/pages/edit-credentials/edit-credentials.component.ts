import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { C } from '../../shared/theme';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  PrevCredentialsFormComponent,
} from '../../shared';
import type { PrevCredentialsData } from '../../shared';

@Component({
  selector: 'app-edit-credentials',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    BackLinkComponent,
    ButtonComponent,
    PrevCredentialsFormComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link [to]="backLink" [label]="backLabel"></app-back-link>

        <h1 class="page-title">Previous Credentials</h1>
        <p class="page-desc">Share your company track record to strengthen financing applications.</p>

        <app-prev-credentials-form
          #formRef
          [showHeader]="false"
          [initialData]="initialData"
        ></app-prev-credentials-form>

        <div class="actions">
          <app-btn variant="ghost" size="lg" (clicked)="goBack()">&larr; Cancel</app-btn>
          <app-btn variant="primary" size="lg" (clicked)="save()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Save Credentials
          </app-btn>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .page { min-height: 100vh; background: ${C.g50}; }
    .container {
      max-width: 640px;
      margin: 0 auto;
      padding: 28px 40px 60px;
    }
    .page-title {
      font-size: 22px; font-weight: 900; color: ${C.g900};
      margin: 0 0 6px;
    }
    .page-desc {
      font-size: 14px; color: ${C.g500}; margin: 0 0 24px;
      line-height: 1.5;
    }
    .actions {
      display: flex; gap: 12px; margin-top: 24px;
    }
    @media (max-width: 600px) {
      .container { padding: 20px 16px 40px; }
    }
  `]
})
export class EditCredentialsComponent implements OnInit {
  @ViewChild('formRef') formRef!: PrevCredentialsFormComponent;

  companyId = 0;
  backLink = '/dashboard/companies';
  backLabel = 'Back to Companies';
  initialData: Partial<PrevCredentialsData> | null = null;

  // Mirror of company data (same as company-detail for demo purposes)
  private companies = [
    {
      hasPrevProjects: true, prevCount: '12', prevValue: 'SAR 180M',
      finBank: 40, finFintech: 20, finFriends: 15,
    },
    {
      hasPrevProjects: false, prevCount: '', prevValue: '',
      finBank: 40, finFintech: 20, finFriends: 15,
    },
    {
      hasPrevProjects: false, prevCount: '', prevValue: '',
      finBank: 40, finFintech: 20, finFriends: 15,
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('companyId'));
    this.companyId = id;
    this.backLink = '/dashboard/company/' + id;
    this.backLabel = 'Back to Company';

    if (id >= 0 && id < this.companies.length) {
      this.initialData = this.companies[id];
    }
  }

  goBack(): void {
    this.router.navigateByUrl(this.backLink);
  }

  save(): void {
    // In a real app, this would call an API. For the prototype, just navigate back.
    this.router.navigateByUrl(this.backLink);
  }
}
