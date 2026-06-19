import { inject, Injectable } from '@angular/core';

import {
  PERGAMO_MODULE_REPOSITORY,
  PergamoModuleRepository
} from '../ports/pergamo-module.repository';

@Injectable()
export class GetPergamoModuleDetailUseCase {
  private readonly repository = inject<PergamoModuleRepository>(
    PERGAMO_MODULE_REPOSITORY
  );

  execute(id: number) {
    return this.repository.getById(id);
  }
}
