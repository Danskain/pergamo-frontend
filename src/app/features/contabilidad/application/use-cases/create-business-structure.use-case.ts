import { inject, Injectable } from '@angular/core';

import {
  BUSINESS_STRUCTURE_REPOSITORY,
  BusinessStructureRepository
} from '../ports/business-structure.repository';
import { BusinessStructurePayload } from '../../domain/models/business-structure.model';

@Injectable()
export class CreateBusinessStructureUseCase {
  private readonly repository = inject<BusinessStructureRepository>(
    BUSINESS_STRUCTURE_REPOSITORY
  );

  execute(payload: BusinessStructurePayload) {
    return this.repository.create(payload);
  }
}
