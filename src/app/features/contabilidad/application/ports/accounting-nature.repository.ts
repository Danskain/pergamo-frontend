import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountingNature,
  AccountingNaturePage,
  AccountingNaturePayload
} from '../../domain/models/accounting-nature.model';

export interface AccountingNatureRepository {
  list(page: number, perPage: number): Observable<AccountingNaturePage>;
  getById(id: number): Observable<AccountingNature>;
  create(payload: AccountingNaturePayload): Observable<AccountingNature>;
  update(id: number, payload: AccountingNaturePayload): Observable<AccountingNature>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountingNature>;
}

export const ACCOUNTING_NATURE_REPOSITORY =
  new InjectionToken<AccountingNatureRepository>('ACCOUNTING_NATURE_REPOSITORY');
