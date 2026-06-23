import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AccountingEventRepository } from '../../application/ports/accounting-event.repository';
import {
  AccountingEvent,
  AccountingEventPage,
  AccountingEventPayload,
  AccountingEventReference
} from '../../domain/models/accounting-event.model';

interface ApiAccountingEventReference {
  id: number;
  name: string;
  code?: string | null;
  label?: string | null;
}

interface ApiAccountingEvent {
  id: number;
  code: string;
  name: string;
  accounting_moment_id: number;
  accounting_moment?: ApiAccountingEventReference | null;
  origin: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListAccountingEventsResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiAccountingEvent[];
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

interface AccountingEventResponse {
  success: boolean;
  message: string;
  data: ApiAccountingEvent;
}

@Injectable()
export class HttpAccountingEventRepository implements AccountingEventRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<AccountingEventPage> {
    return this.http
      .get<ListAccountingEventsResponse>(`${this.apiBaseUrl}/accounting/accounting-events`, {
        params: { page, per_page: perPage }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapAccountingEvent(item)),
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

  getById(id: number): Observable<AccountingEvent> {
    return this.http
      .get<AccountingEventResponse>(`${this.apiBaseUrl}/accounting/accounting-events/${id}`)
      .pipe(map((response) => this.mapAccountingEvent(response.data)));
  }

  create(payload: AccountingEventPayload): Observable<AccountingEvent> {
    return this.http
      .post<AccountingEventResponse>(
        `${this.apiBaseUrl}/accounting/accounting-events`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingEvent(response.data)));
  }

  update(id: number, payload: AccountingEventPayload): Observable<AccountingEvent> {
    return this.http
      .put<AccountingEventResponse>(
        `${this.apiBaseUrl}/accounting/accounting-events/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapAccountingEvent(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete(`${this.apiBaseUrl}/accounting/accounting-events/${id}`)
      .pipe(map(() => undefined));
  }

  restore(id: number): Observable<AccountingEvent> {
    return this.http
      .post<AccountingEventResponse>(
        `${this.apiBaseUrl}/accounting/accounting-events/${id}/restore`,
        {}
      )
      .pipe(map((response) => this.mapAccountingEvent(response.data)));
  }

  private mapAccountingEvent(item: ApiAccountingEvent): AccountingEvent {
    return {
      id: item.id,
      code: item.code,
      name: item.name,
      accountingMomentId: item.accounting_moment_id,
      accountingMoment: this.mapReference(item.accounting_moment ?? null),
      origin: item.origin,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(reference: ApiAccountingEventReference | null): AccountingEventReference | null {
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

  private mapPayload(payload: AccountingEventPayload) {
    return {
      code: payload.code,
      name: payload.name,
      accounting_moment_id: payload.accountingMomentId,
      origin: payload.origin
    };
  }
}
