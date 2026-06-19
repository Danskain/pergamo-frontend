import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_CLASS_REPOSITORY,
  CostCenterClassRepository
} from '../ports/cost-center-class.repository';

@Injectable()
export class RestoreCostCenterClassUseCase {
  private readonly repository = inject<CostCenterClassRepository>(COST_CENTER_CLASS_REPOSITORY);

  execute(id: number) {
    return this.repository.restore(id);
  }
}
