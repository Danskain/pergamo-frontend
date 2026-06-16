import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AccountingSummary } from '../../domain/models/accounting-summary.model';
import { AccountingSummaryRepository } from '../../application/ports/accounting-summary.repository';

@Injectable()
export class MockAccountingSummaryRepository implements AccountingSummaryRepository {
  getSummary(): Observable<AccountingSummary> {
    return of({
      period: 'Junio 2026',
      metrics: [
        {
          label: 'Ingresos conciliados',
          value: '$ 148.500.000',
          trend: 'up'
        },
        {
          label: 'Egresos del periodo',
          value: '$ 81.220.000',
          trend: 'stable'
        },
        {
          label: 'Movimientos pendientes',
          value: '12',
          trend: 'down'
        }
      ],
      recentMovements: [
        {
          id: 'mov-001',
          concept: 'Pago proveedores',
          account: '220505',
          amount: 18450000,
          status: 'posted',
          registeredAt: '2026-06-12'
        },
        {
          id: 'mov-002',
          concept: 'Recaudo cartera',
          account: '130505',
          amount: 26780000,
          status: 'posted',
          registeredAt: '2026-06-13'
        },
        {
          id: 'mov-003',
          concept: 'Nomina administrativa',
          account: '510506',
          amount: 12400000,
          status: 'pending',
          registeredAt: '2026-06-14'
        }
      ]
    });
  }
}
