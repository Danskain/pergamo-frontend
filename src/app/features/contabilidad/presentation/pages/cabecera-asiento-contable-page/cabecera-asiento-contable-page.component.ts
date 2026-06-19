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

import { CreateAccountingEntryHeaderUseCase } from '../../../application/use-cases/create-accounting-entry-header.use-case';
import { DeleteAccountingEntryHeaderUseCase } from '../../../application/use-cases/delete-accounting-entry-header.use-case';
import { GetAccountingEntryHeaderDetailUseCase } from '../../../application/use-cases/get-accounting-entry-header-detail.use-case';
import { ListAccountingEntryHeadersUseCase } from '../../../application/use-cases/list-accounting-entry-headers.use-case';
import { RestoreAccountingEntryHeaderUseCase } from '../../../application/use-cases/restore-accounting-entry-header.use-case';
import { UpdateAccountingEntryHeaderUseCase } from '../../../application/use-cases/update-accounting-entry-header.use-case';
import { SelectOption } from '../../../domain/models/accounting-select-option.model';
import {
  AccountingEntryHeader,
  AccountingEntryHeaderPage,
  AccountingEntryHeaderPayload
} from '../../../domain/models/accounting-entry-header.model';
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

type AccountingEntryHeaderGridRow = {
  id: number;
  referenceDocument: string;
  businessStructureName: string;
  accountingDocumentName: string;
  documentSourceName: string;
  accountingPeriod: number;
  totalDebits: number;
  totalCredits: number;
  coinName: string;
  createdAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-cabecera-asiento-contable-page',
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
  templateUrl: './cabecera-asiento-contable-page.component.html',
  styleUrl: './cabecera-asiento-contable-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CabeceraAsientoContablePageComponent {
  private static readonly FORM_CATALOGS = [
    'business_structure',
    'accounting_document',
    'coins',
    'documents_source'
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
  ) as NbTreeGridDataSourceBuilder<AccountingEntryHeaderGridRow>;
  private readonly listAccountingEntryHeadersUseCase = inject(
    ListAccountingEntryHeadersUseCase
  );
  private readonly getAccountingEntryHeaderDetailUseCase = inject(
    GetAccountingEntryHeaderDetailUseCase
  );
  private readonly createAccountingEntryHeaderUseCase = inject(
    CreateAccountingEntryHeaderUseCase
  );
  private readonly updateAccountingEntryHeaderUseCase = inject(
    UpdateAccountingEntryHeaderUseCase
  );
  private readonly deleteAccountingEntryHeaderUseCase = inject(
    DeleteAccountingEntryHeaderUseCase
  );
  private readonly restoreAccountingEntryHeaderUseCase = inject(
    RestoreAccountingEntryHeaderUseCase
  );
  private readonly accountingCatalogOptions = injectAccountingCatalogOptions(
    CabeceraAsientoContablePageComponent.FORM_CATALOGS,
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
  protected readonly treeGridCustomColumn = 'referenceDocument';
  protected readonly treeGridColumns = [
    'id',
    'businessStructureName',
    'accountingDocumentName',
    'documentSourceName',
    'accountingPeriod',
    'totalDebits',
    'totalCredits',
    'coinName',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<
    NbTreeGridDataSource<AccountingEntryHeaderGridRow>
  >(this.treeGridDataSourceBuilder.create([] as TreeNode<AccountingEntryHeaderGridRow>[]));

  protected readonly form = this.formBuilder.group({
    businessStructureId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingDocumentId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingPeriod: [null as number | null, [Validators.required]],
    coinId: [null as number | null, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required]],
    totalDebits: [null as number | null, [Validators.required, Validators.min(0)]],
    totalCredits: [null as number | null, [Validators.required, Validators.min(0)]],
    referenceDocument: ['', [Validators.required, Validators.maxLength(255)]],
    documentsSourceId: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  protected readonly accountingEntryHeadersResource = rxResource<
    AccountingEntryHeaderPage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) =>
      this.listAccountingEntryHeadersUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedAccountingEntryHeaderResource = rxResource<
    AccountingEntryHeader | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getAccountingEntryHeaderDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });
  protected readonly selectOptionsResource = this.accountingCatalogOptions.resource;

  protected readonly accountingEntryHeaderPage = computed<AccountingEntryHeaderPage | null>(
    () => this.accountingEntryHeadersResource.value() ?? null
  );
  protected readonly accountingEntryHeaders = computed<AccountingEntryHeader[]>(
    () => this.accountingEntryHeaderPage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.accountingEntryHeaderPage();

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
  protected readonly businessStructureOptions: () => Array<
    SelectOption<Record<string, unknown>>
  > = this.accountingCatalogOptions.optionsFor('business_structure');
  protected readonly accountingDocumentOptions: () => Array<
    SelectOption<Record<string, unknown>>
  > = this.accountingCatalogOptions.optionsFor('accounting_document');
  protected readonly coinOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('coins');
  protected readonly documentSourceOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('documents_source');
  protected readonly isEditing = computed(() => this.editingId() !== null);
  protected readonly formTitle = computed(() =>
    this.isEditing()
      ? 'Editar cabecera asiento contable'
      : 'Nueva cabecera asiento contable'
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
      const accountingEntryHeader = this.selectedAccountingEntryHeaderResource.value();

      if (!accountingEntryHeader) {
        return;
      }

      this.patchForm(accountingEntryHeader);
    });

    effect(() => {
      const nodes = this.accountingEntryHeaders().map((accountingEntryHeader) =>
        this.mapAccountingEntryHeaderToTreeNode(accountingEntryHeader)
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

  protected editAccountingEntryHeader(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa de la cabecera asiento contable seleccionada.'
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
        'Revisa los campos obligatorios antes de guardar la cabecera asiento contable.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(
          this.updateAccountingEntryHeaderUseCase.execute(this.editingId()!, payload)
        );
        this.showToast(
          'success',
          'Registro actualizado',
          'La cabecera asiento contable se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createAccountingEntryHeaderUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'La cabecera asiento contable se creo correctamente.'
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

  protected async deleteAccountingEntryHeader(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar esta cabecera asiento contable? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteAccountingEntryHeaderUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'La cabecera asiento contable fue eliminada correctamente.'
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

  protected async restoreAccountingEntryHeader(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar esta cabecera asiento contable eliminada?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreAccountingEntryHeaderUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'La cabecera asiento contable fue restaurada correctamente.'
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
      'Se recargo la informacion de cabeceras de asiento contable y catalogos desde la API.'
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

  private patchForm(accountingEntryHeader: AccountingEntryHeader): void {
    this.form.reset({
      businessStructureId: accountingEntryHeader.businessStructureId,
      accountingDocumentId: accountingEntryHeader.accountingDocumentId,
      accountingPeriod: accountingEntryHeader.accountingPeriod,
      coinId: accountingEntryHeader.coinId,
      description: accountingEntryHeader.description,
      totalDebits: accountingEntryHeader.totalDebits,
      totalCredits: accountingEntryHeader.totalCredits,
      referenceDocument: accountingEntryHeader.referenceDocument,
      documentsSourceId: accountingEntryHeader.documentsSourceId
    });
  }

  private resetForm(): void {
    this.form.reset({
      businessStructureId: null,
      accountingDocumentId: null,
      accountingPeriod: null,
      coinId: null,
      description: '',
      totalDebits: null,
      totalCredits: null,
      referenceDocument: '',
      documentsSourceId: null
    });
  }

  private buildPayload(): AccountingEntryHeaderPayload {
    const value = this.form.getRawValue();

    return {
      businessStructureId: value.businessStructureId ?? 0,
      accountingDocumentId: value.accountingDocumentId ?? 0,
      accountingPeriod: Number(value.accountingPeriod ?? 0),
      coinId: value.coinId ?? 0,
      description: value.description?.trim() ?? '',
      totalDebits: Number(value.totalDebits ?? 0),
      totalCredits: Number(value.totalCredits ?? 0),
      referenceDocument: value.referenceDocument?.trim() ?? '',
      documentsSourceId: value.documentsSourceId ?? 0
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

  private mapAccountingEntryHeaderToTreeNode(
    accountingEntryHeader: AccountingEntryHeader
  ): TreeNode<AccountingEntryHeaderGridRow> {
    return {
      data: {
        id: accountingEntryHeader.id,
        referenceDocument: accountingEntryHeader.referenceDocument,
        businessStructureName:
          accountingEntryHeader.businessStructure?.label ??
          accountingEntryHeader.businessStructure?.name ??
          `Id ${accountingEntryHeader.businessStructureId}`,
        accountingDocumentName:
          accountingEntryHeader.accountingDocument?.label ??
          accountingEntryHeader.accountingDocument?.name ??
          `Id ${accountingEntryHeader.accountingDocumentId}`,
        documentSourceName:
          accountingEntryHeader.documentSource?.label ??
          accountingEntryHeader.documentSource?.name ??
          `Id ${accountingEntryHeader.documentsSourceId}`,
        accountingPeriod: accountingEntryHeader.accountingPeriod,
        totalDebits: accountingEntryHeader.totalDebits,
        totalCredits: accountingEntryHeader.totalCredits,
        coinName:
          accountingEntryHeader.coin?.label ??
          accountingEntryHeader.coin?.name ??
          `Id ${accountingEntryHeader.coinId}`,
        createdAt: accountingEntryHeader.createdAt,
        deletedAt: accountingEntryHeader.deletedAt
      }
    };
  }
}
