import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountingSchemeRepository } from '../../application/ports/accounting-scheme.repository';
import {
  AccountingScheme,
  AccountingSchemePage,
  AccountingSchemePayload,
  AccountingSchemeReference
} from '../../domain/models/accounting-scheme.model';

interface ApiAccountingSchemeReference {
  id: number;
  name?: string;
  code?: string | null;
  label?: string | null;
  account?: string | null;
  reference_document?: string | null;
  enterprise?: {
    id: number;
    name: string;
  } | null;
}

interface ApiAccountingScheme {
  id: number;
  business_structure_id: number;
  business_structure?: ApiAccountingSchemeReference | null;
  chart_account_id: number;
  chart_account?: ApiAccountingSchemeReference | null;
  assessment_class: string;
  type_movement_id: number;
  type_movement?: ApiAccountingSchemeReference | null;
  product_inventory_movement?: ApiAccountingSchemeReference | null;
  accounting_event_id: number;
  accounting_event?: ApiAccountingSchemeReference | null;
  key_operation_id: number;
  key_operation?: ApiAccountingSchemeReference | null;
  accounting_account_id: number;
  accounting_account?: ApiAccountingSchemeReference | null;
  accounting_accounts?: ApiAccountingSchemeReference | null;
  accounting_nature_id: number;
  accounting_nature?: ApiAccountingSchemeReference | null;
  require_coce: boolean | number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountingSchemesResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountingScheme[];
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

interface AccountingSchemeResponse {
  success: boolean;
  message: string;
  data: ApiAccountingScheme;
}

@Injectable()
export class HttpAccountingSchemeRepository implements AccountingSchemeRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<AccountingSchemePage> {
    return this.http
      .get<ListAccountingSchemesResponse>(`${this.apiBaseUrl}/accounting/accounting-schemes`, {
        params: { page, per_page: perPage }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountingScheme(item)),
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

  getById(id: number): Observable<AccountingScheme> {
    return this.http
      .get<AccountingSchemeResponse>(`${this.apiBaseUrl}/accounting/accounting-schemes/${id}`)
      .pipe(map((response) => this.mapAccountingScheme(response.data)));
  }

  create(payload: AccountingSchemePayload): Observable<AccountingScheme> {
    return this.http
      .post<AccountingSchemeResponse>(
        `${this.apiBaseUrl}/accounting/accounting-schemes`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingScheme(response.data)));
  }

  update(id: number, payload: AccountingSchemePayload): Observable<AccountingScheme> {
    return this.http
      .put<AccountingSchemeResponse>(
        `${this.apiBaseUrl}/accounting/accounting-schemes/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingScheme(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/accounting-schemes/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<AccountingScheme> {
    return this.http
      .post<AccountingSchemeResponse>(
        `${this.apiBaseUrl}/accounting/accounting-schemes/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountingScheme(response.data)));
  }

  private mapAccountingScheme(item: ApiAccountingScheme): AccountingScheme {
    return {
      id: item.id,
      businessStructureId: item.business_structure_id,
      businessStructure: this.mapReference(item.business_structure ?? null),
      chartAccountId: item.chart_account_id,
      chartAccount: this.mapReference(item.chart_account ?? null),
      assessmentClass: item.assessment_class,
      typeMovementId: item.type_movement_id,
      typeMovement: this.mapReference(item.type_movement ?? item.product_inventory_movement ?? null),
      accountingEventId: item.accounting_event_id,
      accountingEvent: this.mapReference(item.accounting_event ?? null),
      keyOperationId: item.key_operation_id,
      keyOperation: this.mapReference(item.key_operation ?? null),
      accountingAccountId: item.accounting_account_id,
      accountingAccount: this.mapReference(item.accounting_account ?? item.accounting_accounts ?? null),
      accountingNatureId: item.accounting_nature_id,
      accountingNature: this.mapReference(item.accounting_nature ?? null),
      requireCoce: Boolean(item.require_coce),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(reference: ApiAccountingSchemeReference | null): AccountingSchemeReference | null {
    if (!reference) {
      return null;
    }

    return {
      id: reference.id,
      name:
        reference.name ??
        reference.account ??
        reference.reference_document ??
        reference.enterprise?.name ??
        `Id ${reference.id}`,
      code: reference.code ?? null,
      label:
        reference.label ??
        reference.account ??
        reference.reference_document ??
        reference.enterprise?.name ??
        null
    };
  }

  private mapPayload(payload: AccountingSchemePayload) {
    return {
      business_structure_id: payload.businessStructureId,
      chart_account_id: payload.chartAccountId,
      assessment_class: payload.assessmentClass,
      type_movement_id: payload.typeMovementId,
      accounting_event_id: payload.accountingEventId,
      key_operation_id: payload.keyOperationId,
      accounting_account_id: payload.accountingAccountId,
      accounting_nature_id: payload.accountingNatureId,
      require_coce: payload.requireCoce
    };
  }
}
