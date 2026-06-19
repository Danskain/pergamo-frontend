import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ChartAccount,
  ChartAccountPage,
  ChartAccountPayload
} from '../../domain/models/chart-account.model';

export interface ChartAccountRepository {
  list(page: number, perPage: number): Observable<ChartAccountPage>;
  getById(id: number): Observable<ChartAccount>;
  create(payload: ChartAccountPayload): Observable<ChartAccount>;
  update(id: number, payload: ChartAccountPayload): Observable<ChartAccount>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<ChartAccount>;
}

export const CHART_ACCOUNT_REPOSITORY = new InjectionToken<ChartAccountRepository>(
  'CHART_ACCOUNT_REPOSITORY'
);
