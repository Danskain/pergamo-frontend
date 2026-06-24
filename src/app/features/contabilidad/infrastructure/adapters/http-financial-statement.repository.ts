import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { FinancialStatementRepository } from '../../application/ports/financial-statement.repository';
import {
  FinancialStatement,
  FinancialStatementPage,
  FinancialStatementPayload
} from '../../domain/models/financial-statement.model';

interface ApiFinancialStatement {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListFinancialStatementsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiFinancialStatement[];
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

interface FinancialStatementResponse {
  success: boolean;
  message: string;
  data: ApiFinancialStatement;
}

@Injectable()
export class HttpFinancialStatementRepository implements FinancialStatementRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<FinancialStatementPage> {
    return this.http
      .get<ListFinancialStatementsResponse>(`${this.apiBaseUrl}/accounting/financial-statements`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapFinancialStatement(item)),
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

  getById(id: number): Observable<FinancialStatement> {
    return this.http
      .get<FinancialStatementResponse>(`${this.apiBaseUrl}/accounting/financial-statements/${id}`)
      .pipe(map((response) => this.mapFinancialStatement(response.data)));
  }

  create(payload: FinancialStatementPayload): Observable<FinancialStatement> {
    return this.http
      .post<FinancialStatementResponse>(
        `${this.apiBaseUrl}/accounting/financial-statements`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapFinancialStatement(response.data)));
  }

  update(id: number, payload: FinancialStatementPayload): Observable<FinancialStatement> {
    return this.http
      .put<FinancialStatementResponse>(
        `${this.apiBaseUrl}/accounting/financial-statements/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapFinancialStatement(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/financial-statements/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<FinancialStatement> {
    return this.http
      .post<FinancialStatementResponse>(
        `${this.apiBaseUrl}/accounting/financial-statements/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapFinancialStatement(response.data)));
  }

  private mapFinancialStatement(item: ApiFinancialStatement): FinancialStatement {
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

  private mapPayload(payload: FinancialStatementPayload) {
    return {
      name: payload.name,
      code: payload.code,
      description: payload.description
    };
  }
}
