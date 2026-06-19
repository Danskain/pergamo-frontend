import { inject, Injectable } from '@angular/core';

import {
  PERGAMO_MODULE_REPOSITORY,
  PergamoModuleRepository
} from '../ports/pergamo-module.repository';
import { PergamoModulePayload } from '../../domain/models/pergamo-module.model';

@Injectable()
export class CreatePergamoModuleUseCase {
  private readonly repository = inject<PergamoModuleRepository>(
    PERGAMO_MODULE_REPOSITORY
  );

  execute(payload: PergamoModulePayload) {
    return this.repository.create(payload);
  }
}
