export interface AccountClassReference {
  id: number;
  name: string;
  code?: string | null;
}

export interface AccountClass {
  id: number;
  name: string;
  description: string;
  accountingNatureId: number;
  accountingNature: AccountClassReference | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AccountClassPayload {
  name: string;
  accountingNatureId: number;
  description: string;
}

export interface AccountClassPage {
  items: AccountClass[];
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
