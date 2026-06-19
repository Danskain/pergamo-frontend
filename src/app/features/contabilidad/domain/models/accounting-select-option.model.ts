export interface SelectOption<TMeta = Record<string, unknown>> {
  value: string | number;
  label: string;
  meta: TMeta;
}

export interface BasicCatalogMeta {
  id: number;
  code?: string;
  name?: string;
  description?: string;
}

export type MultiCatalogSelectOptions<TMeta = Record<string, unknown>> = Record<
  string,
  Array<SelectOption<TMeta>>
>;
