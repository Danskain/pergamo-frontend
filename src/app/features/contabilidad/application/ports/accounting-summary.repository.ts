import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountingSummary } from '../../domain/models/accounting-summary.model';

export interface AccountingSummaryRepository {
  getSummary(): Observable<AccountingSummary>;
}

export const ACCOUNTING_SUMMARY_REPOSITORY =
  new InjectionToken<AccountingSummaryRepository>('ACCOUNTING_SUMMARY_REPOSITORY');
