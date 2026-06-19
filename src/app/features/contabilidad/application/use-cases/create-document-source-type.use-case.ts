import { inject, Injectable } from '@angular/core';

import {
  DOCUMENT_SOURCE_TYPE_REPOSITORY,
  DocumentSourceTypeRepository
} from '../ports/document-source-type.repository';
import { DocumentSourceTypePayload } from '../../domain/models/document-source-type.model';

@Injectable()
export class CreateDocumentSourceTypeUseCase {
  private readonly repository = inject<DocumentSourceTypeRepository>(
    DOCUMENT_SOURCE_TYPE_REPOSITORY
  );

  execute(payload: DocumentSourceTypePayload) {
    return this.repository.create(payload);
  }
}
