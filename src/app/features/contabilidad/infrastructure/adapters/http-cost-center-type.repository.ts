import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CostCenterTypeRepository } from '../../application/ports/cost-center-type.repository';
import {
  CostCenterType,
  CostCenterTypePage,
  CostCenterTypePayload
} from '../../domain/models/cost-center-type.model';

interface ApiCostCenterType {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListCostCenterTypesResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiCostCenterType[];
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

interface CostCenterTypeResponse {
  success: boolean;
  message: string;
  data: ApiCostCenterType;
}

@Injectable()
export class HttpCostCenterTypeRepository implements CostCenterTypeRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<CostCenterTypePage> {
    return this.http
      .get<ListCostCenterTypesResponse>(`${this.apiBaseUrl}/accounting/cost-center-types`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapCostCenterType(item)),
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

  getById(id: number): Observable<CostCenterType> {
    return this.http
      .get<CostCenterTypeResponse>(`${this.apiBaseUrl}/accounting/cost-center-types/${id}`)
      .pipe(map((response) => this.mapCostCenterType(response.data)));
  }

  create(payload: CostCenterTypePayload): Observable<CostCenterType> {
    return this.http
      .post<CostCenterTypeResponse>(
        `${this.apiBaseUrl}/accounting/cost-center-types`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapCostCenterType(response.data)));
  }

  update(id: number, payload: CostCenterTypePayload): Observable<CostCenterType> {
    return this.http
      .put<CostCenterTypeResponse>(
        `${this.apiBaseUrl}/accounting/cost-center-types/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapCostCenterType(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/cost-center-types/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<CostCenterType> {
    return this.http
      .post<CostCenterTypeResponse>(
        `${this.apiBaseUrl}/accounting/cost-center-types/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapCostCenterType(response.data)));
  }

  private mapCostCenterType(item: ApiCostCenterType): CostCenterType {
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

  private mapPayload(payload: CostCenterTypePayload) {
    return {
      name: payload.name,
      code: payload.code,
      description: payload.description
    };
  }
}
