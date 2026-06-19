import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { MultiCatalogSelectOptions } from '../../domain/models/accounting-select-option.model';

export interface AccountingSelectOptionsQuery {
  search?: string;
  limit?: number;
  enrichedLabels?: boolean;
}

export interface AccountingSelectOptionsRepository {
  getMany(
    catalogs: string[],
    query?: AccountingSelectOptionsQuery
  ): Observable<MultiCatalogSelectOptions>;
}

export const ACCOUNTING_SELECT_OPTIONS_REPOSITORY =
  new InjectionToken<AccountingSelectOptionsRepository>(
    'ACCOUNTING_SELECT_OPTIONS_REPOSITORY'
  );
