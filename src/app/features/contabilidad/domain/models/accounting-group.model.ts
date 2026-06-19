export interface AccountingGroupReference {
  id: number;
  name: string;
  code?: string | null;
}

export interface AccountingGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  accountClassId: number;
  accountClass: AccountingGroupReference | null;
  accountFrom: number;
  accountTo: number;
  affectsClosing: boolean;
  affectsFinancialStatements: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AccountingGroupPayload {
  code: string;
  accountClassId: number;
  name: string;
  description: string;
  accountFrom: number;
  accountTo: number;
  affectsClosing: boolean;
  affectsFinancialStatements: boolean;
}

export interface AccountingGroupPage {
  items: AccountingGroup[];
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
