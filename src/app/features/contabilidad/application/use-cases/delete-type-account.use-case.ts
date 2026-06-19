import { inject, Injectable } from '@angular/core';

import {
  TYPE_ACCOUNT_REPOSITORY,
  TypeAccountRepository
} from '../ports/type-account.repository';

@Injectable()
export class DeleteTypeAccountUseCase {
  private readonly repository = inject<TypeAccountRepository>(TYPE_ACCOUNT_REPOSITORY);

  execute(id: number) {
    return this.repository.delete(id);
  }
}
