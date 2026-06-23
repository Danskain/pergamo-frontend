import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_MOMENT_REPOSITORY,
  AccountingMomentRepository
} from '../ports/accounting-moment.repository';
import { AccountingMomentPayload } from '../../domain/models/accounting-moment.model';

@Injectable()
export class UpdateAccountingMomentUseCase {
  private readonly repository = inject<AccountingMomentRepository>(ACCOUNTING_MOMENT_REPOSITORY);

  execute(id: number, payload: AccountingMomentPayload) {
    return this.repository.update(id, payload);
  }
}
