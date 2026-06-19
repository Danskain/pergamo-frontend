import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountingNatureRepository } from '../../application/ports/accounting-nature.repository';
import {
  AccountingNature,
  AccountingNaturePage,
  AccountingNaturePayload
} from '../../domain/models/accounting-nature.model';

interface ApiAccountingNature {
  id: number;
  code: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountingNaturesResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountingNature[];
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

interface AccountingNatureResponse {
  success: boolean;
  message: string;
  data: ApiAccountingNature;
}

@Injectable()
export class HttpAccountingNatureRepository implements AccountingNatureRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<AccountingNaturePage> {
    return this.http
      .get<ListAccountingNaturesResponse>(`${this.apiBaseUrl}/accounting/accounting-natures`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountingNature(item)),
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

  getById(id: number): Observable<AccountingNature> {
    return this.http
      .get<AccountingNatureResponse>(`${this.apiBaseUrl}/accounting/accounting-natures/${id}`)
      .pipe(map((response) => this.mapAccountingNature(response.data)));
  }

  create(payload: AccountingNaturePayload): Observable<AccountingNature> {
    return this.http
      .post<AccountingNatureResponse>(
        `${this.apiBaseUrl}/accounting/accounting-natures`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingNature(response.data)));
  }

  update(id: number, payload: AccountingNaturePayload): Observable<AccountingNature> {
    return this.http
      .put<AccountingNatureResponse>(
        `${this.apiBaseUrl}/accounting/accounting-natures/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingNature(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/accounting-natures/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<AccountingNature> {
    return this.http
      .post<AccountingNatureResponse>(
        `${this.apiBaseUrl}/accounting/accounting-natures/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountingNature(response.data)));
  }

  private mapAccountingNature(item: ApiAccountingNature): AccountingNature {
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

  private mapPayload(payload: AccountingNaturePayload) {
    return {
      code: payload.code,
      name: payload.name,
      description: payload.description
    };
  }
}
