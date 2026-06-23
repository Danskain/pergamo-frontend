import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountingScheme,
  AccountingSchemePage,
  AccountingSchemePayload
} from '../../domain/models/accounting-scheme.model';

export interface AccountingSchemeRepository {
  list(page: number, perPage: number): Observable<AccountingSchemePage>;
  getById(id: number): Observable<AccountingScheme>;
  create(payload: AccountingSchemePayload): Observable<AccountingScheme>;
  update(id: number, payload: AccountingSchemePayload): Observable<AccountingScheme>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountingScheme>;
}

export const ACCOUNTING_SCHEME_REPOSITORY = new InjectionToken<AccountingSchemeRepository>(
  'ACCOUNTING_SCHEME_REPOSITORY'
);
