import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ENTRY_HEADER_REPOSITORY,
  AccountingEntryHeaderRepository
} from '../ports/accounting-entry-header.repository';
import { AccountingEntryHeaderPayload } from '../../domain/models/accounting-entry-header.model';

@Injectable()
export class UpdateAccountingEntryHeaderUseCase {
  private readonly repository = inject<AccountingEntryHeaderRepository>(
    ACCOUNTING_ENTRY_HEADER_REPOSITORY
  );

  execute(id: number, payload: AccountingEntryHeaderPayload) {
    return this.repository.update(id, payload);
  }
}
