import { inject, Injectable } from '@angular/core';

import {
  CHART_ACCOUNT_REPOSITORY,
  ChartAccountRepository
} from '../ports/chart-account.repository';

@Injectable()
export class RestoreChartAccountUseCase {
  private readonly repository = inject<ChartAccountRepository>(
    CHART_ACCOUNT_REPOSITORY
  );

  execute(id: number) {
    return this.repository.restore(id);
  }
}
