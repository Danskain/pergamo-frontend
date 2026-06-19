import { inject, Injectable } from '@angular/core';

import {
  CHART_ACCOUNT_REPOSITORY,
  ChartAccountRepository
} from '../ports/chart-account.repository';

@Injectable()
export class ListChartAccountsUseCase {
  private readonly repository = inject<ChartAccountRepository>(
    CHART_ACCOUNT_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
