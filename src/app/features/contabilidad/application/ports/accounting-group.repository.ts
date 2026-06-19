import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountingGroup,
  AccountingGroupPage,
  AccountingGroupPayload
} from '../../domain/models/accounting-group.model';

export interface AccountingGroupRepository {
  list(page: number, perPage: number): Observable<AccountingGroupPage>;
  getById(id: number): Observable<AccountingGroup>;
  create(payload: AccountingGroupPayload): Observable<AccountingGroup>;
  update(id: number, payload: AccountingGroupPayload): Observable<AccountingGroup>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountingGroup>;
}

export const ACCOUNTING_GROUP_REPOSITORY = new InjectionToken<AccountingGroupRepository>(
  'ACCOUNTING_GROUP_REPOSITORY'
);
