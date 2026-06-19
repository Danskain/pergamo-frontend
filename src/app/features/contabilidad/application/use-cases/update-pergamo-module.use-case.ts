import { inject, Injectable } from '@angular/core';

import {
  PERGAMO_MODULE_REPOSITORY,
  PergamoModuleRepository
} from '../ports/pergamo-module.repository';
import { PergamoModulePayload } from '../../domain/models/pergamo-module.model';

@Injectable()
export class UpdatePergamoModuleUseCase {
  private readonly repository = inject<PergamoModuleRepository>(
    PERGAMO_MODULE_REPOSITORY
  );

  execute(id: number, payload: PergamoModulePayload) {
    return this.repository.update(id, payload);
  }
}
