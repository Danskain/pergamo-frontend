import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CostCenterNature,
  CostCenterNaturePage,
  CostCenterNaturePayload
} from '../../domain/models/cost-center-nature.model';

export interface CostCenterNatureRepository {
  list(page: number, perPage: number): Observable<CostCenterNaturePage>;
  getById(id: number): Observable<CostCenterNature>;
  create(payload: CostCenterNaturePayload): Observable<CostCenterNature>;
  update(id: number, payload: CostCenterNaturePayload): Observable<CostCenterNature>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<CostCenterNature>;
}

export const COST_CENTER_NATURE_REPOSITORY = new InjectionToken<CostCenterNatureRepository>(
  'COST_CENTER_NATURE_REPOSITORY'
);
