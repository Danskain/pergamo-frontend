import { inject, Injectable } from '@angular/core';

import { TYPE_PLAN_REPOSITORY, TypePlanRepository } from '../ports/type-plan.repository';

@Injectable()
export class ListTypePlansUseCase {
  private readonly repository = inject<TypePlanRepository>(TYPE_PLAN_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
