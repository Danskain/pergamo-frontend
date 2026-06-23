import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountingMoment,
  AccountingMomentPage,
  AccountingMomentPayload
} from '../../domain/models/accounting-moment.model';

export interface AccountingMomentRepository {
  list(page: number, perPage: number): Observable<AccountingMomentPage>;
  getById(id: number): Observable<AccountingMoment>;
  create(payload: AccountingMomentPayload): Observable<AccountingMoment>;
  update(id: number, payload: AccountingMomentPayload): Observable<AccountingMoment>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountingMoment>;
}

export const ACCOUNTING_MOMENT_REPOSITORY = new InjectionToken<AccountingMomentRepository>(
  'ACCOUNTING_MOMENT_REPOSITORY'
);
