import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Reference, ReferencePage, ReferencePayload } from '../../domain/models/reference.model';

export interface ReferenceRepository {
  list(page: number, perPage: number): Observable<ReferencePage>;
  getById(id: number): Observable<Reference>;
  create(payload: ReferencePayload): Observable<Reference>;
  update(id: number, payload: ReferencePayload): Observable<Reference>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<Reference>;
}

export const REFERENCE_REPOSITORY = new InjectionToken<ReferenceRepository>(
  'REFERENCE_REPOSITORY'
);
