export interface AccountingAccountReference {
  id: number;
  name: string;
  code?: string | null;
  account?: string | null;
}

export interface AccountingAccount {
  id: number;
  account: string;
  chartAccountId: number;
  chartAccount: AccountingAccountReference | null;
  name: string;
  accountClassId: number;
  accountClass: AccountingAccountReference | null;
  typesAccountId: number;
  typesAccount: AccountingAccountReference | null;
  accountingGroupId: number;
  accountingGroup: AccountingAccountReference | null;
  allowsManualTransactions: boolean;
  associatedAccount: boolean;
  acceptsTaxes: boolean;
  foreignCurrency: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AccountingAccountPayload {
  account: string;
  chartAccountId: number;
  name: string;
  accountClassId: number;
  typesAccountId: number;
  accountingGroupId: number;
  allowsManualTransactions: boolean;
  associatedAccount: boolean;
  acceptsTaxes: boolean;
  foreignCurrency: boolean;
}

export interface AccountingAccountPage {
  items: AccountingAccount[];
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
