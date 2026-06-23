import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_MOMENT_REPOSITORY,
  AccountingMomentRepository
} from '../ports/accounting-moment.repository';

@Injectable()
export class DeleteAccountingMomentUseCase {
  private readonly repository = inject<AccountingMomentRepository>(ACCOUNTING_MOMENT_REPOSITORY);

  execute(id: number) {
    return this.repository.delete(id);
  }
}
