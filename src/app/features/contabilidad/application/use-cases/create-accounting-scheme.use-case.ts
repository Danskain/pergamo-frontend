import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_SCHEME_REPOSITORY,
  AccountingSchemeRepository
} from '../ports/accounting-scheme.repository';
import { AccountingSchemePayload } from '../../domain/models/accounting-scheme.model';

@Injectable()
export class CreateAccountingSchemeUseCase {
  private readonly repository = inject<AccountingSchemeRepository>(ACCOUNTING_SCHEME_REPOSITORY);

  execute(payload: AccountingSchemePayload) {
    return this.repository.create(payload);
  }
}
