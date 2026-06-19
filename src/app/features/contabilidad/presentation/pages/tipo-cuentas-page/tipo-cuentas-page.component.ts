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

import { CreateTypeAccountUseCase } from '../../../application/use-cases/create-type-account.use-case';
import { DeleteTypeAccountUseCase } from '../../../application/use-cases/delete-type-account.use-case';
import { GetTypeAccountDetailUseCase } from '../../../application/use-cases/get-type-account-detail.use-case';
import { ListTypeAccountsUseCase } from '../../../application/use-cases/list-type-accounts.use-case';
import { RestoreTypeAccountUseCase } from '../../../application/use-cases/restore-type-account.use-case';
import { UpdateTypeAccountUseCase } from '../../../application/use-cases/update-type-account.use-case';
import {
  TypeAccount,
  TypeAccountPage,
  TypeAccountPayload
} from '../../../domain/models/type-account.model';
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

type TypeAccountGridRow = {
  id: number;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-tipo-cuentas-page',
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
  templateUrl: './tipo-cuentas-page.component.html',
  styleUrl: './tipo-cuentas-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TipoCuentasPageComponent {
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
  ) as NbTreeGridDataSourceBuilder<TypeAccountGridRow>;
  private readonly listTypeAccountsUseCase = inject(ListTypeAccountsUseCase);
  private readonly getTypeAccountDetailUseCase = inject(GetTypeAccountDetailUseCase);
  private readonly createTypeAccountUseCase = inject(CreateTypeAccountUseCase);
  private readonly updateTypeAccountUseCase = inject(UpdateTypeAccountUseCase);
  private readonly deleteTypeAccountUseCase = inject(DeleteTypeAccountUseCase);
  private readonly restoreTypeAccountUseCase = inject(RestoreTypeAccountUseCase);

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
    NbTreeGridDataSource<TypeAccountGridRow>
  >(this.treeGridDataSourceBuilder.create([] as TreeNode<TypeAccountGridRow>[]));

  protected readonly form = this.formBuilder.group({
    code: ['', [Validators.required, Validators.maxLength(255)]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required]]
  });

  protected readonly typeAccountsResource = rxResource<
    TypeAccountPage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) => this.listTypeAccountsUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedTypeAccountResource = rxResource<
    TypeAccount | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getTypeAccountDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });

  protected readonly typeAccountPage = computed<TypeAccountPage | null>(
    () => this.typeAccountsResource.value() ?? null
  );
  protected readonly typeAccounts = computed<TypeAccount[]>(
    () => this.typeAccountPage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.typeAccountPage();

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
    this.isEditing() ? 'Editar tipo de cuentas' : 'Nuevo tipo de cuentas'
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
  protected readonly canGoPrevious = computed(() => this.pagination().currentPage > 1);
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
      const typeAccount = this.selectedTypeAccountResource.value();

      if (!typeAccount) {
        return;
      }

      this.patchForm(typeAccount);
    });

    effect(() => {
      const nodes = this.typeAccounts().map((typeAccount) =>
        this.mapTypeAccountToTreeNode(typeAccount)
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

  protected editTypeAccount(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa del tipo de cuentas seleccionado.'
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
        'Revisa los campos obligatorios antes de guardar el tipo de cuentas.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(this.updateTypeAccountUseCase.execute(this.editingId()!, payload));
        this.showToast(
          'success',
          'Registro actualizado',
          'El tipo de cuentas se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createTypeAccountUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'El tipo de cuentas se creo correctamente.'
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

  protected async deleteTypeAccount(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar este tipo de cuentas? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteTypeAccountUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'El tipo de cuentas fue eliminado correctamente.'
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

  protected async restoreTypeAccount(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar este tipo de cuentas eliminado?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreTypeAccountUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'El tipo de cuentas fue restaurado correctamente.'
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
      'Se recargo la informacion de tipos de cuentas desde la API.'
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

  private patchForm(typeAccount: TypeAccount): void {
    this.form.reset({
      code: typeAccount.code,
      name: typeAccount.name,
      description: typeAccount.description
    });
  }

  private resetForm(): void {
    this.form.reset({
      code: '',
      name: '',
      description: ''
    });
  }

  private buildPayload(): TypeAccountPayload {
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

  private mapTypeAccountToTreeNode(typeAccount: TypeAccount): TreeNode<TypeAccountGridRow> {
    return {
      data: {
        id: typeAccount.id,
        code: typeAccount.code,
        name: typeAccount.name,
        description: typeAccount.description,
        createdAt: typeAccount.createdAt,
        updatedAt: typeAccount.updatedAt,
        deletedAt: typeAccount.deletedAt
      }
    };
  }
}
