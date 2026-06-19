import { inject, Injectable } from '@angular/core';

import { TYPE_PLAN_REPOSITORY, TypePlanRepository } from '../ports/type-plan.repository';

@Injectable()
export class GetTypePlanDetailUseCase {
  private readonly repository = inject<TypePlanRepository>(TYPE_PLAN_REPOSITORY);

  execute(id: number) {
    return this.repository.getById(id);
  }
}
