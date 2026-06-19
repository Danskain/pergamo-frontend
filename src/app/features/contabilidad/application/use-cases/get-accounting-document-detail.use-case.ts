import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_DOCUMENT_REPOSITORY,
  AccountingDocumentRepository
} from '../ports/accounting-document.repository';

@Injectable()
export class GetAccountingDocumentDetailUseCase {
  private readonly repository = inject<AccountingDocumentRepository>(
    ACCOUNTING_DOCUMENT_REPOSITORY
  );

  execute(id: number) {
    return this.repository.getById(id);
  }
}
