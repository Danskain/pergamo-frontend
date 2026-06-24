import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountingMomentRepository } from '../../application/ports/accounting-moment.repository';
import {
  AccountingMoment,
  AccountingMomentPage,
  AccountingMomentPayload
} from '../../domain/models/accounting-moment.model';

interface ApiAccountingMoment {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountingMomentsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountingMoment[];
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

interface AccountingMomentResponse {
  success: boolean;
  message: string;
  data: ApiAccountingMoment;
}

@Injectable()
export class HttpAccountingMomentRepository implements AccountingMomentRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<AccountingMomentPage> {
    return this.http
      .get<ListAccountingMomentsResponse>(`${this.apiBaseUrl}/accounting/accounting-moments`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountingMoment(item)),
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

  getById(id: number): Observable<AccountingMoment> {
    return this.http
      .get<AccountingMomentResponse>(`${this.apiBaseUrl}/accounting/accounting-moments/${id}`)
      .pipe(map((response) => this.mapAccountingMoment(response.data)));
  }

  create(payload: AccountingMomentPayload): Observable<AccountingMoment> {
    return this.http
      .post<AccountingMomentResponse>(
        `${this.apiBaseUrl}/accounting/accounting-moments`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingMoment(response.data)));
  }

  update(id: number, payload: AccountingMomentPayload): Observable<AccountingMoment> {
    return this.http
      .put<AccountingMomentResponse>(
        `${this.apiBaseUrl}/accounting/accounting-moments/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingMoment(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/accounting-moments/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<AccountingMoment> {
    return this.http
      .post<AccountingMomentResponse>(
        `${this.apiBaseUrl}/accounting/accounting-moments/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountingMoment(response.data)));
  }

  private mapAccountingMoment(item: ApiAccountingMoment): AccountingMoment {
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

  private mapPayload(payload: AccountingMomentPayload) {
    return {
      name: payload.name,
      code: payload.code,
      description: payload.description
    };
  }
}
