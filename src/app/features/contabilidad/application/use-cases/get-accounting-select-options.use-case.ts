import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
  AccountingSelectOptionsQuery,
  AccountingSelectOptionsRepository
} from '../ports/accounting-select-options.repository';

@Injectable()
export class GetAccountingSelectOptionsUseCase {
  private readonly repository = inject<AccountingSelectOptionsRepository>(
    ACCOUNTING_SELECT_OPTIONS_REPOSITORY
  );

  execute(catalogs: string[], query?: AccountingSelectOptionsQuery) {
    return this.repository.getMany(catalogs, query);
  }
}
