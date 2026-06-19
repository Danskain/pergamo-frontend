import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_NATURE_REPOSITORY,
  AccountingNatureRepository
} from '../ports/accounting-nature.repository';
import { AccountingNaturePayload } from '../../domain/models/accounting-nature.model';

@Injectable()
export class CreateAccountingNatureUseCase {
  private readonly repository = inject<AccountingNatureRepository>(
    ACCOUNTING_NATURE_REPOSITORY
  );

  execute(payload: AccountingNaturePayload) {
    return this.repository.create(payload);
  }
}
