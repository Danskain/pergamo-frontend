import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_REPOSITORY,
  CostCenterRepository
} from '../ports/cost-center.repository';
import { CostCenterPayload } from '../../domain/models/cost-center.model';

@Injectable()
export class CreateCostCenterUseCase {
  private readonly repository = inject<CostCenterRepository>(COST_CENTER_REPOSITORY);

  execute(payload: CostCenterPayload) {
    return this.repository.create(payload);
  }
}
