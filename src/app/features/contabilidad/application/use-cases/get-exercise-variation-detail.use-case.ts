import { inject, Injectable } from '@angular/core';

import {
  EXERCISE_VARIATION_REPOSITORY,
  ExerciseVariationRepository
} from '../ports/exercise-variation.repository';

@Injectable()
export class GetExerciseVariationDetailUseCase {
  private readonly repository = inject<ExerciseVariationRepository>(
    EXERCISE_VARIATION_REPOSITORY
  );

  execute(id: number) {
    return this.repository.getById(id);
  }
}
