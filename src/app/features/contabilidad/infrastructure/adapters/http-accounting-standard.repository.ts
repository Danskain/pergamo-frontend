import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountingStandardRepository } from '../../application/ports/accounting-standard.repository';
import {
  AccountingStandard,
  AccountingStandardPage,
  AccountingStandardPayload
} from '../../domain/models/accounting-standard.model';

interface ApiAccountingStandard {
  id: number;
  code: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountingStandardsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountingStandard[];
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

interface AccountingStandardResponse {
  success: boolean;
  message: string;
  data: ApiAccountingStandard;
}

@Injectable()
export class HttpAccountingStandardRepository
  implements AccountingStandardRepository
{
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<AccountingStandardPage> {
    return this.http
      .get<ListAccountingStandardsResponse>(
        `${this.apiBaseUrl}/accounting/accounting-standards`,
        {
          params: {
            page,
            per_page: perPage
          }
        }
      )
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountingStandard(item)),
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

  getById(id: number): Observable<AccountingStandard> {
    return this.http
      .get<AccountingStandardResponse>(
        `${this.apiBaseUrl}/accounting/accounting-standards/${id}`
      )
      .pipe(map((response) => this.mapAccountingStandard(response.data)));
  }

  create(payload: AccountingStandardPayload): Observable<AccountingStandard> {
    return this.http
      .post<AccountingStandardResponse>(
        `${this.apiBaseUrl}/accounting/accounting-standards`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingStandard(response.data)));
  }

  update(
    id: number,
    payload: AccountingStandardPayload
  ): Observable<AccountingStandard> {
    return this.http
      .put<AccountingStandardResponse>(
        `${this.apiBaseUrl}/accounting/accounting-standards/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingStandard(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/accounting-standards/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<AccountingStandard> {
    return this.http
      .post<AccountingStandardResponse>(
        `${this.apiBaseUrl}/accounting/accounting-standards/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountingStandard(response.data)));
  }

  private mapAccountingStandard(item: ApiAccountingStandard): AccountingStandard {
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

  private mapPayload(payload: AccountingStandardPayload) {
    return {
      code: payload.code,
      name: payload.name,
      description: payload.description
    };
  }
}
