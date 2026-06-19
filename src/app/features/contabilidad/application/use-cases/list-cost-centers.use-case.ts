import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_REPOSITORY,
  CostCenterRepository
} from '../ports/cost-center.repository';

@Injectable()
export class ListCostCentersUseCase {
  private readonly repository = inject<CostCenterRepository>(COST_CENTER_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
