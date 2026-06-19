import { inject, Injectable } from '@angular/core';

import {
  EXERCISE_VARIATION_REPOSITORY,
  ExerciseVariationRepository
} from '../ports/exercise-variation.repository';

@Injectable()
export class ListExerciseVariationsUseCase {
  private readonly repository = inject<ExerciseVariationRepository>(
    EXERCISE_VARIATION_REPOSITORY
  );

  execute(page: number, perPage: number) {
    return this.repository.list(page, perPage);
  }
}
