import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ACCOUNT_REPOSITORY,
  AccountingAccountRepository
} from '../ports/accounting-account.repository';
import { AccountingAccountPayload } from '../../domain/models/accounting-account.model';

@Injectable()
export class CreateAccountingAccountUseCase {
  private readonly repository = inject<AccountingAccountRepository>(
    ACCOUNTING_ACCOUNT_REPOSITORY
  );

  execute(payload: AccountingAccountPayload) {
    return this.repository.create(payload);
  }
}
