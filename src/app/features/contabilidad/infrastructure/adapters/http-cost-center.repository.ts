import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { CostCenterRepository } from '../../application/ports/cost-center.repository';
import {
  CostCenter,
  CostCenterPage,
  CostCenterPayload,
  CostCenterReference
} from '../../domain/models/cost-center.model';

interface ApiCostCenterReference {
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

interface ApiCostCenter {
  id: number;
  business_structure_id: number;
  business_structure?: ApiCostCenterReference | null;
  campus_id: number;
  campus?: ApiCostCenterReference | null;
  code: string;
  name: string;
  description: string;
  cost_center_type_id: number;
  cost_center_type?: ApiCostCenterReference | null;
  cost_center_class_id: number;
  cost_center_class?: ApiCostCenterReference | null;
  cost_center_nature_id: number;
  cost_center_nature?: ApiCostCenterReference | null;
  allows_allocation: boolean | number;
  distributes_costs: boolean | number;
  functional_unit: boolean | number;
  profit_center: boolean | number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ListCostCentersResponse {
  status: boolean;
  message: string;
  data: {
    data: ApiCostCenter[];
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

interface CostCenterResponse {
  success: boolean;
  message: string;
  data: ApiCostCenter;
}

@Injectable()
export class HttpCostCenterRepository implements CostCenterRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api/v1';

  list(page: number, perPage: number): Observable<CostCenterPage> {
    return this.http
      .get<ListCostCentersResponse>(`${this.apiBaseUrl}/accounting/cost-centers`, {
        params: {
          page,
          per_page: perPage
        }
      })
      .pipe(
        map((response) => ({
          items: response.data.data.map((item) => this.mapCostCenter(item)),
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

  getById(id: number): Observable<CostCenter> {
    return this.http
      .get<CostCenterResponse>(`${this.apiBaseUrl}/accounting/cost-centers/${id}`)
      .pipe(map((response) => this.mapCostCenter(response.data)));
  }

  create(payload: CostCenterPayload): Observable<CostCenter> {
    return this.http
      .post<CostCenterResponse>(`${this.apiBaseUrl}/accounting/cost-centers`, this.mapPayload(payload))
      .pipe(map((response) => this.mapCostCenter(response.data)));
  }

  update(id: number, payload: CostCenterPayload): Observable<CostCenter> {
    return this.http
      .put<CostCenterResponse>(
        `${this.apiBaseUrl}/accounting/cost-centers/${id}`,
        this.mapPayload(payload)
      )
      .pipe(map((response) => this.mapCostCenter(response.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete(`${this.apiBaseUrl}/accounting/cost-centers/${id}`).pipe(
      map(() => undefined)
    );
  }

  restore(id: number): Observable<CostCenter> {
    return this.http
      .post<CostCenterResponse>(`${this.apiBaseUrl}/accounting/cost-centers/${id}/restore`, {})
      .pipe(map((response) => this.mapCostCenter(response.data)));
  }

  private mapCostCenter(item: ApiCostCenter): CostCenter {
    return {
      id: item.id,
      businessStructureId: item.business_structure_id,
      businessStructure: this.mapReference(item.business_structure),
      campusId: item.campus_id,
      campus: this.mapReference(item.campus),
      code: item.code,
      name: item.name,
      description: item.description,
      costCenterTypeId: item.cost_center_type_id,
      costCenterType: this.mapReference(item.cost_center_type),
      costCenterClassId: item.cost_center_class_id,
      costCenterClass: this.mapReference(item.cost_center_class),
      costCenterNatureId: item.cost_center_nature_id,
      costCenterNature: this.mapReference(item.cost_center_nature),
      allowsAllocation: Boolean(item.allows_allocation),
      distributesCosts: Boolean(item.distributes_costs),
      functionalUnit: Boolean(item.functional_unit),
      profitCenter: Boolean(item.profit_center),
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at
    };
  }

  private mapReference(item?: ApiCostCenterReference | null): CostCenterReference | null {
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

  private mapPayload(payload: CostCenterPayload) {
    return {
      business_structure_id: payload.businessStructureId,
      campus_id: payload.campusId,
      code: payload.code,
      name: payload.name,
      description: payload.description,
      cost_center_type_id: payload.costCenterTypeId,
      cost_center_class_id: payload.costCenterClassId,
      cost_center_nature_id: payload.costCenterNatureId,
      allows_allocation: payload.allowsAllocation,
      distributes_costs: payload.distributesCosts,
      functional_unit: payload.functionalUnit,
      profit_center: payload.profitCenter
    };
  }
}
