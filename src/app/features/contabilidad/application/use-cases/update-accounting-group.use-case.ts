import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_GROUP_REPOSITORY,
  AccountingGroupRepository
} from '../ports/accounting-group.repository';
import { AccountingGroupPayload } from '../../domain/models/accounting-group.model';

@Injectable()
export class UpdateAccountingGroupUseCase {
  private readonly repository = inject<AccountingGroupRepository>(
    ACCOUNTING_GROUP_REPOSITORY
  );

  execute(id: number, payload: AccountingGroupPayload) {
    return this.repository.update(id, payload);
  }
}
