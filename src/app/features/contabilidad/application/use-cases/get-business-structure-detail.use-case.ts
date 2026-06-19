import { inject, Injectable } from '@angular/core';

import {
  BUSINESS_STRUCTURE_REPOSITORY,
  BusinessStructureRepository
} from '../ports/business-structure.repository';

@Injectable()
export class GetBusinessStructureDetailUseCase {
  private readonly repository = inject<BusinessStructureRepository>(
    BUSINESS_STRUCTURE_REPOSITORY
  );

  execute(id: number) {
    return this.repository.getById(id);
  }
}
