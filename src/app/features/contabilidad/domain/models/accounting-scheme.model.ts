export interface AccountingSchemeReference {
  id: number;
  name: string;
  code?: string | null;
  label?: string | null;
}

export interface AccountingScheme {
  id: number;
  businessStructureId: number;
  businessStructure: AccountingSchemeReference | null;
  chartAccountId: number;
  chartAccount: AccountingSchemeReference | null;
  assessmentClass: string;
  typeMovementId: number;
  typeMovement: AccountingSchemeReference | null;
  accountingEventId: number;
  accountingEvent: AccountingSchemeReference | null;
  keyOperationId: number;
  keyOperation: AccountingSchemeReference | null;
  accountingAccountId: number;
  accountingAccount: AccountingSchemeReference | null;
  accountingNatureId: number;
  accountingNature: AccountingSchemeReference | null;
  requireCoce: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AccountingSchemePayload {
  businessStructureId: number;
  chartAccountId: number;
  assessmentClass: string;
  typeMovementId: number;
  accountingEventId: number;
  keyOperationId: number;
  accountingAccountId: number;
  accountingNatureId: number;
  requireCoce: boolean;
}

export interface AccountingSchemePage {
  items: AccountingScheme[];
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
