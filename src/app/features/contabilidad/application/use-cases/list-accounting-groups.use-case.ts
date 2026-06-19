import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_GROUP_REPOSITORY,
  AccountingGroupRepository
} from '../ports/accounting-group.repository';

@Injectable()
export class ListAccountingGroupsUseCase {
  private readonly repository = inject<AccountingGroupRepository>(
    ACCOUNTING_GROUP_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
