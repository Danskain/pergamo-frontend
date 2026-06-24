import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CostCenterClassRepository } from '../../application/ports/cost-center-class.repository';
import {
  CostCenterClass,
  CostCenterClassPage,
  CostCenterClassPayload
} from '../../domain/models/cost-center-class.model';

interface ApiCostCenterClass {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListCostCenterClassesResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiCostCenterClass[];
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

interface CostCenterClassResponse {
  success: boolean;
  message: string;
  data: ApiCostCenterClass;
}

@Injectable()
export class HttpCostCenterClassRepository implements CostCenterClassRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<CostCenterClassPage> {
    return this.http
      .get<ListCostCenterClassesResponse>(`${this.apiBaseUrl}/accounting/cost-center-classes`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapCostCenterClass(item)),
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

  getById(id: number): Observable<CostCenterClass> {
    return this.http
      .get<CostCenterClassResponse>(`${this.apiBaseUrl}/accounting/cost-center-classes/${id}`)
      .pipe(map((response) => this.mapCostCenterClass(response.data)));
  }

  create(payload: CostCenterClassPayload): Observable<CostCenterClass> {
    return this.http
      .post<CostCenterClassResponse>(
        `${this.apiBaseUrl}/accounting/cost-center-classes`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapCostCenterClass(response.data)));
  }

  update(id: number, payload: CostCenterClassPayload): Observable<CostCenterClass> {
    return this.http
      .put<CostCenterClassResponse>(
        `${this.apiBaseUrl}/accounting/cost-center-classes/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapCostCenterClass(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/cost-center-classes/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<CostCenterClass> {
    return this.http
      .post<CostCenterClassResponse>(
        `${this.apiBaseUrl}/accounting/cost-center-classes/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapCostCenterClass(response.data)));
  }

  private mapCostCenterClass(item: ApiCostCenterClass): CostCenterClass {
    return {
      id: item.id,
      name: item.name,
      code: item.code,
      description: item.description,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapPayload(payload: CostCenterClassPayload) {
    return {
      name: payload.name,
      code: payload.code,
      description: payload.description
    };
  }
}
