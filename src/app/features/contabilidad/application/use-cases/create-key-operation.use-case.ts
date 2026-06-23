import { inject, Injectable } from '@angular/core';

import { KEY_OPERATION_REPOSITORY, KeyOperationRepository } from '../ports/key-operation.repository';
import { KeyOperationPayload } from '../../domain/models/key-operation.model';

@Injectable()
export class CreateKeyOperationUseCase {
  private readonly repository = inject<KeyOperationRepository>(KEY_OPERATION_REPOSITORY);

  execute(payload: KeyOperationPayload) {
    return this.repository.create(payload);
  }
}
