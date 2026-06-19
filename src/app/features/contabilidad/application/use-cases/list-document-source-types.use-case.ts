import { inject, Injectable } from '@angular/core';

import {
  DOCUMENT_SOURCE_TYPE_REPOSITORY,
  DocumentSourceTypeRepository
} from '../ports/document-source-type.repository';

@Injectable()
export class ListDocumentSourceTypesUseCase {
  private readonly repository = inject<DocumentSourceTypeRepository>(
    DOCUMENT_SOURCE_TYPE_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
