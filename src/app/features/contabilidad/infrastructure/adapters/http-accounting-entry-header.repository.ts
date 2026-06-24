import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountingEntryHeaderRepository } from '../../application/ports/accounting-entry-header.repository';
import {
  AccountingEntryHeader,
  AccountingEntryHeaderPage,
  AccountingEntryHeaderPayload,
  AccountingEntryHeaderReference
} from '../../domain/models/accounting-entry-header.model';

interface ApiAccountingEntryHeaderReference {
  id: number;
  name?: string;
  code?: string | null;
  label?: string | null;
  number_document_source?: string | null;
  exercise?: number | string | null;
  enterprise_id?: number;
  enterprise?: {
    id: number;
    name: string;
  } | null;
}

interface ApiAccountingEntryHeader {
  id: number;
  business_structure_id: number;
  business_structure?: ApiAccountingEntryHeaderReference | null;
  accounting_document_id: number;
  accounting_document?: ApiAccountingEntryHeaderReference | null;
  accounting_period: number;
  coin_id: number;
  coin?: ApiAccountingEntryHeaderReference | null;
  description: string;
  total_debits: number | string;
  total_credits: number | string;
  reference_document: string;
  documents_source_id: number;
  document_source?: ApiAccountingEntryHeaderReference | null;
  documents_source?: ApiAccountingEntryHeaderReference | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountingEntryHeadersResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountingEntryHeader[];
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

interface AccountingEntryHeaderResponse {
  success: boolean;
  message: string;
  data: ApiAccountingEntryHeader;
}

@Injectable()
export class HttpAccountingEntryHeaderRepository implements AccountingEntryHeaderRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<AccountingEntryHeaderPage> {
    return this.http
      .get<ListAccountingEntryHeadersResponse>(
        `${this.apiBaseUrl}/accounting/accounting-entry-headers`,
        {
          params: {
            page,
            per_page: perPage
          }
        }
      )
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountingEntryHeader(item)),
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

  getById(id: number): Observable<AccountingEntryHeader> {
    return this.http
      .get<AccountingEntryHeaderResponse>(
        `${this.apiBaseUrl}/accounting/accounting-entry-headers/${id}`
      )
      .pipe(map((response) => this.mapAccountingEntryHeader(response.data)));
  }

  create(payload: AccountingEntryHeaderPayload): Observable<AccountingEntryHeader> {
    return this.http
      .post<AccountingEntryHeaderResponse>(
        `${this.apiBaseUrl}/accounting/accounting-entry-headers`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingEntryHeader(response.data)));
  }

  update(id: number, payload: AccountingEntryHeaderPayload): Observable<AccountingEntryHeader> {
    return this.http
      .put<AccountingEntryHeaderResponse>(
        `${this.apiBaseUrl}/accounting/accounting-entry-headers/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingEntryHeader(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/accounting-entry-headers/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<AccountingEntryHeader> {
    return this.http
      .post<AccountingEntryHeaderResponse>(
        `${this.apiBaseUrl}/accounting/accounting-entry-headers/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountingEntryHeader(response.data)));
  }

  private mapAccountingEntryHeader(item: ApiAccountingEntryHeader): AccountingEntryHeader {
    return {
      id: item.id,
      businessStructureId: item.business_structure_id,
      businessStructure: this.mapReference(item.business_structure),
      accountingDocumentId: item.accounting_document_id,
      accountingDocument: this.mapReference(item.accounting_document),
      accountingPeriod: item.accounting_period,
      coinId: item.coin_id,
      coin: this.mapReference(item.coin),
      description: item.description,
      totalDebits: Number(item.total_debits ?? 0),
      totalCredits: Number(item.total_credits ?? 0),
      referenceDocument: item.reference_document,
      documentsSourceId: item.documents_source_id,
      documentSource: this.mapReference(item.document_source ?? item.documents_source),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(
    item?: ApiAccountingEntryHeaderReference | null
  ): AccountingEntryHeaderReference | null {
    if (!item) {
      return null;
    }

    return {
      id: item.id,
      name:
        item.name ??
        item.number_document_source ??
        item.enterprise?.name ??
        `Id ${item.id}`,
      code: item.code ?? null,
      label: item.label ?? item.number_document_source ?? item.enterprise?.name ?? null
    };
  }

  private mapPayload(payload: AccountingEntryHeaderPayload) {
    return {
      business_structure_id: payload.businessStructureId,
      accounting_document_id: payload.accountingDocumentId,
      accounting_period: payload.accountingPeriod,
      coin_id: payload.coinId,
      description: payload.description,
      total_debits: payload.totalDebits,
      total_credits: payload.totalCredits,
      reference_document: payload.referenceDocument,
      documents_source_id: payload.documentsSourceId
    };
  }
}
