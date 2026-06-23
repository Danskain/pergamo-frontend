import { inject, Injectable } from '@angular/core';

import { KEY_OPERATION_REPOSITORY, KeyOperationRepository } from '../ports/key-operation.repository';

@Injectable()
export class ListKeyOperationsUseCase {
  private readonly repository = inject<KeyOperationRepository>(KEY_OPERATION_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
