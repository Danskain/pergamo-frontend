export interface DocumentSourceReference {
  id: number;
  name: string;
  code?: string | null;
  label?: string | null;
}

export interface DocumentSource {
  id: number;
  businessStructureId: number;
  businessStructure: DocumentSourceReference | null;
  modulesId: number;
  moduleItem: DocumentSourceReference | null;
  documentSourceTypeId: number;
  documentSourceType: DocumentSourceReference | null;
  numberDocumentSource: string;
  documentDate: string;
  accountingDate: string;
  referenceId: number;
  reference: DocumentSourceReference | null;
  totalValue: number;
  coinId: number;
  coin: DocumentSourceReference | null;
  financialStatementId: number;
  financialStatement: DocumentSourceReference | null;
  accountingDocumentId: number;
  accountingDocument: DocumentSourceReference | null;
  exercise: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface DocumentSourcePayload {
  businessStructureId: number;
  modulesId: number;
  documentSourceTypeId: number;
  numberDocumentSource: string;
  documentDate: string;
  accountingDate: string;
  referenceId: number;
  totalValue: number;
  coinId: number;
  financialStatementId: number;
  accountingDocumentId: number;
  exercise: number;
  description: string;
}

export interface DocumentSourcePage {
  items: DocumentSource[];
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
