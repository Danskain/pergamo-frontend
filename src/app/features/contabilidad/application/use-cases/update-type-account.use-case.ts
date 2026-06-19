import { inject, Injectable } from '@angular/core';

import {
  TYPE_ACCOUNT_REPOSITORY,
  TypeAccountRepository
} from '../ports/type-account.repository';
import { TypeAccountPayload } from '../../domain/models/type-account.model';

@Injectable()
export class UpdateTypeAccountUseCase {
  private readonly repository = inject<TypeAccountRepository>(TYPE_ACCOUNT_REPOSITORY);

  execute(id: number, payload: TypeAccountPayload) {
    return this.repository.update(id, payload);
  }
}
