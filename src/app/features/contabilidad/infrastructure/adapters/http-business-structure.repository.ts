import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { BusinessStructureRepository } from '../../application/ports/business-structure.repository';
import {
  BusinessStructure,
  BusinessStructurePage,
  BusinessStructurePayload,
  BusinessStructureReference
} from '../../domain/models/business-structure.model';

interface ApiBusinessStructureReference {
  id: number;
  name: string;
  code?: string | null;
}

interface ApiBusinessStructure {
  id: number;
  country_id: number;
  country: ApiBusinessStructureReference | null;
  coin_id: number;
  coin: ApiBusinessStructureReference | null;
  enterprise_id: number;
  enterprise: ApiBusinessStructureReference | null;
  exercise_variation_id: number;
  exercise_variation: ApiBusinessStructureReference | null;
  chart_account_id: number;
  chart_account: ApiBusinessStructureReference | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListBusinessStructuresResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiBusinessStructure[];
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

interface BusinessStructureResponse {
  success: boolean;
  message: string;
  data: ApiBusinessStructure;
}

@Injectable()
export class HttpBusinessStructureRepository implements BusinessStructureRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<BusinessStructurePage> {
    return this.http
      .get<ListBusinessStructuresResponse>(
        `${this.apiBaseUrl}/accounting/business-structures`,
        {
          params: {
            page,
            per_page: perPage
          }
        }
      )
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapBusinessStructure(item)),
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

  getById(id: number): Observable<BusinessStructure> {
    return this.http
      .get<BusinessStructureResponse>(`${this.apiBaseUrl}/accounting/business-structures/${id}`)
      .pipe(map((response) => this.mapBusinessStructure(response.data)));
  }

  create(payload: BusinessStructurePayload): Observable<BusinessStructure> {
    return this.http
      .post<BusinessStructureResponse>(
        `${this.apiBaseUrl}/accounting/business-structures`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapBusinessStructure(response.data)));
  }

  update(id: number, payload: BusinessStructurePayload): Observable<BusinessStructure> {
    return this.http
      .put<BusinessStructureResponse>(
        `${this.apiBaseUrl}/accounting/business-structures/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapBusinessStructure(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/business-structures/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<BusinessStructure> {
    return this.http
      .post<BusinessStructureResponse>(
        `${this.apiBaseUrl}/accounting/business-structures/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapBusinessStructure(response.data)));
  }

  private mapBusinessStructure(item: ApiBusinessStructure): BusinessStructure {
    return {
      id: item.id,
      countryId: item.country_id,
      country: this.mapReference(item.country),
      coinId: item.coin_id,
      coin: this.mapReference(item.coin),
      enterpriseId: item.enterprise_id,
      enterprise: this.mapReference(item.enterprise),
      exerciseVariationId: item.exercise_variation_id,
      exerciseVariation: this.mapReference(item.exercise_variation),
      chartAccountId: item.chart_account_id,
      chartAccount: this.mapReference(item.chart_account),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(
    reference: ApiBusinessStructureReference | null
  ): BusinessStructureReference | null {
    if (!reference) {
      return null;
    }

    return {
      id: reference.id,
      name: reference.name,
      code: reference.code ?? null
    };
  }

  private mapPayload(payload: BusinessStructurePayload) {
    return {
      country_id: payload.countryId,
      coin_id: payload.coinId,
      enterprise_id: payload.enterpriseId,
      exercise_variation_id: payload.exerciseVariationId,
      chart_account_id: payload.chartAccountId
    };
  }
}
