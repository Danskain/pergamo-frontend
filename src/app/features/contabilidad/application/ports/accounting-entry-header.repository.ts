import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountingEntryHeader,
  AccountingEntryHeaderPage,
  AccountingEntryHeaderPayload
} from '../../domain/models/accounting-entry-header.model';

export interface AccountingEntryHeaderRepository {
  list(page: number, perPage: number): Observable<AccountingEntryHeaderPage>;
  getById(id: number): Observable<AccountingEntryHeader>;
  create(payload: AccountingEntryHeaderPayload): Observable<AccountingEntryHeader>;
  update(id: number, payload: AccountingEntryHeaderPayload): Observable<AccountingEntryHeader>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountingEntryHeader>;
}

export const ACCOUNTING_ENTRY_HEADER_REPOSITORY =
  new InjectionToken<AccountingEntryHeaderRepository>('ACCOUNTING_ENTRY_HEADER_REPOSITORY');
