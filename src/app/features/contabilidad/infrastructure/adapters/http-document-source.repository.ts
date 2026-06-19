import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { DocumentSourceRepository } from '../../application/ports/document-source.repository';
import {
  DocumentSource,
  DocumentSourcePage,
  DocumentSourcePayload,
  DocumentSourceReference
} from '../../domain/models/document-source.model';

interface ApiDocumentSourceReference {
  id: number;
  name?: string;
  code?: string | null;
  label?: string | null;
  enterprise_id?: number;
  enterprise?: {
    id: number;
    name: string;
  } | null;
}

interface ApiDocumentSource {
  id: number;
  business_structure_id: number;
  business_structure?: ApiDocumentSourceReference | null;
  modules_id: number;
  module?: ApiDocumentSourceReference | null;
  modules?: ApiDocumentSourceReference | null;
  document_source_type_id: number;
  document_source_type?: ApiDocumentSourceReference | null;
  number_document_source: string;
  document_date: string;
  accounting_date: string;
  reference_id: number;
  reference?: ApiDocumentSourceReference | null;
  total_value: number | string;
  coin_id: number;
  coin?: ApiDocumentSourceReference | null;
  financial_statement_id: number;
  financial_statement?: ApiDocumentSourceReference | null;
  accounting_document_id: number;
  accounting_document?: ApiDocumentSourceReference | null;
  exercise: number;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListDocumentSourcesResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiDocumentSource[];
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

interface DocumentSourceResponse {
  success: boolean;
  message: string;
  data: ApiDocumentSource;
}

@Injectable()
export class HttpDocumentSourceRepository implements DocumentSourceRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<DocumentSourcePage> {
    return this.http
      .get<ListDocumentSourcesResponse>(`${this.apiBaseUrl}/accounting/documents-source`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapDocumentSource(item)),
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

  getById(id: number): Observable<DocumentSource> {
    return this.http
      .get<DocumentSourceResponse>(`${this.apiBaseUrl}/accounting/documents-source/${id}`)
      .pipe(map((response) => this.mapDocumentSource(response.data)));
  }

  create(payload: DocumentSourcePayload): Observable<DocumentSource> {
    return this.http
      .post<DocumentSourceResponse>(
        `${this.apiBaseUrl}/accounting/documents-source`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapDocumentSource(response.data)));
  }

  update(id: number, payload: DocumentSourcePayload): Observable<DocumentSource> {
    return this.http
      .put<DocumentSourceResponse>(
        `${this.apiBaseUrl}/accounting/documents-source/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapDocumentSource(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/documents-source/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<DocumentSource> {
    return this.http
      .post<DocumentSourceResponse>(
        `${this.apiBaseUrl}/accounting/documents-source/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapDocumentSource(response.data)));
  }

  private mapDocumentSource(item: ApiDocumentSource): DocumentSource {
    return {
      id: item.id,
      businessStructureId: item.business_structure_id,
      businessStructure: this.mapReference(item.business_structure),
      modulesId: item.modules_id,
      moduleItem: this.mapReference(item.module ?? item.modules),
      documentSourceTypeId: item.document_source_type_id,
      documentSourceType: this.mapReference(item.document_source_type),
      numberDocumentSource: item.number_document_source,
      documentDate: item.document_date,
      accountingDate: item.accounting_date,
      referenceId: item.reference_id,
      reference: this.mapReference(item.reference),
      totalValue: Number(item.total_value ?? 0),
      coinId: item.coin_id,
      coin: this.mapReference(item.coin),
      financialStatementId: item.financial_statement_id,
      financialStatement: this.mapReference(item.financial_statement),
      accountingDocumentId: item.accounting_document_id,
      accountingDocument: this.mapReference(item.accounting_document),
      exercise: item.exercise,
      description: item.description,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(
    item?: ApiDocumentSourceReference | null
  ): DocumentSourceReference | null {
    if (!item) {
      return null;
    }

    return {
      id: item.id,
      name: item.name ?? item.enterprise?.name ?? `Id ${item.id}`,
      code: item.code ?? null,
      label: item.label ?? item.enterprise?.name ?? null
    };
  }

  private mapPayload(payload: DocumentSourcePayload) {
    return {
      business_structure_id: payload.businessStructureId,
      modules_id: payload.modulesId,
      document_source_type_id: payload.documentSourceTypeId,
      number_document_source: payload.numberDocumentSource,
      document_date: payload.documentDate,
      accounting_date: payload.accountingDate,
      reference_id: payload.referenceId,
      total_value: payload.totalValue,
      coin_id: payload.coinId,
      financial_statement_id: payload.financialStatementId,
      accounting_document_id: payload.accountingDocumentId,
      exercise: payload.exercise,
      description: payload.description
    };
  }
}
