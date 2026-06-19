import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_CLASS_REPOSITORY,
  CostCenterClassRepository
} from '../ports/cost-center-class.repository';

@Injectable()
export class ListCostCenterClassesUseCase {
  private readonly repository = inject<CostCenterClassRepository>(COST_CENTER_CLASS_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
