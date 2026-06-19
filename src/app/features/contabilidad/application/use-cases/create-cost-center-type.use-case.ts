import { inject, Injectable } from '@angular/core';

import {
  COST_CENTER_TYPE_REPOSITORY,
  CostCenterTypeRepository
} from '../ports/cost-center-type.repository';
import { CostCenterTypePayload } from '../../domain/models/cost-center-type.model';

@Injectable()
export class CreateCostCenterTypeUseCase {
  private readonly repository = inject<CostCenterTypeRepository>(COST_CENTER_TYPE_REPOSITORY);

  execute(payload: CostCenterTypePayload) {
    return this.repository.create(payload);
  }
}
