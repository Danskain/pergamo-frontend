import { inject, Injectable } from '@angular/core';

import {
  TYPE_ACCOUNT_REPOSITORY,
  TypeAccountRepository
} from '../ports/type-account.repository';

@Injectable()
export class ListTypeAccountsUseCase {
  private readonly repository = inject<TypeAccountRepository>(TYPE_ACCOUNT_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
