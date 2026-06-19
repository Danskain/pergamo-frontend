import { inject, Injectable } from '@angular/core';

import {
  DOCUMENT_SOURCE_REPOSITORY,
  DocumentSourceRepository
} from '../ports/document-source.repository';
import { DocumentSourcePayload } from '../../domain/models/document-source.model';

@Injectable()
export class UpdateDocumentSourceUseCase {
  private readonly repository = inject<DocumentSourceRepository>(DOCUMENT_SOURCE_REPOSITORY);

  execute(id: number, payload: DocumentSourcePayload) {
    return this.repository.update(id, payload);
  }
}
