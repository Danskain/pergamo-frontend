import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_GROUP_REPOSITORY,
  AccountingGroupRepository
} from '../ports/accounting-group.repository';

@Injectable()
export class GetAccountingGroupDetailUseCase {
  private readonly repository = inject<AccountingGroupRepository>(
    ACCOUNTING_GROUP_REPOSITORY
  );

  execute(id: number) {
    return this.repository.getById(id);
  }
}
