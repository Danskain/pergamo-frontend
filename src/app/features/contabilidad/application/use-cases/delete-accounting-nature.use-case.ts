import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_NATURE_REPOSITORY,
  AccountingNatureRepository
} from '../ports/accounting-nature.repository';

@Injectable()
export class DeleteAccountingNatureUseCase {
  private readonly repository = inject<AccountingNatureRepository>(
    ACCOUNTING_NATURE_REPOSITORY
  );

  execute(id: number) {
    return this.repository.delete(id);
  }
}
