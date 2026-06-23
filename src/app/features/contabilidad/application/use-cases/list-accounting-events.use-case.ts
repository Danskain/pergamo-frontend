import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_EVENT_REPOSITORY,
  AccountingEventRepository
} from '../ports/accounting-event.repository';

@Injectable()
export class ListAccountingEventsUseCase {
  private readonly repository = inject<AccountingEventRepository>(ACCOUNTING_EVENT_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
