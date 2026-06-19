import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccountingDocument,
  AccountingDocumentPage,
  AccountingDocumentPayload
} from '../../domain/models/accounting-document.model';

export interface AccountingDocumentRepository {
  list(page: number, perPage: number): Observable<AccountingDocumentPage>;
  getById(id: number): Observable<AccountingDocument>;
  create(payload: AccountingDocumentPayload): Observable<AccountingDocument>;
  update(id: number, payload: AccountingDocumentPayload): Observable<AccountingDocument>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<AccountingDocument>;
}

export const ACCOUNTING_DOCUMENT_REPOSITORY =
  new InjectionToken<AccountingDocumentRepository>('ACCOUNTING_DOCUMENT_REPOSITORY');
