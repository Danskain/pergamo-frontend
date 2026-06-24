import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountingDocumentRepository } from '../../application/ports/accounting-document.repository';
import {
  AccountingDocument,
  AccountingDocumentPage,
  AccountingDocumentPayload
} from '../../domain/models/accounting-document.model';

interface ApiAccountingDocument {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountingDocumentsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountingDocument[];
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

interface AccountingDocumentResponse {
  success: boolean;
  message: string;
  data: ApiAccountingDocument;
}

@Injectable()
export class HttpAccountingDocumentRepository implements AccountingDocumentRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<AccountingDocumentPage> {
    return this.http
      .get<ListAccountingDocumentsResponse>(
        `${this.apiBaseUrl}/accounting/accounting-documents`,
        {
          params: {
            page,
            per_page: perPage
          }
        }
      )
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountingDocument(item)),
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

  getById(id: number): Observable<AccountingDocument> {
    return this.http
      .get<AccountingDocumentResponse>(
        `${this.apiBaseUrl}/accounting/accounting-documents/${id}`
      )
      .pipe(map((response) => this.mapAccountingDocument(response.data)));
  }

  create(payload: AccountingDocumentPayload): Observable<AccountingDocument> {
    return this.http
      .post<AccountingDocumentResponse>(
        `${this.apiBaseUrl}/accounting/accounting-documents`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingDocument(response.data)));
  }

  update(id: number, payload: AccountingDocumentPayload): Observable<AccountingDocument> {
    return this.http
      .put<AccountingDocumentResponse>(
        `${this.apiBaseUrl}/accounting/accounting-documents/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingDocument(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/accounting-documents/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<AccountingDocument> {
    return this.http
      .post<AccountingDocumentResponse>(
        `${this.apiBaseUrl}/accounting/accounting-documents/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountingDocument(response.data)));
  }

  private mapAccountingDocument(item: ApiAccountingDocument): AccountingDocument {
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

  private mapPayload(payload: AccountingDocumentPayload) {
    return {
      name: payload.name,
      code: payload.code,
      description: payload.description
    };
  }
}
