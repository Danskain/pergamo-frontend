import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountClass,
  AccountClassPage,
  AccountClassPayload
} from '../../domain/models/account-class.model';

export interface AccountClassRepository {
  list(page: number, perPage: number): Observable<AccountClassPage>;
  getById(id: number): Observable<AccountClass>;
  create(payload: AccountClassPayload): Observable<AccountClass>;
  update(id: number, payload: AccountClassPayload): Observable<AccountClass>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountClass>;
}

export const ACCOUNT_CLASS_REPOSITORY = new InjectionToken<AccountClassRepository>(
  'ACCOUNT_CLASS_REPOSITORY'
);
