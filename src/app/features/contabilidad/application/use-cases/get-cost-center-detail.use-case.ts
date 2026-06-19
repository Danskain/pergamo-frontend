import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_REPOSITORY,
  CostCenterRepository
} from '../ports/cost-center.repository';

@Injectable()
export class GetCostCenterDetailUseCase {
  private readonly repository = inject<CostCenterRepository>(COST_CENTER_REPOSITORY);

  execute(id: number) {
    return this.repository.getById(id);
  }
}
