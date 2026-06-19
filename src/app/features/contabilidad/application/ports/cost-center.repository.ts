import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { CostCenter, CostCenterPage, CostCenterPayload } from '../../domain/models/cost-center.model';

export interface CostCenterRepository {
  list(page: number, perPage: number): Observable<CostCenterPage>;
  getById(id: number): Observable<CostCenter>;
  create(payload: CostCenterPayload): Observable<CostCenter>;
  update(id: number, payload: CostCenterPayload): Observable<CostCenter>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<CostCenter>;
}

export const COST_CENTER_REPOSITORY = new InjectionToken<CostCenterRepository>(
  'COST_CENTER_REPOSITORY'
);
