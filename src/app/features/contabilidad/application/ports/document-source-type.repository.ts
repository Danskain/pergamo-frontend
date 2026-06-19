import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  DocumentSourceType,
  DocumentSourceTypePage,
  DocumentSourceTypePayload
} from '../../domain/models/document-source-type.model';

export interface DocumentSourceTypeRepository {
  list(page: number, perPage: number): Observable<DocumentSourceTypePage>;
  getById(id: number): Observable<DocumentSourceType>;
  create(payload: DocumentSourceTypePayload): Observable<DocumentSourceType>;
  update(id: number, payload: DocumentSourceTypePayload): Observable<DocumentSourceType>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<DocumentSourceType>;
}

export const DOCUMENT_SOURCE_TYPE_REPOSITORY =
  new InjectionToken<DocumentSourceTypeRepository>('DOCUMENT_SOURCE_TYPE_REPOSITORY');
