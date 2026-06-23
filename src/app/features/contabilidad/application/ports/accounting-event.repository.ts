import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountingEvent,
  AccountingEventPage,
  AccountingEventPayload
} from '../../domain/models/accounting-event.model';

export interface AccountingEventRepository {
  list(page: number, perPage: number): Observable<AccountingEventPage>;
  getById(id: number): Observable<AccountingEvent>;
  create(payload: AccountingEventPayload): Observable<AccountingEvent>;
  update(id: number, payload: AccountingEventPayload): Observable<AccountingEvent>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountingEvent>;
}

export const ACCOUNTING_EVENT_REPOSITORY = new InjectionToken<AccountingEventRepository>(
  'ACCOUNTING_EVENT_REPOSITORY'
);
