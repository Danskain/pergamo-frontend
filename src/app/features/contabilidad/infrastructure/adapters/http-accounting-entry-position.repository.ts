import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountingEntryPositionRepository } from '../../application/ports/accounting-entry-position.repository';
import {
  AccountingEntryPosition,
  AccountingEntryPositionPage,
  AccountingEntryPositionPayload,
  AccountingEntryPositionReference
} from '../../domain/models/accounting-entry-position.model';

interface ApiAccountingEntryPositionReference {
  id: number;
  name?: string;
  code?: string | null;
  label?: string | null;
  account?: string | null;
  reference_document?: string | null;
  accounting_period?: number | string | null;
  enterprise_id?: number;
  enterprise?: {
    id: number;
    name: string;
  } | null;
}

interface ApiAccountingEntryPosition {
  id: number;
  business_structure_id: number;
  business_structure?: ApiAccountingEntryPositionReference | null;
  accounting_document_id: number;
  accounting_document?: ApiAccountingEntryPositionReference | null;
  accounting_entry_header_id: number;
  accounting_entry_header?: ApiAccountingEntryPositionReference | null;
  accounting_accounts_id: number;
  accounting_account?: ApiAccountingEntryPositionReference | null;
  accounting_accounts?: ApiAccountingEntryPositionReference | null;
  id_tercero: number | null;
  indicator_dc: 'Debito' | 'Credito' | null;
  amount: number | string;
  coin_id: number;
  coin?: ApiAccountingEntryPositionReference | null;
  cost_center_id: number | null;
  cost_center?: ApiAccountingEntryPositionReference | null;
  position_text: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountingEntryPositionsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountingEntryPosition[];
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

interface AccountingEntryPositionResponse {
  success: boolean;
  message: string;
  data: ApiAccountingEntryPosition;
}

@Injectable()
export class HttpAccountingEntryPositionRepository implements AccountingEntryPositionRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<AccountingEntryPositionPage> {
    return this.http
      .get<ListAccountingEntryPositionsResponse>(
        `${this.apiBaseUrl}/accounting/accounting-entry-positions`,
        {
          params: {
            page,
            per_page: perPage
          }
        }
      )
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountingEntryPosition(item)),
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

  getById(id: number): Observable<AccountingEntryPosition> {
    return this.http
      .get<AccountingEntryPositionResponse>(
        `${this.apiBaseUrl}/accounting/accounting-entry-positions/${id}`
      )
      .pipe(map((response) => this.mapAccountingEntryPosition(response.data)));
  }

  create(payload: AccountingEntryPositionPayload): Observable<AccountingEntryPosition> {
    return this.http
      .post<AccountingEntryPositionResponse>(
        `${this.apiBaseUrl}/accounting/accounting-entry-positions`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingEntryPosition(response.data)));
  }

  update(id: number, payload: AccountingEntryPositionPayload): Observable<AccountingEntryPosition> {
    return this.http
      .put<AccountingEntryPositionResponse>(
        `${this.apiBaseUrl}/accounting/accounting-entry-positions/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingEntryPosition(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/accounting-entry-positions/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<AccountingEntryPosition> {
    return this.http
      .post<AccountingEntryPositionResponse>(
        `${this.apiBaseUrl}/accounting/accounting-entry-positions/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountingEntryPosition(response.data)));
  }

  private mapAccountingEntryPosition(item: ApiAccountingEntryPosition): AccountingEntryPosition {
    return {
      id: item.id,
      businessStructureId: item.business_structure_id,
      businessStructure: this.mapReference(item.business_structure),
      accountingDocumentId: item.accounting_document_id,
      accountingDocument: this.mapReference(item.accounting_document),
      accountingEntryHeaderId: item.accounting_entry_header_id,
      accountingEntryHeader: this.mapReference(item.accounting_entry_header),
      accountingAccountsId: item.accounting_accounts_id,
      accountingAccount: this.mapReference(item.accounting_account ?? item.accounting_accounts),
      idTercero: item.id_tercero,
      indicatorDc: item.indicator_dc,
      amount: Number(item.amount ?? 0),
      coinId: item.coin_id,
      coin: this.mapReference(item.coin),
      costCenterId: item.cost_center_id,
      costCenter: this.mapReference(item.cost_center),
      positionText: item.position_text,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(
    item?: ApiAccountingEntryPositionReference | null
  ): AccountingEntryPositionReference | null {
    if (!item) {
      return null;
    }

    return {
      id: item.id,
      name: item.name ?? item.reference_document ?? item.enterprise?.name ?? `Id ${item.id}`,
      code: item.code ?? null,
      label: item.label ?? item.reference_document ?? item.enterprise?.name ?? null,
      account: item.account ?? null
    };
  }

  private mapPayload(payload: AccountingEntryPositionPayload) {
    return {
      business_structure_id: payload.businessStructureId,
      accounting_document_id: payload.accountingDocumentId,
      accounting_entry_header_id: payload.accountingEntryHeaderId,
      accounting_accounts_id: payload.accountingAccountsId,
      id_tercero: payload.idTercero,
      indicator_dc: payload.indicatorDc,
      amount: payload.amount,
      coin_id: payload.coinId,
      cost_center_id: payload.costCenterId,
      position_text: payload.positionText
    };
  }
}
