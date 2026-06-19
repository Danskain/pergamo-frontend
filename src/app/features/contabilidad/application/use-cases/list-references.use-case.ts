import { inject, Injectable } from '@angular/core';

import { REFERENCE_REPOSITORY, ReferenceRepository } from '../ports/reference.repository';

@Injectable()
export class ListReferencesUseCase {
  private readonly repository = inject<ReferenceRepository>(REFERENCE_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
