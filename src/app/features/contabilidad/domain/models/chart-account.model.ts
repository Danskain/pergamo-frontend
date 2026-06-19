export interface ChartAccountReference {
  id: number;
  name: string;
  code: string;
}

export interface ChartAccount {
  id: number;
  code: string;
  name: string;
  description: string;
  accountingStandardId: number;
  typesPlanId: number;
  accountingStandard: ChartAccountReference | null;
  typePlan: ChartAccountReference | null;
  cecoPermission: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ChartAccountPayload {
  code: string;
  name: string;
  description: string;
  accountingStandardId: number;
  typesPlanId: number;
  cecoPermission: boolean;
}

export interface ChartAccountPage {
  items: ChartAccount[];
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
