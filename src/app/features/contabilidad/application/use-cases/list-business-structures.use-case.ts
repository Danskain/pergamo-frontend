import { inject, Injectable } from '@angular/core';

import {
  BUSINESS_STRUCTURE_REPOSITORY,
  BusinessStructureRepository
} from '../ports/business-structure.repository';

@Injectable()
export class ListBusinessStructuresUseCase {
  private readonly repository = inject<BusinessStructureRepository>(
    BUSINESS_STRUCTURE_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
