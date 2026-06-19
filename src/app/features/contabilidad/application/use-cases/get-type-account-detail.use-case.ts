import { inject, Injectable } from '@angular/core';

import {
  TYPE_ACCOUNT_REPOSITORY,
  TypeAccountRepository
} from '../ports/type-account.repository';

@Injectable()
export class GetTypeAccountDetailUseCase {
  private readonly repository = inject<TypeAccountRepository>(TYPE_ACCOUNT_REPOSITORY);

  execute(id: number) {
    return this.repository.getById(id);
  }
}
