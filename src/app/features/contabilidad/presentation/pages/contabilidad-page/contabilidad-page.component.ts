import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NbCardModule } from '@nebular/theme';

import { GetAccountingSummaryUseCase } from '../../../application/use-cases/get-accounting-summary.use-case';

@Component({
  selector: 'app-contabilidad-page',
  imports: [CurrencyPipe, DatePipe, NgClass, NbCardModule],
  templateUrl: './contabilidad-page.component.html',
  styleUrl: './contabilidad-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContabilidadPageComponent {
  private readonly getAccountingSummaryUseCase = inject(GetAccountingSummaryUseCase);

  protected readonly summary = toSignal(
    this.getAccountingSummaryUseCase.execute(),
    { initialValue: null }
  );

  protected readonly metrics = computed(() => this.summary()?.metrics ?? []);
  protected readonly recentMovements = computed(
    () => this.summary()?.recentMovements ?? []
  );
}
