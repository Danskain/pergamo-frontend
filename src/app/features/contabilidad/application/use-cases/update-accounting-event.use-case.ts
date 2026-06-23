import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_EVENT_REPOSITORY,
  AccountingEventRepository
} from '../ports/accounting-event.repository';
import { AccountingEventPayload } from '../../domain/models/accounting-event.model';

@Injectable()
export class UpdateAccountingEventUseCase {
  private readonly repository = inject<AccountingEventRepository>(ACCOUNTING_EVENT_REPOSITORY);

  execute(id: number, payload: AccountingEventPayload) {
    return this.repository.update(id, payload);
  }
}
