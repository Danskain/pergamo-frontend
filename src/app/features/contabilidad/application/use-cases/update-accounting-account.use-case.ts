import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ACCOUNT_REPOSITORY,
  AccountingAccountRepository
} from '../ports/accounting-account.repository';
import { AccountingAccountPayload } from '../../domain/models/accounting-account.model';

@Injectable()
export class UpdateAccountingAccountUseCase {
  private readonly repository = inject<AccountingAccountRepository>(
    ACCOUNTING_ACCOUNT_REPOSITORY
  );

  execute(id: number, payload: AccountingAccountPayload) {
    return this.repository.update(id, payload);
  }
}
