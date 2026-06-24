import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TypePlanRepository } from '../../application/ports/type-plan.repository';
import {
  TypePlan,
  TypePlanPage,
  TypePlanPayload
} from '../../domain/models/type-plan.model';

interface ApiTypePlan {
  id: number;
  code: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListTypePlansResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiTypePlan[];
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

interface TypePlanResponse {
  success: boolean;
  message: string;
  data: ApiTypePlan;
}

@Injectable()
export class HttpTypePlanRepository implements TypePlanRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<TypePlanPage> {
    return this.http
      .get<ListTypePlansResponse>(`${this.apiBaseUrl}/accounting/types-plans`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapTypePlan(item)),
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

  getById(id: number): Observable<TypePlan> {
    return this.http
      .get<TypePlanResponse>(`${this.apiBaseUrl}/accounting/types-plans/${id}`)
      .pipe(map((response) => this.mapTypePlan(response.data)));
  }

  create(payload: TypePlanPayload): Observable<TypePlan> {
    return this.http
      .post<TypePlanResponse>(
        `${this.apiBaseUrl}/accounting/types-plans`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapTypePlan(response.data)));
  }

  update(id: number, payload: TypePlanPayload): Observable<TypePlan> {
    return this.http
      .put<TypePlanResponse>(
        `${this.apiBaseUrl}/accounting/types-plans/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapTypePlan(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/types-plans/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<TypePlan> {
    return this.http
      .post<TypePlanResponse>(`${this.apiBaseUrl}/accounting/types-plans/${id}/restore`, {})
      .pipe(map((response) => this.mapTypePlan(response.data)));
  }

  private mapTypePlan(item: ApiTypePlan): TypePlan {
    return {
      id: item.id,
      code: item.code,
      name: item.name,
      description: item.description,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapPayload(payload: TypePlanPayload) {
    return {
      code: payload.code,
      name: payload.name,
      description: payload.description
    };
  }
}
