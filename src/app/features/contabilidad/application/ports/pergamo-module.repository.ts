import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  PergamoModule,
  PergamoModulePage,
  PergamoModulePayload
} from '../../domain/models/pergamo-module.model';

export interface PergamoModuleRepository {
  list(page: number, perPage: number): Observable<PergamoModulePage>;
  getById(id: number): Observable<PergamoModule>;
  create(payload: PergamoModulePayload): Observable<PergamoModule>;
  update(id: number, payload: PergamoModulePayload): Observable<PergamoModule>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<PergamoModule>;
}

export const PERGAMO_MODULE_REPOSITORY = new InjectionToken<PergamoModuleRepository>(
  'PERGAMO_MODULE_REPOSITORY'
);
