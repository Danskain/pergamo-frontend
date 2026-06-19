import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_NATURE_REPOSITORY,
  AccountingNatureRepository
} from '../ports/accounting-nature.repository';
import { AccountingNaturePayload } from '../../domain/models/accounting-nature.model';

@Injectable()
export class UpdateAccountingNatureUseCase {
  private readonly repository = inject<AccountingNatureRepository>(
    ACCOUNTING_NATURE_REPOSITORY
  );

  execute(id: number, payload: AccountingNaturePayload) {
    return this.repository.update(id, payload);
  }
}
