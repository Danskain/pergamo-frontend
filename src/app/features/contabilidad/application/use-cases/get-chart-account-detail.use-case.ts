import { inject, Injectable } from '@angular/core';

import {
  CHART_ACCOUNT_REPOSITORY,
  ChartAccountRepository
} from '../ports/chart-account.repository';

@Injectable()
export class GetChartAccountDetailUseCase {
  private readonly repository = inject<ChartAccountRepository>(
    CHART_ACCOUNT_REPOSITORY
  );

  execute(id: number) {
    return this.repository.getById(id);
  }
}
