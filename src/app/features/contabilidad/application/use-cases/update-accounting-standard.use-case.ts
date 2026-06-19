import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_STANDARD_REPOSITORY,
  AccountingStandardRepository
} from '../ports/accounting-standard.repository';
import { AccountingStandardPayload } from '../../domain/models/accounting-standard.model';

@Injectable()
export class UpdateAccountingStandardUseCase {
  private readonly repository = inject<AccountingStandardRepository>(
    ACCOUNTING_STANDARD_REPOSITORY
  );

  execute(id: number, payload: AccountingStandardPayload) {
    return this.repository.update(id, payload);
  }
}
