import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { KeyOperation, KeyOperationPage, KeyOperationPayload } from '../../domain/models/key-operation.model';

export interface KeyOperationRepository {
  list(page: number, perPage: number): Observable<KeyOperationPage>;
  getById(id: number): Observable<KeyOperation>;
  create(payload: KeyOperationPayload): Observable<KeyOperation>;
  update(id: number, payload: KeyOperationPayload): Observable<KeyOperation>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<KeyOperation>;
}

export const KEY_OPERATION_REPOSITORY = new InjectionToken<KeyOperationRepository>(
  'KEY_OPERATION_REPOSITORY'
);
