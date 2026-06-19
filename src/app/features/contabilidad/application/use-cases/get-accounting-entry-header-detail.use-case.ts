import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ENTRY_HEADER_REPOSITORY,
  AccountingEntryHeaderRepository
} from '../ports/accounting-entry-header.repository';

@Injectable()
export class GetAccountingEntryHeaderDetailUseCase {
  private readonly repository = inject<AccountingEntryHeaderRepository>(
    ACCOUNTING_ENTRY_HEADER_REPOSITORY
  );

  execute(id: number) {
    return this.repository.getById(id);
  }
}
