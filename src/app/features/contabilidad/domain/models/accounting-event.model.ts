export interface AccountingEventReference {
  id: number;
  name: string;
  code?: string | null;
  label?: string | null;
}

export interface AccountingEvent {
  id: number;
  code: string;
  name: string;
  accountingMomentId: number;
  accountingMoment: AccountingEventReference | null;
  origin: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AccountingEventPayload {
  code: string;
  name: string;
  accountingMomentId: number;
  origin: string;
}

export interface AccountingEventPage {
  items: AccountingEvent[];
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
