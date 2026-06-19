import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CostCenterClass,
  CostCenterClassPage,
  CostCenterClassPayload
} from '../../domain/models/cost-center-class.model';

export interface CostCenterClassRepository {
  list(page: number, perPage: number): Observable<CostCenterClassPage>;
  getById(id: number): Observable<CostCenterClass>;
  create(payload: CostCenterClassPayload): Observable<CostCenterClass>;
  update(id: number, payload: CostCenterClassPayload): Observable<CostCenterClass>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<CostCenterClass>;
}

export const COST_CENTER_CLASS_REPOSITORY = new InjectionToken<CostCenterClassRepository>(
  'COST_CENTER_CLASS_REPOSITORY'
);
