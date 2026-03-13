import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { C } from '../../shared/theme';
import {
  NavComponent,
  BackLinkComponent,
  ButtonComponent,
  PrevCredentialsFormComponent,
  TranslatePipe,
  SkeletonComponent,
  ApiService,
} from '../../shared';
import { I18nService } from '../../shared/i18n/i18n.service';
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
    TranslatePipe,
    SkeletonComponent,
  ],
  template: `
    <div class="page">
      <app-nav></app-nav>
      <div class="container">
        <app-back-link [to]="backLink" [label]="backLabel"></app-back-link>

        <h1 class="page-title">{{ 'credentials.title' | t }}</h1>
        <p class="page-desc">{{ 'credentials.desc' | t }}</p>

        <app-skeleton *ngIf="loading" type="text" [lines]="8"></app-skeleton>

        <ng-container *ngIf="!loading">
          <app-prev-credentials-form
            #formRef
            [showHeader]="false"
            [initialData]="initialData"
          ></app-prev-credentials-form>
        </ng-container>

        <div class="actions" *ngIf="!loading">
          <app-btn variant="ghost" size="lg" (clicked)="goBack()">&larr; {{ 'common.cancel' | t }}</app-btn>
          <app-btn variant="primary" size="lg" (clicked)="save()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {{ 'credentials.save' | t }}
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
      padding: 32px 32px 60px;
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
    @media (max-width: 768px) {
      .container { padding: 20px 16px 40px; }
    }
    @media (max-width: 480px) {
      .container { padding: 16px 12px 32px; }
      .page-title { font-size: 18px; }
      .actions { flex-direction: column; }
    }
  `]
})
export class EditCredentialsComponent implements OnInit {
  @ViewChild('formRef') formRef!: PrevCredentialsFormComponent;

  companyId = 0;
  backLink = '/dashboard/companies';
  backLabel = '';
  loading = true;
  initialData: Partial<PrevCredentialsData> | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private i18n: I18nService, private api: ApiService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('companyId'));
    this.companyId = id;
    this.backLink = '/dashboard/company/' + id;
    this.backLabel = this.i18n.t('credentials.back_to_company');

    this.api.getCompanyCredentials(String(id)).subscribe(data => {
      this.initialData = data;
      this.loading = false;
    });
  }

  goBack(): void {
    this.router.navigateByUrl(this.backLink);
  }

  save(): void {
    // In a real app, this would call an API. For the prototype, just navigate back.
    this.router.navigateByUrl(this.backLink);
  }
}
