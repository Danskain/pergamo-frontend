import { inject, Injectable } from '@angular/core';

import { REFERENCE_REPOSITORY, ReferenceRepository } from '../ports/reference.repository';
import { ReferencePayload } from '../../domain/models/reference.model';

@Injectable()
export class UpdateReferenceUseCase {
  private readonly repository = inject<ReferenceRepository>(REFERENCE_REPOSITORY);

  execute(id: number, payload: ReferencePayload) {
    return this.repository.update(id, payload);
  }
}
