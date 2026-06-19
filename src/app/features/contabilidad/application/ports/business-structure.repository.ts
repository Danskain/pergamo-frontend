import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BusinessStructure,
  BusinessStructurePage,
  BusinessStructurePayload
} from '../../domain/models/business-structure.model';

export interface BusinessStructureRepository {
  list(page: number, perPage: number): Observable<BusinessStructurePage>;
  getById(id: number): Observable<BusinessStructure>;
  create(payload: BusinessStructurePayload): Observable<BusinessStructure>;
  update(id: number, payload: BusinessStructurePayload): Observable<BusinessStructure>;
  delete(id: number): Observable<void>;
  restore(id: number): Observable<BusinessStructure>;
}

export const BUSINESS_STRUCTURE_REPOSITORY = new InjectionToken<BusinessStructureRepository>(
  'BUSINESS_STRUCTURE_REPOSITORY'
);
