import { inject, Injectable } from '@angular/core';

import {
  ACCOUNT_CLASS_REPOSITORY,
  AccountClassRepository
} from '../ports/account-class.repository';
import { AccountClassPayload } from '../../domain/models/account-class.model';

@Injectable()
export class CreateAccountClassUseCase {
  private readonly repository = inject<AccountClassRepository>(ACCOUNT_CLASS_REPOSITORY);

  execute(payload: AccountClassPayload) {
    return this.repository.create(payload);
  }
}
