import { inject, Injectable } from '@angular/core';

import {
  ACCOUNTING_DOCUMENT_REPOSITORY,
  AccountingDocumentRepository
} from '../ports/accounting-document.repository';

@Injectable()
export class ListAccountingDocumentsUseCase {
  private readonly repository = inject<AccountingDocumentRepository>(
    ACCOUNTING_DOCUMENT_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
