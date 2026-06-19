import { inject, Injectable } from '@angular/core';

import {
  BUSINESS_STRUCTURE_REPOSITORY,
  BusinessStructureRepository
} from '../ports/business-structure.repository';
import { BusinessStructurePayload } from '../../domain/models/business-structure.model';

@Injectable()
export class UpdateBusinessStructureUseCase {
  private readonly repository = inject<BusinessStructureRepository>(
    BUSINESS_STRUCTURE_REPOSITORY
  );

  execute(id: number, payload: BusinessStructurePayload) {
    return this.repository.update(id, payload);
  }
}
