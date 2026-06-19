import { inject, Injectable } from '@angular/core';

import {
  CHART_ACCOUNT_REPOSITORY,
  ChartAccountRepository
} from '../ports/chart-account.repository';
import { ChartAccountPayload } from '../../domain/models/chart-account.model';

@Injectable()
export class CreateChartAccountUseCase {
  private readonly repository = inject<ChartAccountRepository>(
    CHART_ACCOUNT_REPOSITORY
  );

  execute(payload: ChartAccountPayload) {
    return this.repository.create(payload);
  }
}
