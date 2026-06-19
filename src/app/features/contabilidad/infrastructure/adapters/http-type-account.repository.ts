import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TypeAccountRepository } from '../../application/ports/type-account.repository';
import {
  TypeAccount,
  TypeAccountPage,
  TypeAccountPayload
} from '../../domain/models/type-account.model';

interface ApiTypeAccount {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListTypeAccountsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiTypeAccount[];
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

interface TypeAccountResponse {
  success: boolean;
  message: string;
  data: ApiTypeAccount;
}

@Injectable()
export class HttpTypeAccountRepository implements TypeAccountRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<TypeAccountPage> {
    return this.http
      .get<ListTypeAccountsResponse>(`${this.apiBaseUrl}/accounting/types-accounts`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapTypeAccount(item)),
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

  getById(id: number): Observable<TypeAccount> {
    return this.http
      .get<TypeAccountResponse>(`${this.apiBaseUrl}/accounting/types-accounts/${id}`)
      .pipe(map((response) => this.mapTypeAccount(response.data)));
  }

  create(payload: TypeAccountPayload): Observable<TypeAccount> {
    return this.http
      .post<TypeAccountResponse>(
        `${this.apiBaseUrl}/accounting/types-accounts`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapTypeAccount(response.data)));
  }

  update(id: number, payload: TypeAccountPayload): Observable<TypeAccount> {
    return this.http
      .put<TypeAccountResponse>(
        `${this.apiBaseUrl}/accounting/types-accounts/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapTypeAccount(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/types-accounts/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<TypeAccount> {
    return this.http
      .post<TypeAccountResponse>(
        `${this.apiBaseUrl}/accounting/types-accounts/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapTypeAccount(response.data)));
  }

  private mapTypeAccount(item: ApiTypeAccount): TypeAccount {
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

  private mapPayload(payload: TypeAccountPayload) {
    return {
      name: payload.name,
      code: payload.code,
      description: payload.description
    };
  }
}
