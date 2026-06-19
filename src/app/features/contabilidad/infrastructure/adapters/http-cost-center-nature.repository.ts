import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CostCenterNatureRepository } from '../../application/ports/cost-center-nature.repository';
import {
  CostCenterNature,
  CostCenterNaturePage,
  CostCenterNaturePayload
} from '../../domain/models/cost-center-nature.model';

interface ApiCostCenterNature {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListCostCenterNaturesResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiCostCenterNature[];
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

interface CostCenterNatureResponse {
  success: boolean;
  message: string;
  data: ApiCostCenterNature;
}

@Injectable()
export class HttpCostCenterNatureRepository implements CostCenterNatureRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<CostCenterNaturePage> {
    return this.http
      .get<ListCostCenterNaturesResponse>(
        `${this.apiBaseUrl}/accounting/cost-center-natures`,
        {
          params: {
            page,
            per_page: perPage
          }
        }
      )
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapCostCenterNature(item)),
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

  getById(id: number): Observable<CostCenterNature> {
    return this.http
      .get<CostCenterNatureResponse>(`${this.apiBaseUrl}/accounting/cost-center-natures/${id}`)
      .pipe(map((response) => this.mapCostCenterNature(response.data)));
  }

  create(payload: CostCenterNaturePayload): Observable<CostCenterNature> {
    return this.http
      .post<CostCenterNatureResponse>(
        `${this.apiBaseUrl}/accounting/cost-center-natures`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapCostCenterNature(response.data)));
  }

  update(id: number, payload: CostCenterNaturePayload): Observable<CostCenterNature> {
    return this.http
      .put<CostCenterNatureResponse>(
        `${this.apiBaseUrl}/accounting/cost-center-natures/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapCostCenterNature(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/cost-center-natures/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<CostCenterNature> {
    return this.http
      .post<CostCenterNatureResponse>(
        `${this.apiBaseUrl}/accounting/cost-center-natures/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapCostCenterNature(response.data)));
  }

  private mapCostCenterNature(item: ApiCostCenterNature): CostCenterNature {
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

  private mapPayload(payload: CostCenterNaturePayload) {
    return {
      name: payload.name,
      code: payload.code,
      description: payload.description
    };
  }
}
