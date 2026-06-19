import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  TypePlan,
  TypePlanPage,
  TypePlanPayload
} from '../../domain/models/type-plan.model';

export interface TypePlanRepository {
  list(page: number, perPage: number): Observable<TypePlanPage>;
  getById(id: number): Observable<TypePlan>;
  create(payload: TypePlanPayload): Observable<TypePlan>;
  update(id: number, payload: TypePlanPayload): Observable<TypePlan>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<TypePlan>;
}

export const TYPE_PLAN_REPOSITORY = new InjectionToken<TypePlanRepository>(
  'TYPE_PLAN_REPOSITORY'
);
