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

import { CreateChartAccountUseCase } from '../../../application/use-cases/create-chart-account.use-case';
import { DeleteChartAccountUseCase } from '../../../application/use-cases/delete-chart-account.use-case';
import { GetChartAccountDetailUseCase } from '../../../application/use-cases/get-chart-account-detail.use-case';
import { ListChartAccountsUseCase } from '../../../application/use-cases/list-chart-accounts.use-case';
import { RestoreChartAccountUseCase } from '../../../application/use-cases/restore-chart-account.use-case';
import { UpdateChartAccountUseCase } from '../../../application/use-cases/update-chart-account.use-case';
import { SelectOption } from '../../../domain/models/accounting-select-option.model';
import { injectAccountingCatalogOptions } from '../../form-support/inject-accounting-catalog-options';
import {
  ChartAccount,
  ChartAccountPage,
  ChartAccountPayload
} from '../../../domain/models/chart-account.model';
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

type ChartAccountGridRow = {
  id: number;
  code: string;
  name: string;
  description: string;
  accountingStandardName: string;
  typePlanName: string;
  cecoPermission: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-plan-cuentas-page',
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
  templateUrl: './plan-cuentas-page.component.html',
  styleUrl: './plan-cuentas-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanCuentasPageComponent {
  private static readonly FORM_CATALOGS = ['accounting_standard', 'types_plans'];

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
  ) as NbTreeGridDataSourceBuilder<ChartAccountGridRow>;
  private readonly listChartAccountsUseCase = inject(ListChartAccountsUseCase);
  private readonly getChartAccountDetailUseCase = inject(GetChartAccountDetailUseCase);
  private readonly createChartAccountUseCase = inject(CreateChartAccountUseCase);
  private readonly updateChartAccountUseCase = inject(UpdateChartAccountUseCase);
  private readonly deleteChartAccountUseCase = inject(DeleteChartAccountUseCase);
  private readonly restoreChartAccountUseCase = inject(RestoreChartAccountUseCase);
  private readonly accountingCatalogOptions = injectAccountingCatalogOptions(
    PlanCuentasPageComponent.FORM_CATALOGS,
    {
      limit: 100
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
    'description',
    'accountingStandardName',
    'typePlanName',
    'cecoPermission',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<
    NbTreeGridDataSource<ChartAccountGridRow>
  >(this.treeGridDataSourceBuilder.create([] as TreeNode<ChartAccountGridRow>[]));

  protected readonly form = this.formBuilder.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    accountingStandardId: [null as number | null, [Validators.required, Validators.min(1)]],
    typesPlanId: [null as number | null, [Validators.required, Validators.min(1)]],
    cecoPermission: [false]
  });

  protected readonly chartAccountsResource = rxResource<
    ChartAccountPage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) =>
      this.listChartAccountsUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedChartAccountResource = rxResource<
    ChartAccount | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getChartAccountDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });
  protected readonly selectOptionsResource = this.accountingCatalogOptions.resource;

  protected readonly chartAccountPage = computed<ChartAccountPage | null>(
    () => this.chartAccountsResource.value() ?? null
  );
  protected readonly chartAccounts = computed<ChartAccount[]>(
    () => this.chartAccountPage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.chartAccountPage();

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
  protected readonly accountingStandardOptions: () => Array<
    SelectOption<Record<string, unknown>>
  > = this.accountingCatalogOptions.optionsFor('accounting_standard');
  protected readonly typesPlanOptions: () => Array<
    SelectOption<Record<string, unknown>>
  > = this.accountingCatalogOptions.optionsFor('types_plans');
  protected readonly formTitle = computed(() =>
    this.isEditing() ? 'Editar plan de cuentas' : 'Nuevo plan de cuentas'
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
      const chartAccount = this.selectedChartAccountResource.value();

      if (!chartAccount) {
        return;
      }

      this.patchForm(chartAccount);
    });

    effect(() => {
      const nodes = this.chartAccounts().map((chartAccount) =>
        this.mapChartAccountToTreeNode(chartAccount)
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

  protected editChartAccount(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa del plan de cuentas seleccionado.'
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
        'Revisa los campos obligatorios antes de guardar el plan de cuentas.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(
          this.updateChartAccountUseCase.execute(this.editingId()!, payload)
        );
        this.showToast(
          'success',
          'Registro actualizado',
          'El plan de cuentas se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createChartAccountUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'El plan de cuentas se creo correctamente.'
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

  protected async deleteChartAccount(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar este plan de cuentas? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteChartAccountUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'El plan de cuentas fue eliminado correctamente.'
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

  protected async restoreChartAccount(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas restaurar este plan de cuentas eliminado?'
    );

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreChartAccountUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'El plan de cuentas fue restaurado correctamente.'
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
      'Se recargo la informacion de planes de cuentas desde la API.'
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

  private patchForm(chartAccount: ChartAccount): void {
    this.form.reset({
      code: chartAccount.code,
      name: chartAccount.name,
      description: chartAccount.description,
      accountingStandardId: chartAccount.accountingStandardId,
      typesPlanId: chartAccount.typesPlanId,
      cecoPermission: chartAccount.cecoPermission
    });
  }

  private resetForm(): void {
    this.form.reset({
      code: '',
      name: '',
      description: '',
      accountingStandardId: null,
      typesPlanId: null,
      cecoPermission: false
    });
  }

  private buildPayload(): ChartAccountPayload {
    const value = this.form.getRawValue();

    return {
      code: value.code?.trim() ?? '',
      name: value.name?.trim() ?? '',
      description: value.description?.trim() ?? '',
      accountingStandardId: value.accountingStandardId ?? 0,
      typesPlanId: value.typesPlanId ?? 0,
      cecoPermission: value.cecoPermission ?? false
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

  private mapChartAccountToTreeNode(
    chartAccount: ChartAccount
  ): TreeNode<ChartAccountGridRow> {
    return {
      data: {
        id: chartAccount.id,
        code: chartAccount.code,
        name: chartAccount.name,
        description: chartAccount.description,
        accountingStandardName:
          chartAccount.accountingStandard?.name ??
          `Id ${chartAccount.accountingStandardId}`,
        typePlanName: chartAccount.typePlan?.name ?? `Id ${chartAccount.typesPlanId}`,
        cecoPermission: chartAccount.cecoPermission,
        createdAt: chartAccount.createdAt,
        updatedAt: chartAccount.updatedAt,
        deletedAt: chartAccount.deletedAt
      }
    };
  }
}
