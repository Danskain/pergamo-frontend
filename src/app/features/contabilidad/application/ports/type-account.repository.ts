import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  TypeAccount,
  TypeAccountPage,
  TypeAccountPayload
} from '../../domain/models/type-account.model';

export interface TypeAccountRepository {
  list(page: number, perPage: number): Observable<TypeAccountPage>;
  getById(id: number): Observable<TypeAccount>;
  create(payload: TypeAccountPayload): Observable<TypeAccount>;
  update(id: number, payload: TypeAccountPayload): Observable<TypeAccount>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<TypeAccount>;
}

export const TYPE_ACCOUNT_REPOSITORY = new InjectionToken<TypeAccountRepository>(
  'TYPE_ACCOUNT_REPOSITORY'
);
