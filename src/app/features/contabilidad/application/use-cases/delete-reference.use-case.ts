import { inject, Injectable } from '@angular/core';

import { REFERENCE_REPOSITORY, ReferenceRepository } from '../ports/reference.repository';

@Injectable()
export class DeleteReferenceUseCase {
  private readonly repository = inject<ReferenceRepository>(REFERENCE_REPOSITORY);

  execute(id: number) {
    return this.repository.delete(id);
  }
}
