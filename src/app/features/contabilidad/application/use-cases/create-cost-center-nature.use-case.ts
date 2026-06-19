import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_NATURE_REPOSITORY,
  CostCenterNatureRepository
} from '../ports/cost-center-nature.repository';
import { CostCenterNaturePayload } from '../../domain/models/cost-center-nature.model';

@Injectable()
export class CreateCostCenterNatureUseCase {
  private readonly repository = inject<CostCenterNatureRepository>(
    COST_CENTER_NATURE_REPOSITORY
  );

  execute(payload: CostCenterNaturePayload) {
    return this.repository.create(payload);
  }
}
