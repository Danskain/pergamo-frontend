import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  FinancialStatement,
  FinancialStatementPage,
  FinancialStatementPayload
} from '../../domain/models/financial-statement.model';

export interface FinancialStatementRepository {
  list(page: number, perPage: number): Observable<FinancialStatementPage>;
  getById(id: number): Observable<FinancialStatement>;
  create(payload: FinancialStatementPayload): Observable<FinancialStatement>;
  update(id: number, payload: FinancialStatementPayload): Observable<FinancialStatement>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<FinancialStatement>;
}

export const FINANCIAL_STATEMENT_REPOSITORY = new InjectionToken<FinancialStatementRepository>(
  'FINANCIAL_STATEMENT_REPOSITORY'
);
