export interface CostCenterReference {
  id: number;
  name: string;
  code?: string | null;
  label?: string | null;
}

export interface CostCenter {
  id: number;
  businessStructureId: number;
  businessStructure: CostCenterReference | null;
  campusId: number;
  campus: CostCenterReference | null;
  code: string;
  name: string;
  description: string;
  costCenterTypeId: number;
  costCenterType: CostCenterReference | null;
  costCenterClassId: number;
  costCenterClass: CostCenterReference | null;
  costCenterNatureId: number;
  costCenterNature: CostCenterReference | null;
  allowsAllocation: boolean;
  distributesCosts: boolean;
  functionalUnit: boolean;
  profitCenter: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CostCenterPayload {
  businessStructureId: number;
  campusId: number;
  code: string;
  name: string;
  description: string;
  costCenterTypeId: number;
  costCenterClassId: number;
  costCenterNatureId: number;
  allowsAllocation: boolean;
  distributesCosts: boolean;
  functionalUnit: boolean;
  profitCenter: boolean;
}

export interface CostCenterPage {
  items: CostCenter[];
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
