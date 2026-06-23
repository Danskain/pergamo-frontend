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
  NbSelectModule,
  NbSortDirection,
  NbSortRequest,
  NbToastrService,
  NbToggleModule,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbTreeGridModule
} from '@nebular/theme';

import { CreateKeyOperationUseCase } from '../../../application/use-cases/create-key-operation.use-case';
import { DeleteKeyOperationUseCase } from '../../../application/use-cases/delete-key-operation.use-case';
import { GetKeyOperationDetailUseCase } from '../../../application/use-cases/get-key-operation-detail.use-case';
import { ListKeyOperationsUseCase } from '../../../application/use-cases/list-key-operations.use-case';
import { RestoreKeyOperationUseCase } from '../../../application/use-cases/restore-key-operation.use-case';
import { UpdateKeyOperationUseCase } from '../../../application/use-cases/update-key-operation.use-case';
import { SelectOption } from '../../../domain/models/accounting-select-option.model';
import { KeyOperation, KeyOperationPage, KeyOperationPayload } from '../../../domain/models/key-operation.model';
import { injectAccountingCatalogOptions } from '../../form-support/inject-accounting-catalog-options';
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

type KeyOperationGridRow = {
  id: number;
  code: string;
  name: string;
  moduleName: string;
  accountingNatureName: string;
  affectsTaxes: boolean;
  createdAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-clave-operacion-page',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbToggleModule,
    NbTreeGridModule,
    CrudCollectionShellComponent,
    CrudPageHeroComponent,
    CrudSectionCardComponent
  ],
  templateUrl: './clave-operacion-page.component.html',
  styleUrl: './clave-operacion-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaveOperacionPageComponent {
  private static readonly FORM_CATALOGS = ['modules', 'accounting_nature'];

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
  ) as NbTreeGridDataSourceBuilder<KeyOperationGridRow>;
  private readonly listKeyOperationsUseCase = inject(ListKeyOperationsUseCase);
  private readonly getKeyOperationDetailUseCase = inject(GetKeyOperationDetailUseCase);
  private readonly createKeyOperationUseCase = inject(CreateKeyOperationUseCase);
  private readonly updateKeyOperationUseCase = inject(UpdateKeyOperationUseCase);
  private readonly deleteKeyOperationUseCase = inject(DeleteKeyOperationUseCase);
  private readonly restoreKeyOperationUseCase = inject(RestoreKeyOperationUseCase);
  private readonly accountingCatalogOptions = injectAccountingCatalogOptions(
    ClaveOperacionPageComponent.FORM_CATALOGS,
    {
      limit: 100,
      enrichedLabels: true
    }
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
  protected readonly treeGridColumns = [
    'id',
    'code',
    'moduleName',
    'accountingNatureName',
    'affectsTaxes',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<NbTreeGridDataSource<KeyOperationGridRow>>(
    this.treeGridDataSourceBuilder.create([] as TreeNode<KeyOperationGridRow>[])
  );

  protected readonly form = this.formBuilder.group({
    code: ['', [Validators.required, Validators.maxLength(255)]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    moduleId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingNatureId: [null as number | null, [Validators.required, Validators.min(1)]],
    affectsTaxes: [false, [Validators.required]]
  });

  protected readonly keyOperationsResource = rxResource<
    KeyOperationPage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) => this.listKeyOperationsUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedKeyOperationResource = rxResource<
    KeyOperation | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) => (params.id ? this.getKeyOperationDetailUseCase.execute(params.id) : of(null)),
    defaultValue: null
  });
  protected readonly selectOptionsResource = this.accountingCatalogOptions.resource;

  protected readonly keyOperationPage = computed<KeyOperationPage | null>(
    () => this.keyOperationsResource.value() ?? null
  );
  protected readonly keyOperations = computed<KeyOperation[]>(() => this.keyOperationPage()?.items ?? []);
  protected readonly pagination = computed(() => {
    const page = this.keyOperationPage();

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
  protected readonly moduleOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('modules');
  protected readonly accountingNatureOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('accounting_nature');
  protected readonly isEditing = computed(() => this.editingId() !== null);
  protected readonly formTitle = computed(() =>
    this.isEditing() ? 'Editar clave operacion' : 'Nueva clave operacion'
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
      const keyOperation = this.selectedKeyOperationResource.value();

      if (!keyOperation) {
        return;
      }

      this.patchForm(keyOperation);
    });

    effect(() => {
      const nodes = this.keyOperations().map((keyOperation) =>
        this.mapKeyOperationToTreeNode(keyOperation)
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

  protected editKeyOperation(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa de la clave operacion seleccionada.'
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
        'Revisa los campos obligatorios antes de guardar la clave operacion.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(this.updateKeyOperationUseCase.execute(this.editingId()!, payload));
        this.showToast(
          'success',
          'Registro actualizado',
          'La clave operacion se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createKeyOperationUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'La clave operacion se creo correctamente.'
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

  protected async deleteKeyOperation(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar esta clave operacion? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteKeyOperationUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'La clave operacion fue eliminada correctamente.'
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

  protected async restoreKeyOperation(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar esta clave operacion eliminada?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreKeyOperationUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'La clave operacion fue restaurada correctamente.'
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
    this.accountingCatalogOptions.refresh();
    this.showToast(
      'info',
      'Datos actualizados',
      'Se recargo la informacion de claves operacion y catalogos desde la API.'
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

  private patchForm(keyOperation: KeyOperation): void {
    this.form.reset({
      code: keyOperation.code,
      name: keyOperation.name,
      moduleId: keyOperation.moduleId,
      accountingNatureId: keyOperation.accountingNatureId,
      affectsTaxes: keyOperation.affectsTaxes
    });
  }

  private resetForm(): void {
    this.form.reset({
      code: '',
      name: '',
      moduleId: null,
      accountingNatureId: null,
      affectsTaxes: false
    });
  }

  private buildPayload(): KeyOperationPayload {
    const value = this.form.getRawValue();

    return {
      code: value.code?.trim() ?? '',
      name: value.name?.trim() ?? '',
      moduleId: value.moduleId ?? 0,
      accountingNatureId: value.accountingNatureId ?? 0,
      affectsTaxes: value.affectsTaxes ?? false
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

  private mapKeyOperationToTreeNode(keyOperation: KeyOperation): TreeNode<KeyOperationGridRow> {
    return {
      data: {
        id: keyOperation.id,
        code: keyOperation.code,
        name: keyOperation.name,
        moduleName: keyOperation.module?.label ?? keyOperation.module?.name ?? `Id ${keyOperation.moduleId}`,
        accountingNatureName:
          keyOperation.accountingNature?.label ??
          keyOperation.accountingNature?.name ??
          `Id ${keyOperation.accountingNatureId}`,
        affectsTaxes: keyOperation.affectsTaxes,
        createdAt: keyOperation.createdAt,
        deletedAt: keyOperation.deletedAt
      }
    };
  }
}
