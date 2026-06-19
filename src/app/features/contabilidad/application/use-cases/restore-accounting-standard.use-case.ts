import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_STANDARD_REPOSITORY,
  AccountingStandardRepository
} from '../ports/accounting-standard.repository';

@Injectable()
export class RestoreAccountingStandardUseCase {
  private readonly repository = inject<AccountingStandardRepository>(
    ACCOUNTING_STANDARD_REPOSITORY
  );

  execute(id: number) {
    return this.repository.restore(id);
  }
}
