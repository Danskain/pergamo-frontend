import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { DocumentSourceTypeRepository } from '../../application/ports/document-source-type.repository';
import {
  DocumentSourceType,
  DocumentSourceTypePage,
  DocumentSourceTypePayload
} from '../../domain/models/document-source-type.model';

interface ApiDocumentSourceType {
  id: number;
  name: string;
  code: string;
  description: string;
  generates_accounting: boolean;
  manual_entry: boolean;
  requires_approval: boolean;
  requires_third: boolean;
  requires_ceco: boolean;
  affects_inventory: boolean;
  affects_cartera: boolean;
  affects_cxp: boolean;
  affects_treasury: boolean;
  allows_reversal: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListDocumentSourceTypesResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiDocumentSourceType[];
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

interface DocumentSourceTypeResponse {
  success: boolean;
  message: string;
  data: ApiDocumentSourceType;
}

@Injectable()
export class HttpDocumentSourceTypeRepository implements DocumentSourceTypeRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<DocumentSourceTypePage> {
    return this.http
      .get<ListDocumentSourceTypesResponse>(
        `${this.apiBaseUrl}/accounting/document-source-types`,
        {
          params: {
            page,
            per_page: perPage
          }
        }
      )
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapDocumentSourceType(item)),
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

  getById(id: number): Observable<DocumentSourceType> {
    return this.http
      .get<DocumentSourceTypeResponse>(
        `${this.apiBaseUrl}/accounting/document-source-types/${id}`
      )
      .pipe(map((response) => this.mapDocumentSourceType(response.data)));
  }

  create(payload: DocumentSourceTypePayload): Observable<DocumentSourceType> {
    return this.http
      .post<DocumentSourceTypeResponse>(
        `${this.apiBaseUrl}/accounting/document-source-types`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapDocumentSourceType(response.data)));
  }

  update(id: number, payload: DocumentSourceTypePayload): Observable<DocumentSourceType> {
    return this.http
      .put<DocumentSourceTypeResponse>(
        `${this.apiBaseUrl}/accounting/document-source-types/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapDocumentSourceType(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/document-source-types/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<DocumentSourceType> {
    return this.http
      .post<DocumentSourceTypeResponse>(
        `${this.apiBaseUrl}/accounting/document-source-types/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapDocumentSourceType(response.data)));
  }

  private mapDocumentSourceType(item: ApiDocumentSourceType): DocumentSourceType {
    return {
      id: item.id,
      name: item.name,
      code: item.code,
      description: item.description,
      generatesAccounting: item.generates_accounting,
      manualEntry: item.manual_entry,
      requiresApproval: item.requires_approval,
      requiresThird: item.requires_third,
      requiresCeco: item.requires_ceco,
      affectsInventory: item.affects_inventory,
      affectsCartera: item.affects_cartera,
      affectsCxp: item.affects_cxp,
      affectsTreasury: item.affects_treasury,
      allowsReversal: item.allows_reversal,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapPayload(payload: DocumentSourceTypePayload) {
    return {
      name: payload.name,
      code: payload.code,
      description: payload.description,
      generates_accounting: payload.generatesAccounting,
      manual_entry: payload.manualEntry,
      requires_approval: payload.requiresApproval,
      requires_third: payload.requiresThird,
      requires_ceco: payload.requiresCeco,
      affects_inventory: payload.affectsInventory,
      affects_cartera: payload.affectsCartera,
      affects_cxp: payload.affectsCxp,
      affects_treasury: payload.affectsTreasury,
      allows_reversal: payload.allowsReversal
    };
  }
}
