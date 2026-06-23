export interface AccountingMoment {
  id: number;
  name: string;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AccountingMomentPayload {
  name: string;
  code: string;
  description: string;
}

export interface AccountingMomentPage {
  items: AccountingMoment[];
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
