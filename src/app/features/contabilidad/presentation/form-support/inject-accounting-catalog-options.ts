import { computed, inject, signal, Signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AccountingSelectOptionsQuery } from '../../application/ports/accounting-select-options.repository';
import { GetAccountingSelectOptionsUseCase } from '../../application/use-cases/get-accounting-select-options.use-case';
import {
  MultiCatalogSelectOptions,
  SelectOption
} from '../../domain/models/accounting-select-option.model';

export function injectAccountingCatalogOptions(
  catalogs: string[],
  query?: AccountingSelectOptionsQuery
) {
  const getAccountingSelectOptionsUseCase = inject(GetAccountingSelectOptionsUseCase);
  const refreshTick = signal(0);
  const resource = rxResource<MultiCatalogSelectOptions, { refreshTick: number }>({
    params: () => ({
      refreshTick: refreshTick()
    }),
    stream: () => getAccountingSelectOptionsUseCase.execute(catalogs, query),
    defaultValue: {}
  });

  return {
    resource,
    optionsFor(catalog: string): Signal<Array<SelectOption<Record<string, unknown>>>> {
      return computed(() => resource.value()[catalog] ?? []);
    },
    refresh(): void {
      refreshTick.update((value) => value + 1);
    }
  };
}
