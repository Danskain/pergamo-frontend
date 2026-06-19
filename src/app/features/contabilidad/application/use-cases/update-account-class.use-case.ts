import { inject, Injectable } from '@angular/core';

import {
  ACCOUNT_CLASS_REPOSITORY,
  AccountClassRepository
} from '../ports/account-class.repository';
import { AccountClassPayload } from '../../domain/models/account-class.model';

@Injectable()
export class UpdateAccountClassUseCase {
  private readonly repository = inject<AccountClassRepository>(ACCOUNT_CLASS_REPOSITORY);

  execute(id: number, payload: AccountClassPayload) {
    return this.repository.update(id, payload);
  }
}
