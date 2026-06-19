import { inject, Injectable } from '@angular/core';

import {
  PERGAMO_MODULE_REPOSITORY,
  PergamoModuleRepository
} from '../ports/pergamo-module.repository';

@Injectable()
export class ListPergamoModulesUseCase {
  private readonly repository = inject<PergamoModuleRepository>(
    PERGAMO_MODULE_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
