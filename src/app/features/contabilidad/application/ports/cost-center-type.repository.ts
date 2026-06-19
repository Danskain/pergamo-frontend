import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CostCenterType,
  CostCenterTypePage,
  CostCenterTypePayload
} from '../../domain/models/cost-center-type.model';

export interface CostCenterTypeRepository {
  list(page: number, perPage: number): Observable<CostCenterTypePage>;
  getById(id: number): Observable<CostCenterType>;
  create(payload: CostCenterTypePayload): Observable<CostCenterType>;
  update(id: number, payload: CostCenterTypePayload): Observable<CostCenterType>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<CostCenterType>;
}

export const COST_CENTER_TYPE_REPOSITORY = new InjectionToken<CostCenterTypeRepository>(
  'COST_CENTER_TYPE_REPOSITORY'
);
