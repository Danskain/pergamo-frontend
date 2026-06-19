import { inject, Injectable } from '@angular/core';

import {
  ACCOUNT_CLASS_REPOSITORY,
  AccountClassRepository
} from '../ports/account-class.repository';

@Injectable()
export class DeleteAccountClassUseCase {
  private readonly repository = inject<AccountClassRepository>(ACCOUNT_CLASS_REPOSITORY);

  execute(id: number) {
    return this.repository.delete(id);
  }
}
