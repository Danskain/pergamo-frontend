import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ENTRY_HEADER_REPOSITORY,
  AccountingEntryHeaderRepository
} from '../ports/accounting-entry-header.repository';

@Injectable()
export class ListAccountingEntryHeadersUseCase {
  private readonly repository = inject<AccountingEntryHeaderRepository>(
    ACCOUNTING_ENTRY_HEADER_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
