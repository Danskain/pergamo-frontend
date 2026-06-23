import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { KeyOperationRepository } from '../../application/ports/key-operation.repository';
import {
  KeyOperation,
  KeyOperationPage,
  KeyOperationPayload,
  KeyOperationReference
} from '../../domain/models/key-operation.model';

interface ApiKeyOperationReference {
  id: number;
  name: string;
  code?: string | null;
  label?: string | null;
}

interface ApiKeyOperation {
  id: number;
  code: string;
  name: string;
  module_id: number;
  module?: ApiKeyOperationReference | null;
  modules?: ApiKeyOperationReference | null;
  accounting_nature_id: number;
  accounting_nature?: ApiKeyOperationReference | null;
  affects_taxes: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListKeyOperationsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiKeyOperation[];
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

interface KeyOperationResponse {
  success: boolean;
  message: string;
  data: ApiKeyOperation;
}

@Injectable()
export class HttpKeyOperationRepository implements KeyOperationRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<KeyOperationPage> {
    return this.http
      .get<ListKeyOperationsResponse>(`${this.apiBaseUrl}/accounting/key-operations`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapKeyOperation(item)),
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

  getById(id: number): Observable<KeyOperation> {
    return this.http
      .get<KeyOperationResponse>(`${this.apiBaseUrl}/accounting/key-operations/${id}`)
      .pipe(map((response) => this.mapKeyOperation(response.data)));
  }

  create(payload: KeyOperationPayload): Observable<KeyOperation> {
    return this.http
      .post<KeyOperationResponse>(
        `${this.apiBaseUrl}/accounting/key-operations`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapKeyOperation(response.data)));
  }

  update(id: number, payload: KeyOperationPayload): Observable<KeyOperation> {
    return this.http
      .put<KeyOperationResponse>(
        `${this.apiBaseUrl}/accounting/key-operations/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapKeyOperation(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/key-operations/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<KeyOperation> {
    return this.http
      .post<KeyOperationResponse>(`${this.apiBaseUrl}/accounting/key-operations/${id}/restore`, {})
      .pipe(map((response) => this.mapKeyOperation(response.data)));
  }

  private mapKeyOperation(item: ApiKeyOperation): KeyOperation {
    return {
      id: item.id,
      code: item.code,
      name: item.name,
      moduleId: item.module_id,
      module: this.mapReference(item.module ?? item.modules ?? null),
      accountingNatureId: item.accounting_nature_id,
      accountingNature: this.mapReference(item.accounting_nature ?? null),
      affectsTaxes: Boolean(item.affects_taxes),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(reference: ApiKeyOperationReference | null): KeyOperationReference | null {
    if (!reference) {
      return null;
    }

    return {
      id: reference.id,
      name: reference.name,
      code: reference.code ?? null,
      label: reference.label ?? null
    };
  }

  private mapPayload(payload: KeyOperationPayload) {
    return {
      code: payload.code,
      name: payload.name,
      module_id: payload.moduleId,
      accounting_nature_id: payload.accountingNatureId,
      affects_taxes: payload.affectsTaxes
    };
  }
}
