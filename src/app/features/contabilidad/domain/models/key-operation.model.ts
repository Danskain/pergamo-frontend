export interface KeyOperationReference {
  id: number;
  name: string;
  code?: string | null;
  label?: string | null;
}

export interface KeyOperation {
  id: number;
  code: string;
  name: string;
  moduleId: number;
  module: KeyOperationReference | null;
  accountingNatureId: number;
  accountingNature: KeyOperationReference | null;
  affectsTaxes: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface KeyOperationPayload {
  code: string;
  name: string;
  moduleId: number;
  accountingNatureId: number;
  affectsTaxes: boolean;
}

export interface KeyOperationPage {
  items: KeyOperation[];
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
