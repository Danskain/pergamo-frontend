import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_GROUP_REPOSITORY,
  AccountingGroupRepository
} from '../ports/accounting-group.repository';
import { AccountingGroupPayload } from '../../domain/models/accounting-group.model';

@Injectable()
export class CreateAccountingGroupUseCase {
  private readonly repository = inject<AccountingGroupRepository>(
    ACCOUNTING_GROUP_REPOSITORY
  );

  execute(payload: AccountingGroupPayload) {
    return this.repository.create(payload);
  }
}
