import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ChartAccountRepository } from '../../application/ports/chart-account.repository';
import {
  ChartAccount,
  ChartAccountReference,
  ChartAccountPage,
  ChartAccountPayload
} from '../../domain/models/chart-account.model';

interface ApiChartAccountReference {
  id: number;
  name: string;
  code: string;
}

interface ApiChartAccount {
  id: number;
  code: string;
  name: string;
  description: string;
  accounting_standard_id: number;
  types_plan_id: number;
  accounting_standard: ApiChartAccountReference | null;
  type_plan: ApiChartAccountReference | null;
  ceco_permission: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListChartAccountsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiChartAccount[];
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

interface ChartAccountResponse {
  success: boolean;
  message: string;
  data: ApiChartAccount;
}

@Injectable()
export class HttpChartAccountRepository implements ChartAccountRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<ChartAccountPage> {
    return this.http
      .get<ListChartAccountsResponse>(`${this.apiBaseUrl}/accounting/chart-accounts`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapChartAccount(item)),
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

  getById(id: number): Observable<ChartAccount> {
    return this.http
      .get<ChartAccountResponse>(`${this.apiBaseUrl}/accounting/chart-accounts/${id}`)
      .pipe(map((response) => this.mapChartAccount(response.data)));
  }

  create(payload: ChartAccountPayload): Observable<ChartAccount> {
    return this.http
      .post<ChartAccountResponse>(
        `${this.apiBaseUrl}/accounting/chart-accounts`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapChartAccount(response.data)));
  }

  update(id: number, payload: ChartAccountPayload): Observable<ChartAccount> {
    return this.http
      .put<ChartAccountResponse>(
        `${this.apiBaseUrl}/accounting/chart-accounts/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapChartAccount(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/chart-accounts/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<ChartAccount> {
    return this.http
      .post<ChartAccountResponse>(
        `${this.apiBaseUrl}/accounting/chart-accounts/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapChartAccount(response.data)));
  }

  private mapChartAccount(item: ApiChartAccount): ChartAccount {
    return {
      id: item.id,
      code: item.code,
      name: item.name,
      description: item.description,
      accountingStandardId: item.accounting_standard_id,
      typesPlanId: item.types_plan_id,
      accountingStandard: this.mapReference(item.accounting_standard),
      typePlan: this.mapReference(item.type_plan),
      cecoPermission: item.ceco_permission,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(
    reference: ApiChartAccountReference | null
  ): ChartAccountReference | null {
    if (!reference) {
      return null;
    }

    return {
      id: reference.id,
      name: reference.name,
      code: reference.code
    };
  }

  private mapPayload(payload: ChartAccountPayload) {
    return {
      code: payload.code,
      name: payload.name,
      description: payload.description,
      accounting_standard_id: payload.accountingStandardId,
      types_plan_id: payload.typesPlanId,
      ceco_permission: payload.cecoPermission
    };
  }
}
