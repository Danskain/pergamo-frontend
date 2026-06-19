import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ENTRY_POSITION_REPOSITORY,
  AccountingEntryPositionRepository
} from '../ports/accounting-entry-position.repository';
@Injectable()
export class RestoreAccountingEntryPositionUseCase {
  private readonly repository = inject<AccountingEntryPositionRepository>(
    ACCOUNTING_ENTRY_POSITION_REPOSITORY
  );

  execute(id: number) {
    return this.repository.restore(id);
  }
}
