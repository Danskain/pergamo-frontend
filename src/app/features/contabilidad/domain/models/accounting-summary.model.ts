export interface AccountingMetric {
  label: string;
  value: string;
  trend: 'up' | 'stable' | 'down';
}

export interface AccountingMovement {
  id: string;
  concept: string;
  account: string;
  amount: number;
  status: 'pending' | 'posted';
  registeredAt: string;
}

export interface AccountingSummary {
  period: string;
  metrics: AccountingMetric[];
  recentMovements: AccountingMovement[];
}
