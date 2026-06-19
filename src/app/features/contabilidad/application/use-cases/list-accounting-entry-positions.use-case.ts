import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ENTRY_POSITION_REPOSITORY,
  AccountingEntryPositionRepository
} from '../ports/accounting-entry-position.repository';
@Injectable()
export class ListAccountingEntryPositionsUseCase {
  private readonly repository = inject<AccountingEntryPositionRepository>(
    ACCOUNTING_ENTRY_POSITION_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
