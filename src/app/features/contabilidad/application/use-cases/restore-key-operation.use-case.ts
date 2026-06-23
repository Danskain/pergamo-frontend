import { inject, Injectable } from '@angular/core';

import { KEY_OPERATION_REPOSITORY, KeyOperationRepository } from '../ports/key-operation.repository';

@Injectable()
export class RestoreKeyOperationUseCase {
  private readonly repository = inject<KeyOperationRepository>(KEY_OPERATION_REPOSITORY);

  execute(id: number) {
    return this.repository.restore(id);
  }
}
