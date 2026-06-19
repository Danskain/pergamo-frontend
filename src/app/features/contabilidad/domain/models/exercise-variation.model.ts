import { Month } from './month.model';

export interface ExerciseVariation {
  id: number;
  code: string;
  name: string;
  startExercise: number;
  endExercise: number;
  normalPeriods: number;
  specialPeriods: number;
  calendarDependent: boolean;
  description: string;
  startMonth: Month | null;
  endMonth: Month | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ExerciseVariationPayload {
  code: string;
  name: string;
  startExercise: number;
  endExercise: number;
  normalPeriods: number;
  specialPeriods: number;
  calendarDependent: boolean;
  description: string;
}

export interface ExerciseVariationPage {
  items: ExerciseVariation[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    currentPage: number;
    from: number | null;
    lastPage: number;
    path: string;
    perPage: number;
    to: number | null;
    total: number;
  };
}
