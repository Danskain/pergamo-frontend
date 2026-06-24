import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountClassRepository } from '../../application/ports/account-class.repository';
import {
  AccountClass,
  AccountClassPage,
  AccountClassPayload,
  AccountClassReference
} from '../../domain/models/account-class.model';

interface ApiAccountClassReference {
  id: number;
  name: string;
  code?: string | null;
}

interface ApiAccountClass {
  id: number;
  name: string;
  description: string;
  accounting_nature_id: number;
  accounting_nature: ApiAccountClassReference | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountClassesResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountClass[];
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

interface AccountClassResponse {
  success: boolean;
  message: string;
  data: ApiAccountClass;
}

@Injectable()
export class HttpAccountClassRepository implements AccountClassRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<AccountClassPage> {
    return this.http
      .get<ListAccountClassesResponse>(`${this.apiBaseUrl}/accounting/account-classes`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountClass(item)),
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

  getById(id: number): Observable<AccountClass> {
    return this.http
      .get<AccountClassResponse>(`${this.apiBaseUrl}/accounting/account-classes/${id}`)
      .pipe(map((response) => this.mapAccountClass(response.data)));
  }

  create(payload: AccountClassPayload): Observable<AccountClass> {
    return this.http
      .post<AccountClassResponse>(
        `${this.apiBaseUrl}/accounting/account-classes`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountClass(response.data)));
  }

  update(id: number, payload: AccountClassPayload): Observable<AccountClass> {
    return this.http
      .put<AccountClassResponse>(
        `${this.apiBaseUrl}/accounting/account-classes/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountClass(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/account-classes/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<AccountClass> {
    return this.http
      .post<AccountClassResponse>(
        `${this.apiBaseUrl}/accounting/account-classes/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountClass(response.data)));
  }

  private mapAccountClass(item: ApiAccountClass): AccountClass {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      accountingNatureId: item.accounting_nature_id,
      accountingNature: this.mapReference(item.accounting_nature),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(reference: ApiAccountClassReference | null): AccountClassReference | null {
    if (!reference) {
      return null;
    }

    return {
      id: reference.id,
      name: reference.name,
      code: reference.code ?? null
    };
  }

  private mapPayload(payload: AccountClassPayload) {
    return {
      name: payload.name,
      accounting_nature_id: payload.accountingNatureId,
      description: payload.description
    };
  }
}
