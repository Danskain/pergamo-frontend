import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ENTRY_HEADER_REPOSITORY,
  AccountingEntryHeaderRepository
} from '../ports/accounting-entry-header.repository';
import { AccountingEntryHeaderPayload } from '../../domain/models/accounting-entry-header.model';

@Injectable()
export class CreateAccountingEntryHeaderUseCase {
  private readonly repository = inject<AccountingEntryHeaderRepository>(
    ACCOUNTING_ENTRY_HEADER_REPOSITORY
  );

  execute(payload: AccountingEntryHeaderPayload) {
    return this.repository.create(payload);
  }
}
