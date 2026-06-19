import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { PergamoModuleRepository } from '../../application/ports/pergamo-module.repository';
import {
  PergamoModule,
  PergamoModulePage,
  PergamoModulePayload
} from '../../domain/models/pergamo-module.model';

interface ApiPergamoModule {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListPergamoModulesResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiPergamoModule[];
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

interface PergamoModuleResponse {
  success: boolean;
  message: string;
  data: ApiPergamoModule;
}

@Injectable()
export class HttpPergamoModuleRepository implements PergamoModuleRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<PergamoModulePage> {
    return this.http
      .get<ListPergamoModulesResponse>(`${this.apiBaseUrl}/accounting/modules`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapPergamoModule(item)),
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

  getById(id: number): Observable<PergamoModule> {
    return this.http
      .get<PergamoModuleResponse>(`${this.apiBaseUrl}/accounting/modules/${id}`)
      .pipe(map((response) => this.mapPergamoModule(response.data)));
  }

  create(payload: PergamoModulePayload): Observable<PergamoModule> {
    return this.http
      .post<PergamoModuleResponse>(
        `${this.apiBaseUrl}/accounting/modules`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapPergamoModule(response.data)));
  }

  update(id: number, payload: PergamoModulePayload): Observable<PergamoModule> {
    return this.http
      .put<PergamoModuleResponse>(
        `${this.apiBaseUrl}/accounting/modules/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapPergamoModule(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/modules/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<PergamoModule> {
    return this.http
      .post<PergamoModuleResponse>(`${this.apiBaseUrl}/accounting/modules/${id}/restore`, {})
      .pipe(map((response) => this.mapPergamoModule(response.data)));
  }

  private mapPergamoModule(item: ApiPergamoModule): PergamoModule {
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

  private mapPayload(payload: PergamoModulePayload) {
    return {
      name: payload.name,
      code: payload.code,
      description: payload.description
    };
  }
}
