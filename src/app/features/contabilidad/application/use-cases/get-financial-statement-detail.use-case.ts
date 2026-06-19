import { inject, Injectable } from '@angular/core';

import {
  FINANCIAL_STATEMENT_REPOSITORY,
  FinancialStatementRepository
} from '../ports/financial-statement.repository';

@Injectable()
export class GetFinancialStatementDetailUseCase {
  private readonly repository = inject<FinancialStatementRepository>(
    FINANCIAL_STATEMENT_REPOSITORY
  );

  execute(id: number) {
    return this.repository.getById(id);
  }
}
