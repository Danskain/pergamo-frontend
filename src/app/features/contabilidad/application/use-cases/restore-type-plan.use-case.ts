import { inject, Injectable } from '@angular/core';

import { TYPE_PLAN_REPOSITORY, TypePlanRepository } from '../ports/type-plan.repository';

@Injectable()
export class RestoreTypePlanUseCase {
  private readonly repository = inject<TypePlanRepository>(TYPE_PLAN_REPOSITORY);

  execute(id: number) {
    return this.repository.restore(id);
  }
}
