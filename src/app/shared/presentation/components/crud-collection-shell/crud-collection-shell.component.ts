import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { NbButtonModule, NbIconModule, NbSelectModule } from '@nebular/theme';

@Component({
  selector: 'app-crud-collection-shell',
  imports: [NbButtonModule, NbIconModule, NbSelectModule],
  templateUrl: './crud-collection-shell.component.html',
  styleUrl: './crud-collection-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrudCollectionShellComponent {
  readonly hasItems = input(false);
  readonly pageSummary = input('');
  readonly currentPage = input(1);
  readonly lastPage = input(1);
  readonly canGoPrevious = input(false);
  readonly canGoNext = input(false);
  readonly perPage = input(10);
  readonly perPageOptions = input<number[]>([]);

  readonly previousPage = output<void>();
  readonly nextPage = output<void>();
  readonly perPageChange = output<number>();

  protected onPerPageChange(value: unknown): void {
    const nextValue = Number(value);

    if (!Number.isFinite(nextValue) || nextValue <= 0) {
      return;
    }

    this.perPageChange.emit(nextValue);
  }
}
