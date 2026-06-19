import { inject, Injectable } from '@angular/core';

import {
  FINANCIAL_STATEMENT_REPOSITORY,
  FinancialStatementRepository
} from '../ports/financial-statement.repository';

@Injectable()
export class ListFinancialStatementsUseCase {
  private readonly repository = inject<FinancialStatementRepository>(
    FINANCIAL_STATEMENT_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
