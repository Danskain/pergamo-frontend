import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ExerciseVariationRepository } from '../../application/ports/exercise-variation.repository';
import {
  ExerciseVariation,
  ExerciseVariationPage,
  ExerciseVariationPayload
} from '../../domain/models/exercise-variation.model';
import { Month } from '../../domain/models/month.model';

interface MonthResponse {
  success: boolean;
  message: string;
  data: Month[];
}

interface ApiMonth {
  id: number;
  name: string;
}

interface ApiExerciseVariation {
  id: number;
  code: string;
  name: string;
  start_exercise: number;
  end_exercise: number;
  normal_periods: number;
  special_periods: number;
  calendar_dependent: boolean;
  description: string;
  start_month: ApiMonth | null;
  end_month: ApiMonth | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListExerciseVariationsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiExerciseVariation[];
    links: {
      first: string | null;
      last: string | null;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number | null;
      last_page: number;
      path: string;
      per_page: number;
      to: number | null;
      total: number;
    };
  };
}

interface ExerciseVariationResponse {
  success: boolean;
  message: string;
  data: ApiExerciseVariation;
}

@Injectable()
export class HttpExerciseVariationRepository implements ExerciseVariationRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  getMonths(): Observable<Month[]> {
    return this.http
      .get<MonthResponse>(`${this.apiBaseUrl}/catalogs/months`)
      .pipe(map((response) => response.data));
  }

  list(page: number, perPage: number): Observable<ExerciseVariationPage> {
    return this.http
      .get<ListExerciseVariationsResponse>(
        `${this.apiBaseUrl}/accounting/exercise-variations`,
        {
          params: {
            page,
            per_page: perPage
          }
        }
      )
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapVariation(item)),
          links: response.data.links,
          meta: {
            currentPage: response.data.meta.current_page,
            from: response.data.meta.from,
            lastPage: response.data.meta.last_page,
            path: response.data.meta.path,
            perPage: response.data.meta.per_page,
            to: response.data.meta.to,
            total: response.data.meta.total
          }
        }))
      );
  }

  getById(id: number): Observable<ExerciseVariation> {
    return this.http
      .get<ExerciseVariationResponse>(
        `${this.apiBaseUrl}/accounting/exercise-variations/${id}`
      )
      .pipe(map((response) => this.mapVariation(response.data)));
  }

  create(payload: ExerciseVariationPayload): Observable<ExerciseVariation> {
    return this.http
      .post<ExerciseVariationResponse>(
        `${this.apiBaseUrl}/accounting/exercise-variations`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapVariation(response.data)));
  }

  update(id: number, payload: ExerciseVariationPayload): Observable<ExerciseVariation> {
    return this.http
      .put<ExerciseVariationResponse>(
        `${this.apiBaseUrl}/accounting/exercise-variations/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapVariation(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/exercise-variations/${id}`)
      .pipe(map(() => undefined));
  }

  private mapVariation(item: ApiExerciseVariation): ExerciseVariation {
    return {
      id: item.id,
      code: item.code,
      name: item.name,
      startExercise: item.start_exercise,
      endExercise: item.end_exercise,
      normalPeriods: item.normal_periods,
      specialPeriods: item.special_periods,
      calendarDependent: item.calendar_dependent,
      description: item.description,
      startMonth: item.start_month,
      endMonth: item.end_month,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapPayload(payload: ExerciseVariationPayload) {
    return {
      code: payload.code,
      name: payload.name,
      start_exercise: payload.startExercise,
      end_exercise: payload.endExercise,
      normal_periods: payload.normalPeriods,
      special_periods: payload.specialPeriods,
      calendar_dependent: payload.calendarDependent,
      description: payload.description
    };
  }
}
