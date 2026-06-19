import { inject, Injectable } from '@angular/core';

import {
  EXERCISE_VARIATION_REPOSITORY,
  ExerciseVariationRepository
} from '../ports/exercise-variation.repository';

@Injectable()
export class GetMonthsUseCase {
  private readonly repository = inject<ExerciseVariationRepository>(
    EXERCISE_VARIATION_REPOSITORY
  );

  execute() {
    return this.repository.getMonths();
  }
}
