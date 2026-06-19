import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountingAccount,
  AccountingAccountPage,
  AccountingAccountPayload
} from '../../domain/models/accounting-account.model';

export interface AccountingAccountRepository {
  list(page: number, perPage: number): Observable<AccountingAccountPage>;
  getById(id: number): Observable<AccountingAccount>;
  create(payload: AccountingAccountPayload): Observable<AccountingAccount>;
  update(id: number, payload: AccountingAccountPayload): Observable<AccountingAccount>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountingAccount>;
}

export const ACCOUNTING_ACCOUNT_REPOSITORY = new InjectionToken<AccountingAccountRepository>(
  'ACCOUNTING_ACCOUNT_REPOSITORY'
);
