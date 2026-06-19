import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_NATURE_REPOSITORY,
  AccountingNatureRepository
} from '../ports/accounting-nature.repository';

@Injectable()
export class ListAccountingNaturesUseCase {
  private readonly repository = inject<AccountingNatureRepository>(
    ACCOUNTING_NATURE_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
