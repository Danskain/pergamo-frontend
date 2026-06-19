import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_ENTRY_POSITION_REPOSITORY,
  AccountingEntryPositionRepository
} from '../ports/accounting-entry-position.repository';
import { AccountingEntryPositionPayload } from '../../domain/models/accounting-entry-position.model';

@Injectable()
export class CreateAccountingEntryPositionUseCase {
  private readonly repository = inject<AccountingEntryPositionRepository>(
    ACCOUNTING_ENTRY_POSITION_REPOSITORY
  );

  execute(payload: AccountingEntryPositionPayload) {
    return this.repository.create(payload);
  }
}
