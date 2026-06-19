import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_STANDARD_REPOSITORY,
  AccountingStandardRepository
} from '../ports/accounting-standard.repository';

@Injectable()
export class ListAccountingStandardsUseCase {
  private readonly repository = inject<AccountingStandardRepository>(
    ACCOUNTING_STANDARD_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
