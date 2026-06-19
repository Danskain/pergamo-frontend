export interface AccountingEntryHeaderReference {
  id: number;
  name: string;
  code?: string | null;
  label?: string | null;
}

export interface AccountingEntryHeader {
  id: number;
  businessStructureId: number;
  businessStructure: AccountingEntryHeaderReference | null;
  accountingDocumentId: number;
  accountingDocument: AccountingEntryHeaderReference | null;
  accountingPeriod: number;
  coinId: number;
  coin: AccountingEntryHeaderReference | null;
  description: string;
  totalDebits: number;
  totalCredits: number;
  referenceDocument: string;
  documentsSourceId: number;
  documentSource: AccountingEntryHeaderReference | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AccountingEntryHeaderPayload {
  businessStructureId: number;
  accountingDocumentId: number;
  accountingPeriod: number;
  coinId: number;
  description: string;
  totalDebits: number;
  totalCredits: number;
  referenceDocument: string;
  documentsSourceId: number;
}

export interface AccountingEntryHeaderPage {
  items: AccountingEntryHeader[];
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
