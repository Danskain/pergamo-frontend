import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ACCOUNT_REPOSITORY,
  AccountingAccountRepository
} from '../ports/accounting-account.repository';

@Injectable()
export class ListAccountingAccountsUseCase {
  private readonly repository = inject<AccountingAccountRepository>(
    ACCOUNTING_ACCOUNT_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
