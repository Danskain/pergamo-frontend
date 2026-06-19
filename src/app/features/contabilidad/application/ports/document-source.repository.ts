import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  DocumentSource,
  DocumentSourcePage,
  DocumentSourcePayload
} from '../../domain/models/document-source.model';

export interface DocumentSourceRepository {
  list(page: number, perPage: number): Observable<DocumentSourcePage>;
  getById(id: number): Observable<DocumentSource>;
  create(payload: DocumentSourcePayload): Observable<DocumentSource>;
  update(id: number, payload: DocumentSourcePayload): Observable<DocumentSource>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<DocumentSource>;
}

export const DOCUMENT_SOURCE_REPOSITORY = new InjectionToken<DocumentSourceRepository>(
  'DOCUMENT_SOURCE_REPOSITORY'
);
