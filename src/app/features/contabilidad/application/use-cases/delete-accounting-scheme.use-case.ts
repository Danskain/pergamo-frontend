import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_SCHEME_REPOSITORY,
  AccountingSchemeRepository
} from '../ports/accounting-scheme.repository';

@Injectable()
export class DeleteAccountingSchemeUseCase {
  private readonly repository = inject<AccountingSchemeRepository>(ACCOUNTING_SCHEME_REPOSITORY);

  execute(id: number) {
    return this.repository.delete(id);
  }
}
