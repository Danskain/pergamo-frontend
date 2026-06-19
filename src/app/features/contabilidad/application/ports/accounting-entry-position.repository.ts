import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountingEntryPosition,
  AccountingEntryPositionPage,
  AccountingEntryPositionPayload
} from '../../domain/models/accounting-entry-position.model';

export interface AccountingEntryPositionRepository {
  list(page: number, perPage: number): Observable<AccountingEntryPositionPage>;
  getById(id: number): Observable<AccountingEntryPosition>;
  create(payload: AccountingEntryPositionPayload): Observable<AccountingEntryPosition>;
  update(id: number, payload: AccountingEntryPositionPayload): Observable<AccountingEntryPosition>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountingEntryPosition>;
}

export const ACCOUNTING_ENTRY_POSITION_REPOSITORY = new InjectionToken<AccountingEntryPositionRepository>(
  'ACCOUNTING_ENTRY_POSITION_REPOSITORY'
);
