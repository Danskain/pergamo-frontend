import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_CLASS_REPOSITORY,
  CostCenterClassRepository
} from '../ports/cost-center-class.repository';
import { CostCenterClassPayload } from '../../domain/models/cost-center-class.model';

@Injectable()
export class UpdateCostCenterClassUseCase {
  private readonly repository = inject<CostCenterClassRepository>(COST_CENTER_CLASS_REPOSITORY);

  execute(id: number, payload: CostCenterClassPayload) {
    return this.repository.update(id, payload);
  }
}
