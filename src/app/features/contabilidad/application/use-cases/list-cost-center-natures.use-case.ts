import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_NATURE_REPOSITORY,
  CostCenterNatureRepository
} from '../ports/cost-center-nature.repository';

@Injectable()
export class ListCostCenterNaturesUseCase {
  private readonly repository = inject<CostCenterNatureRepository>(
    COST_CENTER_NATURE_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
