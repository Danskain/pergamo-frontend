import { inject, Injectable } from '@angular/core';

import {
  EXERCISE_VARIATION_REPOSITORY,
  ExerciseVariationRepository
} from '../ports/exercise-variation.repository';
import { ExerciseVariationPayload } from '../../domain/models/exercise-variation.model';

@Injectable()
export class UpdateExerciseVariationUseCase {
  private readonly repository = inject<ExerciseVariationRepository>(
    EXERCISE_VARIATION_REPOSITORY
  );

  execute(id: number, payload: ExerciseVariationPayload) {
    return this.repository.update(id, payload);
  }
}
