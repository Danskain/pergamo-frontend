import { inject, Injectable } from '@angular/core';

import { TYPE_PLAN_REPOSITORY, TypePlanRepository } from '../ports/type-plan.repository';
import { TypePlanPayload } from '../../domain/models/type-plan.model';

@Injectable()
export class CreateTypePlanUseCase {
  private readonly repository = inject<TypePlanRepository>(TYPE_PLAN_REPOSITORY);

  execute(payload: TypePlanPayload) {
    return this.repository.create(payload);
  }
}
