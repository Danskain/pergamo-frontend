import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ACCOUNT_REPOSITORY,
  AccountingAccountRepository
} from '../ports/accounting-account.repository';

@Injectable()
export class GetAccountingAccountDetailUseCase {
  private readonly repository = inject<AccountingAccountRepository>(
    ACCOUNTING_ACCOUNT_REPOSITORY
  );

  execute(id: number) {
    return this.repository.getById(id);
  }
}
