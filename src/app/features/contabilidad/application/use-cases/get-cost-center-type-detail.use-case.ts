import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_TYPE_REPOSITORY,
  CostCenterTypeRepository
} from '../ports/cost-center-type.repository';

@Injectable()
export class GetCostCenterTypeDetailUseCase {
  private readonly repository = inject<CostCenterTypeRepository>(COST_CENTER_TYPE_REPOSITORY);

  execute(id: number) {
    return this.repository.getById(id);
  }
}
