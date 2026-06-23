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

import { CreateAccountingSchemeUseCase } from '../../../application/use-cases/create-accounting-scheme.use-case';
import { DeleteAccountingSchemeUseCase } from '../../../application/use-cases/delete-accounting-scheme.use-case';
import { GetAccountingSchemeDetailUseCase } from '../../../application/use-cases/get-accounting-scheme-detail.use-case';
import { ListAccountingSchemesUseCase } from '../../../application/use-cases/list-accounting-schemes.use-case';
import { RestoreAccountingSchemeUseCase } from '../../../application/use-cases/restore-accounting-scheme.use-case';
import { UpdateAccountingSchemeUseCase } from '../../../application/use-cases/update-accounting-scheme.use-case';
import { SelectOption } from '../../../domain/models/accounting-select-option.model';
import {
  AccountingScheme,
  AccountingSchemePage,
  AccountingSchemePayload
} from '../../../domain/models/accounting-scheme.model';
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

type AccountingSchemeGridRow = {
  id: number;
  assessmentClass: string;
  businessStructureName: string;
  chartAccountName: string;
  typeMovementName: string;
  accountingEventName: string;
  keyOperationName: string;
  accountingAccountName: string;
  accountingNatureName: string;
  requireCoce: boolean;
  createdAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-esquema-contable-page',
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
  templateUrl: './esquema-contable-page.component.html',
  styleUrl: './esquema-contable-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsquemaContablePageComponent {
  private static readonly FORM_CATALOGS = [
    'business_structure',
    'chart_accounts',
    'accounting_events',
    'key_operations',
    'accounting_accounts',
    'accounting_nature'
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
  ) as NbTreeGridDataSourceBuilder<AccountingSchemeGridRow>;
  private readonly listAccountingSchemesUseCase = inject(ListAccountingSchemesUseCase);
  private readonly getAccountingSchemeDetailUseCase = inject(GetAccountingSchemeDetailUseCase);
  private readonly createAccountingSchemeUseCase = inject(CreateAccountingSchemeUseCase);
  private readonly updateAccountingSchemeUseCase = inject(UpdateAccountingSchemeUseCase);
  private readonly deleteAccountingSchemeUseCase = inject(DeleteAccountingSchemeUseCase);
  private readonly restoreAccountingSchemeUseCase = inject(RestoreAccountingSchemeUseCase);
  private readonly accountingCatalogOptions = injectAccountingCatalogOptions(
    EsquemaContablePageComponent.FORM_CATALOGS,
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
  protected readonly treeGridCustomColumn = 'assessmentClass';
  protected readonly treeGridColumns = [
    'id',
    'businessStructureName',
    'chartAccountName',
    'typeMovementName',
    'accountingEventName',
    'keyOperationName',
    'accountingAccountName',
    'accountingNatureName',
    'requireCoce',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<NbTreeGridDataSource<AccountingSchemeGridRow>>(
    this.treeGridDataSourceBuilder.create([] as TreeNode<AccountingSchemeGridRow>[])
  );

  protected readonly form = this.formBuilder.group({
    businessStructureId: [null as number | null, [Validators.required, Validators.min(1)]],
    chartAccountId: [null as number | null, [Validators.required, Validators.min(1)]],
    assessmentClass: ['', [Validators.required, Validators.maxLength(255)]],
    typeMovementId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingEventId: [null as number | null, [Validators.required, Validators.min(1)]],
    keyOperationId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingAccountId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingNatureId: [null as number | null, [Validators.required, Validators.min(1)]],
    requireCoce: [false, [Validators.required]]
  });

  protected readonly accountingSchemesResource = rxResource<
    AccountingSchemePage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) => this.listAccountingSchemesUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedAccountingSchemeResource = rxResource<
    AccountingScheme | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getAccountingSchemeDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });
  protected readonly selectOptionsResource = this.accountingCatalogOptions.resource;

  protected readonly accountingSchemePage = computed<AccountingSchemePage | null>(
    () => this.accountingSchemesResource.value() ?? null
  );
  protected readonly accountingSchemes = computed<AccountingScheme[]>(
    () => this.accountingSchemePage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.accountingSchemePage();

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
  protected readonly chartAccountOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('chart_accounts');
  protected readonly accountingEventOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('accounting_events');
  protected readonly keyOperationOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('key_operations');
  protected readonly accountingAccountOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('accounting_accounts');
  protected readonly accountingNatureOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('accounting_nature');
  protected readonly isEditing = computed(() => this.editingId() !== null);
  protected readonly formTitle = computed(() =>
    this.isEditing() ? 'Editar esquema contable' : 'Nuevo esquema contable'
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
      const accountingScheme = this.selectedAccountingSchemeResource.value();

      if (!accountingScheme) {
        return;
      }

      this.patchForm(accountingScheme);
    });

    effect(() => {
      const nodes = this.accountingSchemes().map((accountingScheme) =>
        this.mapAccountingSchemeToTreeNode(accountingScheme)
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

  protected editAccountingScheme(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa del esquema contable seleccionado.'
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
        'Revisa los campos obligatorios antes de guardar el esquema contable.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(
          this.updateAccountingSchemeUseCase.execute(this.editingId()!, payload)
        );
        this.showToast(
          'success',
          'Registro actualizado',
          'El esquema contable se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createAccountingSchemeUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'El esquema contable se creo correctamente.'
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

  protected async deleteAccountingScheme(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar este esquema contable? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteAccountingSchemeUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'El esquema contable fue eliminado correctamente.'
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

  protected async restoreAccountingScheme(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar este esquema contable eliminado?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreAccountingSchemeUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'El esquema contable fue restaurado correctamente.'
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
      'Se recargo la informacion de esquemas contables y catalogos desde la API.'
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

  private patchForm(accountingScheme: AccountingScheme): void {
    this.form.reset({
      businessStructureId: accountingScheme.businessStructureId,
      chartAccountId: accountingScheme.chartAccountId,
      assessmentClass: accountingScheme.assessmentClass,
      typeMovementId: accountingScheme.typeMovementId,
      accountingEventId: accountingScheme.accountingEventId,
      keyOperationId: accountingScheme.keyOperationId,
      accountingAccountId: accountingScheme.accountingAccountId,
      accountingNatureId: accountingScheme.accountingNatureId,
      requireCoce: accountingScheme.requireCoce
    });
  }

  private resetForm(): void {
    this.form.reset({
      businessStructureId: null,
      chartAccountId: null,
      assessmentClass: '',
      typeMovementId: null,
      accountingEventId: null,
      keyOperationId: null,
      accountingAccountId: null,
      accountingNatureId: null,
      requireCoce: false
    });
  }

  private buildPayload(): AccountingSchemePayload {
    const value = this.form.getRawValue();

    return {
      businessStructureId: value.businessStructureId ?? 0,
      chartAccountId: value.chartAccountId ?? 0,
      assessmentClass: value.assessmentClass?.trim() ?? '',
      typeMovementId: value.typeMovementId ?? 0,
      accountingEventId: value.accountingEventId ?? 0,
      keyOperationId: value.keyOperationId ?? 0,
      accountingAccountId: value.accountingAccountId ?? 0,
      accountingNatureId: value.accountingNatureId ?? 0,
      requireCoce: value.requireCoce ?? false
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

  private mapAccountingSchemeToTreeNode(
    accountingScheme: AccountingScheme
  ): TreeNode<AccountingSchemeGridRow> {
    return {
      data: {
        id: accountingScheme.id,
        assessmentClass: accountingScheme.assessmentClass,
        businessStructureName:
          accountingScheme.businessStructure?.label ??
          accountingScheme.businessStructure?.name ??
          `Id ${accountingScheme.businessStructureId}`,
        chartAccountName:
          accountingScheme.chartAccount?.label ??
          accountingScheme.chartAccount?.name ??
          `Id ${accountingScheme.chartAccountId}`,
        typeMovementName:
          accountingScheme.typeMovement?.label ??
          accountingScheme.typeMovement?.name ??
          `Id ${accountingScheme.typeMovementId}`,
        accountingEventName:
          accountingScheme.accountingEvent?.label ??
          accountingScheme.accountingEvent?.name ??
          `Id ${accountingScheme.accountingEventId}`,
        keyOperationName:
          accountingScheme.keyOperation?.label ??
          accountingScheme.keyOperation?.name ??
          `Id ${accountingScheme.keyOperationId}`,
        accountingAccountName:
          accountingScheme.accountingAccount?.label ??
          accountingScheme.accountingAccount?.name ??
          `Id ${accountingScheme.accountingAccountId}`,
        accountingNatureName:
          accountingScheme.accountingNature?.label ??
          accountingScheme.accountingNature?.name ??
          `Id ${accountingScheme.accountingNatureId}`,
        requireCoce: accountingScheme.requireCoce,
        createdAt: accountingScheme.createdAt,
        deletedAt: accountingScheme.deletedAt
      }
    };
  }
}
