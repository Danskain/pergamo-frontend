import { inject, Injectable } from '@angular/core';

import {
  DOCUMENT_SOURCE_REPOSITORY,
  DocumentSourceRepository
} from '../ports/document-source.repository';

@Injectable()
export class ListDocumentSourcesUseCase {
  private readonly repository = inject<DocumentSourceRepository>(DOCUMENT_SOURCE_REPOSITORY);

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
