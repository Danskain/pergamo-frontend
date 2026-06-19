import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_DOCUMENT_REPOSITORY,
  AccountingDocumentRepository
} from '../ports/accounting-document.repository';
import { AccountingDocumentPayload } from '../../domain/models/accounting-document.model';

@Injectable()
export class CreateAccountingDocumentUseCase {
  private readonly repository = inject<AccountingDocumentRepository>(
    ACCOUNTING_DOCUMENT_REPOSITORY
  );

  execute(payload: AccountingDocumentPayload) {
    return this.repository.create(payload);
  }
}
