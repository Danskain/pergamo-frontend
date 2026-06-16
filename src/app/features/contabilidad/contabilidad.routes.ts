import { Routes } from '@angular/router';

import { ACCOUNTING_SUMMARY_REPOSITORY } from './application/ports/accounting-summary.repository';
import { GetAccountingSummaryUseCase } from './application/use-cases/get-accounting-summary.use-case';
import { MockAccountingSummaryRepository } from './infrastructure/adapters/mock-accounting-summary.repository';

export const CONTABILIDAD_ROUTES: Routes = [
  {
    path: '',
    providers: [
      GetAccountingSummaryUseCase,
      {
        provide: ACCOUNTING_SUMMARY_REPOSITORY,
        useClass: MockAccountingSummaryRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/contabilidad-page/contabilidad-page.component').then(
        (m) => m.ContabilidadPageComponent
      )
  }
];
