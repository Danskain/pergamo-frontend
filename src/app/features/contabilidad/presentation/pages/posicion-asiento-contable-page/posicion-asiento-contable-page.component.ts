import { DatePipe, DecimalPipe } from '@angular/common';
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
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbTreeGridModule
} from '@nebular/theme';

import { CreateAccountingEntryPositionUseCase } from '../../../application/use-cases/create-accounting-entry-position.use-case';
import { DeleteAccountingEntryPositionUseCase } from '../../../application/use-cases/delete-accounting-entry-position.use-case';
import { GetAccountingEntryPositionDetailUseCase } from '../../../application/use-cases/get-accounting-entry-position-detail.use-case';
import { ListAccountingEntryPositionsUseCase } from '../../../application/use-cases/list-accounting-entry-positions.use-case';
import { RestoreAccountingEntryPositionUseCase } from '../../../application/use-cases/restore-accounting-entry-position.use-case';
import { UpdateAccountingEntryPositionUseCase } from '../../../application/use-cases/update-accounting-entry-position.use-case';
import { SelectOption } from '../../../domain/models/accounting-select-option.model';
import {
  AccountingEntryIndicator,
  AccountingEntryPosition,
  AccountingEntryPositionPage,
  AccountingEntryPositionPayload
} from '../../../domain/models/accounting-entry-position.model';
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

type AccountingEntryPositionGridRow = {
  id: number;
  businessStructureName: string;
  accountingDocumentName: string;
  accountingEntryHeaderName: string;
  accountingAccountName: string;
  idTercero: number | null;
  indicatorDc: AccountingEntryIndicator | null;
  amount: number;
  coinName: string;
  costCenterName: string;
  positionText: string | null;
  createdAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-posicion-asiento-contable-page',
  imports: [
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbTreeGridModule,
    CrudCollectionShellComponent,
    CrudPageHeroComponent,
    CrudSectionCardComponent
  ],
  templateUrl: './posicion-asiento-contable-page.component.html',
  styleUrl: './posicion-asiento-contable-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosicionAsientoContablePageComponent {
  private static readonly FORM_CATALOGS = [
    'business_structure',
    'accounting_document',
    'accounting_entry_header',
    'accounting_accounts',
    'coins',
    'cost_center'
  ];

  private readonly indicatorOptions = signal<AccountingEntryIndicator[]>(['Debito', 'Credito']);
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
  ) as NbTreeGridDataSourceBuilder<AccountingEntryPositionGridRow>;
  private readonly listAccountingEntryPositionsUseCase = inject(
    ListAccountingEntryPositionsUseCase
  );
  private readonly getAccountingEntryPositionDetailUseCase = inject(
    GetAccountingEntryPositionDetailUseCase
  );
  private readonly createAccountingEntryPositionUseCase = inject(
    CreateAccountingEntryPositionUseCase
  );
  private readonly updateAccountingEntryPositionUseCase = inject(
    UpdateAccountingEntryPositionUseCase
  );
  private readonly deleteAccountingEntryPositionUseCase = inject(
    DeleteAccountingEntryPositionUseCase
  );
  private readonly restoreAccountingEntryPositionUseCase = inject(
    RestoreAccountingEntryPositionUseCase
  );
  private readonly accountingCatalogOptions = injectAccountingCatalogOptions(
    PosicionAsientoContablePageComponent.FORM_CATALOGS,
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
  protected readonly treeGridCustomColumn = 'positionText';
  protected readonly treeGridColumns = [
    'id',
    'businessStructureName',
    'accountingDocumentName',
    'accountingEntryHeaderName',
    'accountingAccountName',
    'idTercero',
    'indicatorDc',
    'amount',
    'coinName',
    'costCenterName',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<
    NbTreeGridDataSource<AccountingEntryPositionGridRow>
  >(this.treeGridDataSourceBuilder.create([] as TreeNode<AccountingEntryPositionGridRow>[]));

  protected readonly form = this.formBuilder.group({
    businessStructureId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingDocumentId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingEntryHeaderId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingAccountsId: [null as number | null, [Validators.required, Validators.min(1)]],
    idTercero: [null as number | null, [Validators.min(0)]],
    indicatorDc: [null as AccountingEntryIndicator | null],
    amount: [null as number | null, [Validators.required]],
    coinId: [null as number | null, [Validators.required, Validators.min(1)]],
    costCenterId: [null as number | null],
    positionText: ['', [Validators.maxLength(255)]]
  });

  protected readonly accountingEntryPositionsResource = rxResource<
    AccountingEntryPositionPage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) =>
      this.listAccountingEntryPositionsUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedAccountingEntryPositionResource = rxResource<
    AccountingEntryPosition | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getAccountingEntryPositionDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });
  protected readonly selectOptionsResource = this.accountingCatalogOptions.resource;

  protected readonly accountingEntryPositionPage = computed<AccountingEntryPositionPage | null>(
    () => this.accountingEntryPositionsResource.value() ?? null
  );
  protected readonly accountingEntryPositions = computed<AccountingEntryPosition[]>(
    () => this.accountingEntryPositionPage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.accountingEntryPositionPage();

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
  protected readonly accountingDocumentOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('accounting_document');
  protected readonly accountingEntryHeaderOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('accounting_entry_header');
  protected readonly accountingAccountOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('accounting_accounts');
  protected readonly coinOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('coins');
  protected readonly costCenterOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('cost_center');
  protected readonly isEditing = computed(() => this.editingId() !== null);
  protected readonly formTitle = computed(() =>
    this.isEditing()
      ? 'Editar posicion asiento contable'
      : 'Nueva posicion asiento contable'
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
      const accountingEntryPosition = this.selectedAccountingEntryPositionResource.value();

      if (!accountingEntryPosition) {
        return;
      }

      this.patchForm(accountingEntryPosition);
    });

    effect(() => {
      const nodes = this.accountingEntryPositions().map((accountingEntryPosition) =>
        this.mapAccountingEntryPositionToTreeNode(accountingEntryPosition)
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

  protected editAccountingEntryPosition(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa de la posicion asiento contable seleccionada.'
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
        'Revisa los campos obligatorios antes de guardar la posicion asiento contable.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(
          this.updateAccountingEntryPositionUseCase.execute(this.editingId()!, payload)
        );
        this.showToast(
          'success',
          'Registro actualizado',
          'La posicion asiento contable se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createAccountingEntryPositionUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'La posicion asiento contable se creo correctamente.'
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

  protected async deleteAccountingEntryPosition(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar esta posicion asiento contable? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteAccountingEntryPositionUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'La posicion asiento contable fue eliminada correctamente.'
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

  protected async restoreAccountingEntryPosition(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar esta posicion asiento contable eliminada?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreAccountingEntryPositionUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'La posicion asiento contable fue restaurada correctamente.'
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
      'Se recargo la informacion de posiciones de asiento contable y catalogos desde la API.'
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

  protected readonly indicators = this.indicatorOptions.asReadonly();

  private reloadList(): void {
    this.refreshTick.update((value) => value + 1);
  }

  private patchForm(accountingEntryPosition: AccountingEntryPosition): void {
    this.form.reset({
      businessStructureId: accountingEntryPosition.businessStructureId,
      accountingDocumentId: accountingEntryPosition.accountingDocumentId,
      accountingEntryHeaderId: accountingEntryPosition.accountingEntryHeaderId,
      accountingAccountsId: accountingEntryPosition.accountingAccountsId,
      idTercero: accountingEntryPosition.idTercero,
      indicatorDc: accountingEntryPosition.indicatorDc,
      amount: accountingEntryPosition.amount,
      coinId: accountingEntryPosition.coinId,
      costCenterId: accountingEntryPosition.costCenterId,
      positionText: accountingEntryPosition.positionText ?? ''
    });
  }

  private resetForm(): void {
    this.form.reset({
      businessStructureId: null,
      accountingDocumentId: null,
      accountingEntryHeaderId: null,
      accountingAccountsId: null,
      idTercero: null,
      indicatorDc: null,
      amount: null,
      coinId: null,
      costCenterId: null,
      positionText: ''
    });
  }

  private buildPayload(): AccountingEntryPositionPayload {
    const value = this.form.getRawValue();
    const positionText = value.positionText?.trim() ?? '';

    return {
      businessStructureId: value.businessStructureId ?? 0,
      accountingDocumentId: value.accountingDocumentId ?? 0,
      accountingEntryHeaderId: value.accountingEntryHeaderId ?? 0,
      accountingAccountsId: value.accountingAccountsId ?? 0,
      idTercero: value.idTercero === null || value.idTercero === undefined ? null : value.idTercero,
      indicatorDc: value.indicatorDc ?? null,
      amount: Number(value.amount ?? 0),
      coinId: value.coinId ?? 0,
      costCenterId: value.costCenterId ?? null,
      positionText: positionText.length > 0 ? positionText : null
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

  private mapAccountingEntryPositionToTreeNode(
    accountingEntryPosition: AccountingEntryPosition
  ): TreeNode<AccountingEntryPositionGridRow> {
    return {
      data: {
        id: accountingEntryPosition.id,
        businessStructureName:
          accountingEntryPosition.businessStructure?.label ??
          accountingEntryPosition.businessStructure?.name ??
          `Id ${accountingEntryPosition.businessStructureId}`,
        accountingDocumentName:
          accountingEntryPosition.accountingDocument?.label ??
          accountingEntryPosition.accountingDocument?.name ??
          `Id ${accountingEntryPosition.accountingDocumentId}`,
        accountingEntryHeaderName:
          accountingEntryPosition.accountingEntryHeader?.label ??
          accountingEntryPosition.accountingEntryHeader?.name ??
          `Id ${accountingEntryPosition.accountingEntryHeaderId}`,
        accountingAccountName:
          accountingEntryPosition.accountingAccount?.label ??
          accountingEntryPosition.accountingAccount?.account ??
          accountingEntryPosition.accountingAccount?.name ??
          `Id ${accountingEntryPosition.accountingAccountsId}`,
        idTercero: accountingEntryPosition.idTercero,
        indicatorDc: accountingEntryPosition.indicatorDc,
        amount: accountingEntryPosition.amount,
        coinName:
          accountingEntryPosition.coin?.label ??
          accountingEntryPosition.coin?.name ??
          `Id ${accountingEntryPosition.coinId}`,
        costCenterName:
          accountingEntryPosition.costCenter?.label ??
          accountingEntryPosition.costCenter?.name ??
          (accountingEntryPosition.costCenterId ? `Id ${accountingEntryPosition.costCenterId}` : 'Sin centro de costo'),
        positionText: accountingEntryPosition.positionText,
        createdAt: accountingEntryPosition.createdAt,
        deletedAt: accountingEntryPosition.deletedAt
      }
    };
  }
}
