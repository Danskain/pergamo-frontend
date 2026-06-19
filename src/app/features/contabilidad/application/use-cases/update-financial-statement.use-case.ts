import { inject, Injectable } from '@angular/core';

import {
  FINANCIAL_STATEMENT_REPOSITORY,
  FinancialStatementRepository
} from '../ports/financial-statement.repository';
import { FinancialStatementPayload } from '../../domain/models/financial-statement.model';

@Injectable()
export class UpdateFinancialStatementUseCase {
  private readonly repository = inject<FinancialStatementRepository>(
    FINANCIAL_STATEMENT_REPOSITORY
  );

  execute(id: number, payload: FinancialStatementPayload) {
    return this.repository.update(id, payload);
  }
}
