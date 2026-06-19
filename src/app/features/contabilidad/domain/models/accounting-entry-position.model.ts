export interface AccountingEntryPositionReference {
  id: number;
  name: string;
  code?: string | null;
  label?: string | null;
  account?: string | null;
}

export type AccountingEntryIndicator = 'Debito' | 'Credito';

export interface AccountingEntryPosition {
  id: number;
  businessStructureId: number;
  businessStructure: AccountingEntryPositionReference | null;
  accountingDocumentId: number;
  accountingDocument: AccountingEntryPositionReference | null;
  accountingEntryHeaderId: number;
  accountingEntryHeader: AccountingEntryPositionReference | null;
  accountingAccountsId: number;
  accountingAccount: AccountingEntryPositionReference | null;
  idTercero: number | null;
  indicatorDc: AccountingEntryIndicator | null;
  amount: number;
  coinId: number;
  coin: AccountingEntryPositionReference | null;
  costCenterId: number | null;
  costCenter: AccountingEntryPositionReference | null;
  positionText: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AccountingEntryPositionPayload {
  businessStructureId: number;
  accountingDocumentId: number;
  accountingEntryHeaderId: number;
  accountingAccountsId: number;
  idTercero: number | null;
  indicatorDc: AccountingEntryIndicator | null;
  amount: number;
  coinId: number;
  costCenterId: number | null;
  positionText: string | null;
}

export interface AccountingEntryPositionPage {
  items: AccountingEntryPosition[];
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
