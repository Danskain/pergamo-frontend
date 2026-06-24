import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ReferenceRepository } from '../../application/ports/reference.repository';
import { Reference, ReferencePage, ReferencePayload } from '../../domain/models/reference.model';

interface ApiReference {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListReferencesResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiReference[];
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

interface ReferenceResponse {
  success: boolean;
  message: string;
  data: ApiReference;
}

@Injectable()
export class HttpReferenceRepository implements ReferenceRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  list(page: number, perPage: number): Observable<ReferencePage> {
    return this.http
      .get<ListReferencesResponse>(`${this.apiBaseUrl}/accounting/references`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapReference(item)),
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

  getById(id: number): Observable<Reference> {
    return this.http
      .get<ReferenceResponse>(`${this.apiBaseUrl}/accounting/references/${id}`)
      .pipe(map((response) => this.mapReference(response.data)));
  }

  create(payload: ReferencePayload): Observable<Reference> {
    return this.http
      .post<ReferenceResponse>(`${this.apiBaseUrl}/accounting/references`, this.mapPayload(payload))
      .pipe(map((response) => this.mapReference(response.data)));
  }

  update(id: number, payload: ReferencePayload): Observable<Reference> {
    return this.http
      .put<ReferenceResponse>(`${this.apiBaseUrl}/accounting/references/${id}`, this.mapPayload(payload))
      .pipe(map((response) => this.mapReference(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/references/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<Reference> {
    return this.http
      .post<ReferenceResponse>(`${this.apiBaseUrl}/accounting/references/${id}/restore`, {})
      .pipe(map((response) => this.mapReference(response.data)));
  }

  private mapReference(item: ApiReference): Reference {
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

  private mapPayload(payload: ReferencePayload) {
    return {
      name: payload.name,
      code: payload.code,
      description: payload.description
    };
  }
}
