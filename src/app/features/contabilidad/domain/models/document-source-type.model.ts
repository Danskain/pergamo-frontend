export interface DocumentSourceType {
  id: number;
  name: string;
  code: string;
  description: string;
  generatesAccounting: boolean;
  manualEntry: boolean;
  requiresApproval: boolean;
  requiresThird: boolean;
  requiresCeco: boolean;
  affectsInventory: boolean;
  affectsCartera: boolean;
  affectsCxp: boolean;
  affectsTreasury: boolean;
  allowsReversal: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface DocumentSourceTypePayload {
  name: string;
  code: string;
  description: string;
  generatesAccounting: boolean;
  manualEntry: boolean;
  requiresApproval: boolean;
  requiresThird: boolean;
  requiresCeco: boolean;
  affectsInventory: boolean;
  affectsCartera: boolean;
  affectsCxp: boolean;
  affectsTreasury: boolean;
  allowsReversal: boolean;
}

export interface DocumentSourceTypePage {
  items: DocumentSourceType[];
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
