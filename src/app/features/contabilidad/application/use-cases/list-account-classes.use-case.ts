import { inject, Injectable } from '@angular/core';

import {
  ACCOUNT_CLASS_REPOSITORY,
  AccountClassRepository
} from '../ports/account-class.repository';

@Injectable()
export class ListAccountClassesUseCase {
  private readonly repository = inject<AccountClassRepository>(ACCOUNT_CLASS_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
