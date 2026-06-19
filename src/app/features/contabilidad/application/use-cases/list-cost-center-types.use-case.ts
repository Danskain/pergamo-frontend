import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_TYPE_REPOSITORY,
  CostCenterTypeRepository
} from '../ports/cost-center-type.repository';

@Injectable()
export class ListCostCenterTypesUseCase {
  private readonly repository = inject<CostCenterTypeRepository>(COST_CENTER_TYPE_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
