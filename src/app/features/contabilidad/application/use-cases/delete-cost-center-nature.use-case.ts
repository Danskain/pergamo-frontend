import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_NATURE_REPOSITORY,
  CostCenterNatureRepository
} from '../ports/cost-center-nature.repository';

@Injectable()
export class DeleteCostCenterNatureUseCase {
  private readonly repository = inject<CostCenterNatureRepository>(
    COST_CENTER_NATURE_REPOSITORY
  );

  execute(id: number) {
    return this.repository.delete(id);
  }
}
