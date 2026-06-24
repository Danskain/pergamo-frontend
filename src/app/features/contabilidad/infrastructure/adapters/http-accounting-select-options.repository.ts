import { HttpClient } from '@angular/common/http';
import { resolveApiBaseUrl } from '../api-base-url';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  AccountingSelectOptionsQuery,
  AccountingSelectOptionsRepository
} from '../../application/ports/accounting-select-options.repository';
import {
  MultiCatalogSelectOptions,
  SelectOption
} from '../../domain/models/accounting-select-option.model';

interface ApiSelectOption {
  value: string | number;
  label: string;
  meta: Record<string, unknown>;
}

interface SingleCatalogSelectResponse {
  success: true;
  message: string;
  data: ApiSelectOption[];
  meta: {
    catalogs: string[];
    enriched_labels: boolean;
  };
}

interface MultiCatalogSelectResponse {
  success: true;
  message: string;
  data: Record<string, ApiSelectOption[]>;
  meta: {
    catalogs: string[];
    enriched_labels: boolean;
  };
}

@Injectable()
export class HttpAccountingSelectOptionsRepository
  implements AccountingSelectOptionsRepository
{
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = resolveApiBaseUrl();

  getMany(
    catalogs: string[],
    query?: AccountingSelectOptionsQuery
  ): Observable<MultiCatalogSelectOptions> {
    const params = this.buildQueryParams(query);

    if (catalogs.length === 1) {
      const [catalog] = catalogs;

      return this.http
        .get<SingleCatalogSelectResponse>(
          `${this.apiBaseUrl}/accounting/select-options/${catalog}`,
          {
            params
          }
        )
        .pipe(
          map((response) => ({
            [catalog]: response.data.map((option) => this.mapOption(option))
          }))
        );
    }

    const multiCatalogParams: Record<string, string | number | boolean> = {
      ...params,
      catalogs: catalogs.join(',')
    };

    return this.http
      .get<MultiCatalogSelectResponse>(`${this.apiBaseUrl}/accounting/select-options`, {
        params: multiCatalogParams
      })
      .pipe(
        map((response) =>
          Object.fromEntries(
            Object.entries(response.data).map(([catalog, options]) => [
              catalog,
              options.map((option) => this.mapOption(option))
            ])
          )
        )
      );
  }

  private buildQueryParams(
    query?: AccountingSelectOptionsQuery
  ): Record<string, string | number | boolean> {
    const params: Record<string, string | number | boolean> = {};

    if (query?.search?.trim()) {
      params['search'] = query.search.trim();
    }

    if (query?.limit) {
      params['limit'] = query.limit;
    }

    if (query?.enrichedLabels !== undefined) {
      params['enriched_labels'] = query.enrichedLabels;
    }

    return params;
  }

  private mapOption(option: ApiSelectOption): SelectOption<Record<string, unknown>> {
    return {
      value: option.value,
      label: option.label,
      meta: option.meta
    };
  }
}
