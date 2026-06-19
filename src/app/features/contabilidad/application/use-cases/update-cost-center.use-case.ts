import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_REPOSITORY,
  CostCenterRepository
} from '../ports/cost-center.repository';
import { CostCenterPayload } from '../../domain/models/cost-center.model';

@Injectable()
export class UpdateCostCenterUseCase {
  private readonly repository = inject<CostCenterRepository>(COST_CENTER_REPOSITORY);

  execute(id: number, payload: CostCenterPayload) {
    return this.repository.update(id, payload);
  }
}
