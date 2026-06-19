export interface BusinessStructureReference {
  id: number;
  name: string;
  code?: string | null;
}

export interface BusinessStructure {
  id: number;
  countryId: number;
  country: BusinessStructureReference | null;
  coinId: number;
  coin: BusinessStructureReference | null;
  enterpriseId: number;
  enterprise: BusinessStructureReference | null;
  exerciseVariationId: number;
  exerciseVariation: BusinessStructureReference | null;
  chartAccountId: number;
  chartAccount: BusinessStructureReference | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BusinessStructurePayload {
  countryId: number;
  coinId: number;
  enterpriseId: number;
  exerciseVariationId: number;
  chartAccountId: number;
}

export interface BusinessStructurePage {
  items: BusinessStructure[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    currentPage: number;
    from: number | null;
    lastPage: number;
    path: string;
    perPage: number;
    to: number | null;
    total: number;
  };
}
