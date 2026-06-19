import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountingStandard,
  AccountingStandardPage,
  AccountingStandardPayload
} from '../../domain/models/accounting-standard.model';

export interface AccountingStandardRepository {
  list(page: number, perPage: number): Observable<AccountingStandardPage>;
  getById(id: number): Observable<AccountingStandard>;
  create(payload: AccountingStandardPayload): Observable<AccountingStandard>;
  update(id: number, payload: AccountingStandardPayload): Observable<AccountingStandard>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountingStandard>;
}

export const ACCOUNTING_STANDARD_REPOSITORY =
  new InjectionToken<AccountingStandardRepository>('ACCOUNTING_STANDARD_REPOSITORY');
