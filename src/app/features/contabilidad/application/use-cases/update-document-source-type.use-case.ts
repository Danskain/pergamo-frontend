import { inject, Injectable } from '@angular/core';

import {
  DOCUMENT_SOURCE_TYPE_REPOSITORY,
  DocumentSourceTypeRepository
} from '../ports/document-source-type.repository';
import { DocumentSourceTypePayload } from '../../domain/models/document-source-type.model';

@Injectable()
export class UpdateDocumentSourceTypeUseCase {
  private readonly repository = inject<DocumentSourceTypeRepository>(
    DOCUMENT_SOURCE_TYPE_REPOSITORY
  );

  execute(id: number, payload: DocumentSourceTypePayload) {
    return this.repository.update(id, payload);
  }
}
