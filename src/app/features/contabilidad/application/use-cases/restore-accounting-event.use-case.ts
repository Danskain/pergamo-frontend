import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_EVENT_REPOSITORY,
  AccountingEventRepository
} from '../ports/accounting-event.repository';

@Injectable()
export class RestoreAccountingEventUseCase {
  private readonly repository = inject<AccountingEventRepository>(ACCOUNTING_EVENT_REPOSITORY);

  execute(id: number) {
    return this.repository.restore(id);
  }
}
