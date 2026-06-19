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

import { CreateCostCenterUseCase } from '../../../application/use-cases/create-cost-center.use-case';
import { DeleteCostCenterUseCase } from '../../../application/use-cases/delete-cost-center.use-case';
import { GetCostCenterDetailUseCase } from '../../../application/use-cases/get-cost-center-detail.use-case';
import { ListCostCentersUseCase } from '../../../application/use-cases/list-cost-centers.use-case';
import { RestoreCostCenterUseCase } from '../../../application/use-cases/restore-cost-center.use-case';
import { UpdateCostCenterUseCase } from '../../../application/use-cases/update-cost-center.use-case';
import { SelectOption } from '../../../domain/models/accounting-select-option.model';
import { CostCenter, CostCenterPage, CostCenterPayload } from '../../../domain/models/cost-center.model';
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

type CostCenterGridRow = {
  id: number;
  code: string;
  name: string;
  businessStructureName: string;
  campusName: string;
  costCenterTypeName: string;
  costCenterClassName: string;
  costCenterNatureName: string;
  allowsAllocation: boolean;
  distributesCosts: boolean;
  functionalUnit: boolean;
  profitCenter: boolean;
  description: string;
  createdAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-centro-costo-page',
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
  templateUrl: './centro-costo-page.component.html',
  styleUrl: './centro-costo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CentroCostoPageComponent {
  private static readonly FORM_CATALOGS = [
    'business_structure',
    'campus',
    'cost_center_type',
    'cost_center_class',
    'cost_center_nature'
  ];

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
  ) as NbTreeGridDataSourceBuilder<CostCenterGridRow>;
  private readonly listCostCentersUseCase = inject(ListCostCentersUseCase);
  private readonly getCostCenterDetailUseCase = inject(GetCostCenterDetailUseCase);
  private readonly createCostCenterUseCase = inject(CreateCostCenterUseCase);
  private readonly updateCostCenterUseCase = inject(UpdateCostCenterUseCase);
  private readonly deleteCostCenterUseCase = inject(DeleteCostCenterUseCase);
  private readonly restoreCostCenterUseCase = inject(RestoreCostCenterUseCase);
  private readonly accountingCatalogOptions = injectAccountingCatalogOptions(
    CentroCostoPageComponent.FORM_CATALOGS,
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
    'businessStructureName',
    'campusName',
    'costCenterTypeName',
    'costCenterClassName',
    'costCenterNatureName',
    'allowsAllocation',
    'distributesCosts',
    'functionalUnit',
    'profitCenter',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<NbTreeGridDataSource<CostCenterGridRow>>(
    this.treeGridDataSourceBuilder.create([] as TreeNode<CostCenterGridRow>[])
  );

  protected readonly form = this.formBuilder.group({
    businessStructureId: [null as number | null, [Validators.required, Validators.min(1)]],
    campusId: [null as number | null, [Validators.required, Validators.min(1)]],
    code: ['', [Validators.required, Validators.maxLength(255)]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required]],
    costCenterTypeId: [null as number | null, [Validators.required, Validators.min(1)]],
    costCenterClassId: [null as number | null, [Validators.required, Validators.min(1)]],
    costCenterNatureId: [null as number | null, [Validators.required, Validators.min(1)]],
    allowsAllocation: [false, [Validators.required]],
    distributesCosts: [false, [Validators.required]],
    functionalUnit: [false, [Validators.required]],
    profitCenter: [false, [Validators.required]]
  });

  protected readonly costCentersResource = rxResource<
    CostCenterPage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) => this.listCostCentersUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedCostCenterResource = rxResource<
    CostCenter | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) => (params.id ? this.getCostCenterDetailUseCase.execute(params.id) : of(null)),
    defaultValue: null
  });
  protected readonly selectOptionsResource = this.accountingCatalogOptions.resource;

  protected readonly costCenterPage = computed<CostCenterPage | null>(
    () => this.costCentersResource.value() ?? null
  );
  protected readonly costCenters = computed<CostCenter[]>(() => this.costCenterPage()?.items ?? []);
  protected readonly pagination = computed(() => {
    const page = this.costCenterPage();

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
  protected readonly businessStructureOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('business_structure');
  protected readonly campusOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('campus');
  protected readonly costCenterTypeOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('cost_center_type');
  protected readonly costCenterClassOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('cost_center_class');
  protected readonly costCenterNatureOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('cost_center_nature');
  protected readonly isEditing = computed(() => this.editingId() !== null);
  protected readonly formTitle = computed(() =>
    this.isEditing() ? 'Editar centro de costo' : 'Nuevo centro de costo'
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
      const costCenter = this.selectedCostCenterResource.value();

      if (!costCenter) {
        return;
      }

      this.patchForm(costCenter);
    });

    effect(() => {
      const nodes = this.costCenters().map((costCenter) => this.mapCostCenterToTreeNode(costCenter));
      this.treeGridDataSource.set(this.treeGridDataSourceBuilder.create(nodes));
    });
  }

  protected startCreate(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.detailRefreshTick.set(0);
    this.resetForm();
  }

  protected editCostCenter(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa del centro de costo seleccionado.'
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
        'Revisa los campos obligatorios antes de guardar el centro de costo.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(this.updateCostCenterUseCase.execute(this.editingId()!, payload));
        this.showToast(
          'success',
          'Registro actualizado',
          'El centro de costo se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createCostCenterUseCase.execute(payload));
        this.showToast('success', 'Registro creado', 'El centro de costo se creo correctamente.');
      }

      this.reloadList();
      this.closeForm();
    } catch (error) {
      this.showToast('danger', 'No fue posible guardar', this.extractErrorMessage(error));
    } finally {
      this.submitting.set(false);
    }
  }

  protected async deleteCostCenter(id: number): Promise<void> {
    const confirmed = confirm('Deseas eliminar este centro de costo? Esta accion no se puede deshacer.');

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteCostCenterUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'El centro de costo fue eliminado correctamente.'
      );

      if (this.editingId() === id) {
        this.closeForm();
      }

      this.reloadList();
    } catch (error) {
      this.showToast('danger', 'No fue posible eliminar', this.extractErrorMessage(error));
    } finally {
      this.deletingId.set(null);
    }
  }

  protected async restoreCostCenter(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar este centro de costo eliminado?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreCostCenterUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'El centro de costo fue restaurado correctamente.'
      );
      this.reloadList();
    } catch (error) {
      this.showToast('danger', 'No fue posible restaurar', this.extractErrorMessage(error));
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
      'Se recargo la informacion de centros de costo y catalogos desde la API.'
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

    if (!Number.isFinite(nextPerPage) || nextPerPage <= 0 || this.perPage() === nextPerPage) {
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

  private patchForm(costCenter: CostCenter): void {
    this.form.reset({
      businessStructureId: costCenter.businessStructureId,
      campusId: costCenter.campusId,
      code: costCenter.code,
      name: costCenter.name,
      description: costCenter.description,
      costCenterTypeId: costCenter.costCenterTypeId,
      costCenterClassId: costCenter.costCenterClassId,
      costCenterNatureId: costCenter.costCenterNatureId,
      allowsAllocation: costCenter.allowsAllocation,
      distributesCosts: costCenter.distributesCosts,
      functionalUnit: costCenter.functionalUnit,
      profitCenter: costCenter.profitCenter
    });
  }

  private resetForm(): void {
    this.form.reset({
      businessStructureId: null,
      campusId: null,
      code: '',
      name: '',
      description: '',
      costCenterTypeId: null,
      costCenterClassId: null,
      costCenterNatureId: null,
      allowsAllocation: false,
      distributesCosts: false,
      functionalUnit: false,
      profitCenter: false
    });
  }

  private buildPayload(): CostCenterPayload {
    const value = this.form.getRawValue();

    return {
      businessStructureId: value.businessStructureId ?? 0,
      campusId: value.campusId ?? 0,
      code: value.code?.trim() ?? '',
      name: value.name?.trim() ?? '',
      description: value.description?.trim() ?? '',
      costCenterTypeId: value.costCenterTypeId ?? 0,
      costCenterClassId: value.costCenterClassId ?? 0,
      costCenterNatureId: value.costCenterNatureId ?? 0,
      allowsAllocation: value.allowsAllocation ?? false,
      distributesCosts: value.distributesCosts ?? false,
      functionalUnit: value.functionalUnit ?? false,
      profitCenter: value.profitCenter ?? false
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

  private mapCostCenterToTreeNode(costCenter: CostCenter): TreeNode<CostCenterGridRow> {
    return {
      data: {
        id: costCenter.id,
        code: costCenter.code,
        name: costCenter.name,
        businessStructureName:
          costCenter.businessStructure?.label ??
          costCenter.businessStructure?.name ??
          `Id ${costCenter.businessStructureId}`,
        campusName: costCenter.campus?.label ?? costCenter.campus?.name ?? `Id ${costCenter.campusId}`,
        costCenterTypeName:
          costCenter.costCenterType?.label ??
          costCenter.costCenterType?.name ??
          `Id ${costCenter.costCenterTypeId}`,
        costCenterClassName:
          costCenter.costCenterClass?.label ??
          costCenter.costCenterClass?.name ??
          `Id ${costCenter.costCenterClassId}`,
        costCenterNatureName:
          costCenter.costCenterNature?.label ??
          costCenter.costCenterNature?.name ??
          `Id ${costCenter.costCenterNatureId}`,
        allowsAllocation: costCenter.allowsAllocation,
        distributesCosts: costCenter.distributesCosts,
        functionalUnit: costCenter.functionalUnit,
        profitCenter: costCenter.profitCenter,
        description: costCenter.description,
        createdAt: costCenter.createdAt,
        deletedAt: costCenter.deletedAt
      }
    };
  }
}
