import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_SCHEME_REPOSITORY,
  AccountingSchemeRepository
} from '../ports/accounting-scheme.repository';

@Injectable()
export class ListAccountingSchemesUseCase {
  private readonly repository = inject<AccountingSchemeRepository>(ACCOUNTING_SCHEME_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
