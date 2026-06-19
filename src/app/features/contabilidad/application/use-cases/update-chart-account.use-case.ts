import { inject, Injectable } from '@angular/core';

import {
  CHART_ACCOUNT_REPOSITORY,
  ChartAccountRepository
} from '../ports/chart-account.repository';
import { ChartAccountPayload } from '../../domain/models/chart-account.model';

@Injectable()
export class UpdateChartAccountUseCase {
  private readonly repository = inject<ChartAccountRepository>(
    CHART_ACCOUNT_REPOSITORY
  );

  execute(id: number, payload: ChartAccountPayload) {
    return this.repository.update(id, payload);
  }
}
