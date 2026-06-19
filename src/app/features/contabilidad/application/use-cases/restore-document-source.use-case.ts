import { inject, Injectable } from '@angular/core';

import {
  DOCUMENT_SOURCE_REPOSITORY,
  DocumentSourceRepository
} from '../ports/document-source.repository';

@Injectable()
export class RestoreDocumentSourceUseCase {
  private readonly repository = inject<DocumentSourceRepository>(DOCUMENT_SOURCE_REPOSITORY);

  execute(id: number) {
    return this.repository.restore(id);
  }
}
