import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountingGroupRepository } from '../../application/ports/accounting-group.repository';
import {
  AccountingGroup,
  AccountingGroupPage,
  AccountingGroupPayload,
  AccountingGroupReference
} from '../../domain/models/accounting-group.model';

interface ApiAccountingGroupReference {
  id: number;
  name: string;
  code?: string | null;
}

interface ApiAccountingGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  account_class_id: number;
  account_class: ApiAccountingGroupReference | null;
  account_from: number;
  account_to: number;
  affects_closing: boolean;
  affects_financial_statements: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountingGroupsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountingGroup[];
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

interface AccountingGroupResponse {
  success: boolean;
  message: string;
  data: ApiAccountingGroup;
}

@Injectable()
export class HttpAccountingGroupRepository implements AccountingGroupRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<AccountingGroupPage> {
    return this.http
      .get<ListAccountingGroupsResponse>(`${this.apiBaseUrl}/accounting/accounting-groups`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountingGroup(item)),
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

  getById(id: number): Observable<AccountingGroup> {
    return this.http
      .get<AccountingGroupResponse>(`${this.apiBaseUrl}/accounting/accounting-groups/${id}`)
      .pipe(map((response) => this.mapAccountingGroup(response.data)));
  }

  create(payload: AccountingGroupPayload): Observable<AccountingGroup> {
    return this.http
      .post<AccountingGroupResponse>(
        `${this.apiBaseUrl}/accounting/accounting-groups`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingGroup(response.data)));
  }

  update(id: number, payload: AccountingGroupPayload): Observable<AccountingGroup> {
    return this.http
      .put<AccountingGroupResponse>(
        `${this.apiBaseUrl}/accounting/accounting-groups/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingGroup(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/accounting-groups/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<AccountingGroup> {
    return this.http
      .post<AccountingGroupResponse>(
        `${this.apiBaseUrl}/accounting/accounting-groups/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountingGroup(response.data)));
  }

  private mapAccountingGroup(item: ApiAccountingGroup): AccountingGroup {
    return {
      id: item.id,
      code: item.code,
      name: item.name,
      description: item.description,
      accountClassId: item.account_class_id,
      accountClass: this.mapReference(item.account_class),
      accountFrom: item.account_from,
      accountTo: item.account_to,
      affectsClosing: item.affects_closing,
      affectsFinancialStatements: item.affects_financial_statements,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(
    reference: ApiAccountingGroupReference | null
  ): AccountingGroupReference | null {
    if (!reference) {
      return null;
    }

    return {
      id: reference.id,
      name: reference.name,
      code: reference.code ?? null
    };
  }

  private mapPayload(payload: AccountingGroupPayload) {
    return {
      code: payload.code,
      account_class_id: payload.accountClassId,
      name: payload.name,
      description: payload.description,
      account_from: payload.accountFrom,
      account_to: payload.accountTo,
      affects_closing: payload.affectsClosing,
      affects_financial_statements: payload.affectsFinancialStatements
    };
  }
}
