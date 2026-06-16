import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_SUMMARY_REPOSITORY,
  AccountingSummaryRepository
} from '../ports/accounting-summary.repository';

@Injectable()
export class GetAccountingSummaryUseCase {
  private readonly repository = inject<AccountingSummaryRepository>(
    ACCOUNTING_SUMMARY_REPOSITORY
  );

  execute() {
    return this.repository.getSummary();
  }
}
