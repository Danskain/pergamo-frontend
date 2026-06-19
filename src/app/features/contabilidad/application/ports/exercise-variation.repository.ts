import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ExerciseVariation,
  ExerciseVariationPage,
  ExerciseVariationPayload
} from '../../domain/models/exercise-variation.model';
import { Month } from '../../domain/models/month.model';

export interface ExerciseVariationRepository {
  getMonths(): Observable<Month[]>;
  list(page: number, perPage: number): Observable<ExerciseVariationPage>;
  getById(id: number): Observable<ExerciseVariation>;
  create(payload: ExerciseVariationPayload): Observable<ExerciseVariation>;
  update(id: number, payload: ExerciseVariationPayload): Observable<ExerciseVariation>;
  delete(id: number): Observable<void>;
}

export const EXERCISE_VARIATION_REPOSITORY =
  new InjectionToken<ExerciseVariationRepository>('EXERCISE_VARIATION_REPOSITORY');
