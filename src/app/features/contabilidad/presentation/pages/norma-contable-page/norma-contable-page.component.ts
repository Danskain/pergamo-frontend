import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom, of } from 'rxjs';
import {
  NbButtonModule,
  NbIconModule,
  NbInputModule,
  NbSortDirection,
  NbSortRequest,
  NbToastrService,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbTreeGridModule
} from '@nebular/theme';

import { CreateAccountingStandardUseCase } from '../../../application/use-cases/create-accounting-standard.use-case';
import { DeleteAccountingStandardUseCase } from '../../../application/use-cases/delete-accounting-standard.use-case';
import { GetAccountingStandardDetailUseCase } from '../../../application/use-cases/get-accounting-standard-detail.use-case';
import { ListAccountingStandardsUseCase } from '../../../application/use-cases/list-accounting-standards.use-case';
import { RestoreAccountingStandardUseCase } from '../../../application/use-cases/restore-accounting-standard.use-case';
import { UpdateAccountingStandardUseCase } from '../../../application/use-cases/update-accounting-standard.use-case';
import {
  AccountingStandard,
  AccountingStandardPage,
  AccountingStandardPayload
} from '../../../domain/models/accounting-standard.model';
import { CrudCollectionShellComponent } from '../../../../../shared/presentation/components/crud-collection-shell/crud-collection-shell.component';
import { applyCrudColumnPolicy } from '../../../../../shared/presentation/components/crud-column-policy';
import { CrudPageHeroComponent } from '../../../../../shared/presentation/components/crud-page-hero/crud-page-hero.component';
import { CrudSectionCardComponent } from '../../../../../shared/presentation/components/crud-section-card/crud-section-card.component';

type FeedbackStatus = 'success' | 'danger' | 'info';

type TreeNode<T> = {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
};

type AccountingStandardGridRow = {
  id: number;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-norma-contable-page',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbTreeGridModule,
    CrudCollectionShellComponent,
    CrudPageHeroComponent,
    CrudSectionCardComponent
  ],
  templateUrl: './norma-contable-page.component.html',
  styleUrl: './norma-contable-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NormaContablePageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastrService = inject(NbToastrService) as {
    show: (
      message: string,
      title: string,
      config: {
        status: FeedbackStatus;
        duration: number;
        destroyByClick: boolean;
        hasIcon: boolean;
      }
    ) => void;
  };
  private readonly treeGridDataSourceBuilder = inject(
    NbTreeGridDataSourceBuilder
  ) as NbTreeGridDataSourceBuilder<AccountingStandardGridRow>;
  private readonly listAccountingStandardsUseCase = inject(ListAccountingStandardsUseCase);
  private readonly getAccountingStandardDetailUseCase = inject(
    GetAccountingStandardDetailUseCase
  );
  private readonly createAccountingStandardUseCase = inject(
    CreateAccountingStandardUseCase
  );
  private readonly updateAccountingStandardUseCase = inject(
    UpdateAccountingStandardUseCase
  );
  private readonly deleteAccountingStandardUseCase = inject(
    DeleteAccountingStandardUseCase
  );
  private readonly restoreAccountingStandardUseCase = inject(
    RestoreAccountingStandardUseCase
  );

  private readonly refreshTick = signal(0);
  private readonly detailRefreshTick = signal(0);
  protected readonly page = signal(1);
  protected readonly perPage = signal(28);
  protected readonly editingId = signal<number | null>(null);
  protected readonly showForm = signal(false);
  protected readonly submitting = signal(false);
  protected readonly deletingId = signal<number | null>(null);
  protected readonly restoringId = signal<number | null>(null);
  protected readonly sortDirection = signal<NbSortDirection>(NbSortDirection.NONE);
  protected readonly sortColumn = signal('');
  protected readonly treeGridCustomColumn = 'name';
  protected readonly treeGridColumns = ['id', 'code', 'description', 'createdAt', 'actions'];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<
    NbTreeGridDataSource<AccountingStandardGridRow>
  >(this.treeGridDataSourceBuilder.create([] as TreeNode<AccountingStandardGridRow>[]));

  protected readonly form = this.formBuilder.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.maxLength(255)]]
  });

  protected readonly accountingStandardsResource = rxResource<
    AccountingStandardPage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) =>
      this.listAccountingStandardsUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedAccountingStandardResource = rxResource<
    AccountingStandard | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getAccountingStandardDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });

  protected readonly accountingStandardPage = computed<AccountingStandardPage | null>(
    () => this.accountingStandardsResource.value() ?? null
  );
  protected readonly accountingStandards = computed<AccountingStandard[]>(
    () => this.accountingStandardPage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.accountingStandardPage();

    return (
      page?.meta ?? {
        currentPage: 1,
        from: null,
        lastPage: 1,
        path: '',
        perPage: this.perPage(),
        to: null,
        total: 0
      }
    );
  });
  protected readonly isEditing = computed(() => this.editingId() !== null);
  protected readonly formTitle = computed(() =>
    this.isEditing() ? 'Editar norma contable' : 'Nueva norma contable'
  );
  protected readonly submitLabel = computed(() =>
    this.isEditing() ? 'Actualizar registro' : 'Crear registro'
  );
  protected readonly pageSummary = computed(() => {
    const pagination = this.pagination();

    if (pagination.total === 0) {
      return 'No hay registros para mostrar.';
    }

    return `Mostrando ${pagination.from ?? 0}-${pagination.to ?? 0} de ${pagination.total} registros`;
  });
  protected readonly canGoPrevious = computed(
    () => this.pagination().currentPage > 1
  );
  protected readonly canGoNext = computed(
    () => this.pagination().currentPage < this.pagination().lastPage
  );
  protected readonly perPageOptions = computed(() =>
    Array.from(new Set([10, 20, 28, 50, 100, this.pagination().perPage])).sort(
      (left, right) => left - right
    )
  );

  constructor() {
    effect(() => {
      const accountingStandard = this.selectedAccountingStandardResource.value();

      if (!accountingStandard) {
        return;
      }

      this.patchForm(accountingStandard);
    });

    effect(() => {
      const nodes = this.accountingStandards().map((accountingStandard) =>
        this.mapAccountingStandardToTreeNode(accountingStandard)
      );
      this.treeGridDataSource.set(this.treeGridDataSourceBuilder.create(nodes));
    });
  }

  protected startCreate(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.detailRefreshTick.set(0);
    this.resetForm();
  }

  protected editAccountingStandard(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa de la norma contable seleccionada.'
    );
    this.editingId.set(id);
    this.detailRefreshTick.update((value) => value + 1);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showToast(
        'danger',
        'Formulario incompleto',
        'Revisa los campos obligatorios antes de guardar la norma contable.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(
          this.updateAccountingStandardUseCase.execute(this.editingId()!, payload)
        );
        this.showToast(
          'success',
          'Registro actualizado',
          'La norma contable se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createAccountingStandardUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'La norma contable se creo correctamente.'
        );
      }

      this.reloadList();
      this.closeForm();
    } catch (error) {
      this.showToast(
        'danger',
        'No fue posible guardar',
        this.extractErrorMessage(error)
      );
    } finally {
      this.submitting.set(false);
    }
  }

  protected async deleteAccountingStandard(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar esta norma contable? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteAccountingStandardUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'La norma contable fue eliminada correctamente.'
      );

      if (this.editingId() === id) {
        this.closeForm();
      }

      this.reloadList();
    } catch (error) {
      this.showToast(
        'danger',
        'No fue posible eliminar',
        this.extractErrorMessage(error)
      );
    } finally {
      this.deletingId.set(null);
    }
  }

  protected async restoreAccountingStandard(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar esta norma contable eliminada?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreAccountingStandardUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'La norma contable fue restaurada correctamente.'
      );
      this.reloadList();
    } catch (error) {
      this.showToast(
        'danger',
        'No fue posible restaurar',
        this.extractErrorMessage(error)
      );
    } finally {
      this.restoringId.set(null);
    }
  }

  protected refreshData(): void {
    this.reloadList();
    this.showToast(
      'info',
      'Datos actualizados',
      'Se recargo la informacion de normas contables desde la API.'
    );
  }

  protected changeSort(sortRequest: NbSortRequest): void {
    this.sortColumn.set(sortRequest.column);
    this.sortDirection.set(sortRequest.direction);
  }

  protected getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn() === column) {
      return this.sortDirection();
    }

    return NbSortDirection.NONE;
  }

  protected goToPreviousPage(): void {
    if (!this.canGoPrevious()) {
      return;
    }

    this.page.update((value) => value - 1);
  }

  protected goToNextPage(): void {
    if (!this.canGoNext()) {
      return;
    }

    this.page.update((value) => value + 1);
  }

  protected changePerPage(perPage: unknown): void {
    const nextPerPage = Number(perPage);

    if (
      !Number.isFinite(nextPerPage) ||
      nextPerPage <= 0 ||
      this.perPage() === nextPerPage
    ) {
      return;
    }

    this.perPage.set(nextPerPage);
    this.page.set(1);
  }

  protected closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.detailRefreshTick.set(0);
    this.resetForm();
  }

  private reloadList(): void {
    this.refreshTick.update((value) => value + 1);
  }

  private patchForm(accountingStandard: AccountingStandard): void {
    this.form.reset({
      code: accountingStandard.code,
      name: accountingStandard.name,
      description: accountingStandard.description
    });
  }

  private resetForm(): void {
    this.form.reset({
      code: '',
      name: '',
      description: ''
    });
  }

  private buildPayload(): AccountingStandardPayload {
    const value = this.form.getRawValue();

    return {
      code: value.code?.trim() ?? '',
      name: value.name?.trim() ?? '',
      description: value.description?.trim() ?? ''
    };
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage =
        (error.error?.message as string | undefined) ??
        (error.error?.error as string | undefined);

      return apiMessage ?? 'La API devolvio un error al procesar la solicitud.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Ocurrio un error inesperado.';
  }

  private showToast(status: FeedbackStatus, title: string, message: string): void {
    this.toastrService.show(message, title, {
      status,
      duration: 4000,
      destroyByClick: true,
      hasIcon: true
    });
  }

  private mapAccountingStandardToTreeNode(
    accountingStandard: AccountingStandard
  ): TreeNode<AccountingStandardGridRow> {
    return {
      data: {
        id: accountingStandard.id,
        code: accountingStandard.code,
        name: accountingStandard.name,
        description: accountingStandard.description,
        createdAt: accountingStandard.createdAt,
        updatedAt: accountingStandard.updatedAt,
        deletedAt: accountingStandard.deletedAt
      }
    };
  }
}
