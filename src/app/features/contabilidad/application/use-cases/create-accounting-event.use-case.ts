import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_EVENT_REPOSITORY,
  AccountingEventRepository
} from '../ports/accounting-event.repository';
import { AccountingEventPayload } from '../../domain/models/accounting-event.model';

@Injectable()
export class CreateAccountingEventUseCase {
  private readonly repository = inject<AccountingEventRepository>(ACCOUNTING_EVENT_REPOSITORY);

  execute(payload: AccountingEventPayload) {
    return this.repository.create(payload);
  }
}
