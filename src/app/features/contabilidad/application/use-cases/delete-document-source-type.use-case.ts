import { inject, Injectable } from '@angular/core';

import {
  DOCUMENT_SOURCE_TYPE_REPOSITORY,
  DocumentSourceTypeRepository
} from '../ports/document-source-type.repository';

@Injectable()
export class DeleteDocumentSourceTypeUseCase {
  private readonly repository = inject<DocumentSourceTypeRepository>(
    DOCUMENT_SOURCE_TYPE_REPOSITORY
  );

  execute(id: number) {
    return this.repository.delete(id);
  }
}
