import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountingAccountRepository } from '../../application/ports/accounting-account.repository';
import {
  AccountingAccount,
  AccountingAccountPage,
  AccountingAccountPayload,
  AccountingAccountReference
} from '../../domain/models/accounting-account.model';

interface ApiAccountingAccountReference {
  id: number;
  name: string;
  code?: string | null;
  account?: string | null;
}

interface ApiAccountingAccount {
  id: number;
  account: string;
  chart_account_id: number;
  chart_account: ApiAccountingAccountReference | null;
  name: string;
  account_class_id: number;
  account_class: ApiAccountingAccountReference | null;
  types_account_id: number;
  type_account?: ApiAccountingAccountReference | null;
  types_account?: ApiAccountingAccountReference | null;
  accounting_group_id: number;
  accounting_group: ApiAccountingAccountReference | null;
  allows_manual_transactions: boolean;
  associated_account: boolean;
  accepts_taxes: boolean;
  foreign_currency: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountingAccountsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountingAccount[];
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

interface AccountingAccountResponse {
  success: boolean;
  message: string;
  data: ApiAccountingAccount;
}

@Injectable()
export class HttpAccountingAccountRepository implements AccountingAccountRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<AccountingAccountPage> {
    return this.http
      .get<ListAccountingAccountsResponse>(
        `${this.apiBaseUrl}/accounting/accounting-accounts`,
        {
          params: {
            page,
            per_page: perPage
          }
        }
      )
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountingAccount(item)),
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

  getById(id: number): Observable<AccountingAccount> {
    return this.http
      .get<AccountingAccountResponse>(`${this.apiBaseUrl}/accounting/accounting-accounts/${id}`)
      .pipe(map((response) => this.mapAccountingAccount(response.data)));
  }

  create(payload: AccountingAccountPayload): Observable<AccountingAccount> {
    return this.http
      .post<AccountingAccountResponse>(
        `${this.apiBaseUrl}/accounting/accounting-accounts`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingAccount(response.data)));
  }

  update(id: number, payload: AccountingAccountPayload): Observable<AccountingAccount> {
    return this.http
      .put<AccountingAccountResponse>(
        `${this.apiBaseUrl}/accounting/accounting-accounts/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingAccount(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/accounting-accounts/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<AccountingAccount> {
    return this.http
      .post<AccountingAccountResponse>(
        `${this.apiBaseUrl}/accounting/accounting-accounts/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountingAccount(response.data)));
  }

  private mapAccountingAccount(item: ApiAccountingAccount): AccountingAccount {
    return {
      id: item.id,
      account: item.account,
      chartAccountId: item.chart_account_id,
      chartAccount: this.mapReference(item.chart_account),
      name: item.name,
      accountClassId: item.account_class_id,
      accountClass: this.mapReference(item.account_class),
      typesAccountId: item.types_account_id,
      typesAccount: this.mapReference(item.type_account ?? item.types_account ?? null),
      accountingGroupId: item.accounting_group_id,
      accountingGroup: this.mapReference(item.accounting_group),
      allowsManualTransactions: item.allows_manual_transactions,
      associatedAccount: item.associated_account,
      acceptsTaxes: item.accepts_taxes,
      foreignCurrency: item.foreign_currency,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(
    reference: ApiAccountingAccountReference | null
  ): AccountingAccountReference | null {
    if (!reference) {
      return null;
    }

    return {
      id: reference.id,
      name: reference.name,
      code: reference.code ?? null,
      account: reference.account ?? null
    };
  }

  private mapPayload(payload: AccountingAccountPayload) {
    return {
      account: payload.account,
      chart_account_id: payload.chartAccountId,
      name: payload.name,
      account_class_id: payload.accountClassId,
      types_account_id: payload.typesAccountId,
      accounting_group_id: payload.accountingGroupId,
      allows_manual_transactions: payload.allowsManualTransactions,
      associated_account: payload.associatedAccount,
      accepts_taxes: payload.acceptsTaxes,
      foreign_currency: payload.foreignCurrency
    };
  }
}
