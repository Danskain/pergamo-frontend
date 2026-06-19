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

import { CreateDocumentSourceUseCase } from '../../../application/use-cases/create-document-source.use-case';
import { DeleteDocumentSourceUseCase } from '../../../application/use-cases/delete-document-source.use-case';
import { GetDocumentSourceDetailUseCase } from '../../../application/use-cases/get-document-source-detail.use-case';
import { ListDocumentSourcesUseCase } from '../../../application/use-cases/list-document-sources.use-case';
import { RestoreDocumentSourceUseCase } from '../../../application/use-cases/restore-document-source.use-case';
import { UpdateDocumentSourceUseCase } from '../../../application/use-cases/update-document-source.use-case';
import { SelectOption } from '../../../domain/models/accounting-select-option.model';
import {
  DocumentSource,
  DocumentSourcePage,
  DocumentSourcePayload
} from '../../../domain/models/document-source.model';
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

type DocumentSourceGridRow = {
  id: number;
  numberDocumentSource: string;
  businessStructureName: string;
  moduleName: string;
  documentSourceTypeName: string;
  accountingDocumentName: string;
  financialStatementName: string;
  totalValue: number;
  documentDate: string;
  accountingDate: string;
  exercise: number;
  createdAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-documento-origen-page',
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
  templateUrl: './documento-origen-page.component.html',
  styleUrl: './documento-origen-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentoOrigenPageComponent {
  private static readonly FORM_CATALOGS = [
    'business_structure',
    'modules',
    'document_source_type',
    'reference',
    'coins',
    'financial_statements',
    'accounting_document'
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
  ) as NbTreeGridDataSourceBuilder<DocumentSourceGridRow>;
  private readonly listDocumentSourcesUseCase = inject(ListDocumentSourcesUseCase);
  private readonly getDocumentSourceDetailUseCase = inject(GetDocumentSourceDetailUseCase);
  private readonly createDocumentSourceUseCase = inject(CreateDocumentSourceUseCase);
  private readonly updateDocumentSourceUseCase = inject(UpdateDocumentSourceUseCase);
  private readonly deleteDocumentSourceUseCase = inject(DeleteDocumentSourceUseCase);
  private readonly restoreDocumentSourceUseCase = inject(RestoreDocumentSourceUseCase);
  private readonly accountingCatalogOptions = injectAccountingCatalogOptions(
    DocumentoOrigenPageComponent.FORM_CATALOGS,
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
  protected readonly treeGridCustomColumn = 'numberDocumentSource';
  protected readonly treeGridColumns = [
    'id',
    'businessStructureName',
    'moduleName',
    'documentSourceTypeName',
    'accountingDocumentName',
    'financialStatementName',
    'totalValue',
    'documentDate',
    'accountingDate',
    'exercise',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<
    NbTreeGridDataSource<DocumentSourceGridRow>
  >(this.treeGridDataSourceBuilder.create([] as TreeNode<DocumentSourceGridRow>[]));

  protected readonly form = this.formBuilder.group({
    businessStructureId: [null as number | null, [Validators.required, Validators.min(1)]],
    modulesId: [null as number | null, [Validators.required, Validators.min(1)]],
    documentSourceTypeId: [null as number | null, [Validators.required, Validators.min(1)]],
    numberDocumentSource: ['', [Validators.required, Validators.maxLength(255)]],
    documentDate: ['', [Validators.required]],
    accountingDate: ['', [Validators.required]],
    referenceId: [null as number | null, [Validators.required, Validators.min(1)]],
    totalValue: [null as number | null, [Validators.required, Validators.min(0)]],
    coinId: [null as number | null, [Validators.required, Validators.min(1)]],
    financialStatementId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingDocumentId: [null as number | null, [Validators.required, Validators.min(1)]],
    exercise: [null as number | null, [Validators.required]],
    description: ['', [Validators.required]]
  });

  protected readonly documentSourcesResource = rxResource<
    DocumentSourcePage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) => this.listDocumentSourcesUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedDocumentSourceResource = rxResource<
    DocumentSource | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getDocumentSourceDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });
  protected readonly selectOptionsResource = this.accountingCatalogOptions.resource;

  protected readonly documentSourcePage = computed<DocumentSourcePage | null>(
    () => this.documentSourcesResource.value() ?? null
  );
  protected readonly documentSources = computed<DocumentSource[]>(
    () => this.documentSourcePage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.documentSourcePage();

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
  protected readonly moduleOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('modules');
  protected readonly documentSourceTypeOptions: () => Array<
    SelectOption<Record<string, unknown>>
  > = this.accountingCatalogOptions.optionsFor('document_source_type');
  protected readonly referenceOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('reference');
  protected readonly coinOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('coins');
  protected readonly financialStatementOptions: () => Array<
    SelectOption<Record<string, unknown>>
  > = this.accountingCatalogOptions.optionsFor('financial_statements');
  protected readonly accountingDocumentOptions: () => Array<
    SelectOption<Record<string, unknown>>
  > = this.accountingCatalogOptions.optionsFor('accounting_document');
  protected readonly isEditing = computed(() => this.editingId() !== null);
  protected readonly formTitle = computed(() =>
    this.isEditing() ? 'Editar documento origen' : 'Nuevo documento origen'
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
      const documentSource = this.selectedDocumentSourceResource.value();

      if (!documentSource) {
        return;
      }

      this.patchForm(documentSource);
    });

    effect(() => {
      const nodes = this.documentSources().map((documentSource) =>
        this.mapDocumentSourceToTreeNode(documentSource)
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

  protected editDocumentSource(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa del documento origen seleccionado.'
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
        'Revisa los campos obligatorios antes de guardar el documento origen.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(this.updateDocumentSourceUseCase.execute(this.editingId()!, payload));
        this.showToast(
          'success',
          'Registro actualizado',
          'El documento origen se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createDocumentSourceUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'El documento origen se creo correctamente.'
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

  protected async deleteDocumentSource(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar este documento origen? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteDocumentSourceUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'El documento origen fue eliminado correctamente.'
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

  protected async restoreDocumentSource(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar este documento origen eliminado?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreDocumentSourceUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'El documento origen fue restaurado correctamente.'
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
      'Se recargo la informacion de documentos origen y catalogos desde la API.'
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

  private patchForm(documentSource: DocumentSource): void {
    this.form.reset({
      businessStructureId: documentSource.businessStructureId,
      modulesId: documentSource.modulesId,
      documentSourceTypeId: documentSource.documentSourceTypeId,
      numberDocumentSource: documentSource.numberDocumentSource,
      documentDate: this.normalizeDateInput(documentSource.documentDate),
      accountingDate: this.normalizeDateInput(documentSource.accountingDate),
      referenceId: documentSource.referenceId,
      totalValue: documentSource.totalValue,
      coinId: documentSource.coinId,
      financialStatementId: documentSource.financialStatementId,
      accountingDocumentId: documentSource.accountingDocumentId,
      exercise: documentSource.exercise,
      description: documentSource.description
    });
  }

  private resetForm(): void {
    this.form.reset({
      businessStructureId: null,
      modulesId: null,
      documentSourceTypeId: null,
      numberDocumentSource: '',
      documentDate: '',
      accountingDate: '',
      referenceId: null,
      totalValue: null,
      coinId: null,
      financialStatementId: null,
      accountingDocumentId: null,
      exercise: null,
      description: ''
    });
  }

  private buildPayload(): DocumentSourcePayload {
    const value = this.form.getRawValue();

    return {
      businessStructureId: value.businessStructureId ?? 0,
      modulesId: value.modulesId ?? 0,
      documentSourceTypeId: value.documentSourceTypeId ?? 0,
      numberDocumentSource: value.numberDocumentSource?.trim() ?? '',
      documentDate: value.documentDate ?? '',
      accountingDate: value.accountingDate ?? '',
      referenceId: value.referenceId ?? 0,
      totalValue: Number(value.totalValue ?? 0),
      coinId: value.coinId ?? 0,
      financialStatementId: value.financialStatementId ?? 0,
      accountingDocumentId: value.accountingDocumentId ?? 0,
      exercise: Number(value.exercise ?? 0),
      description: value.description?.trim() ?? ''
    };
  }

  private normalizeDateInput(value: string): string {
    return value ? value.slice(0, 10) : '';
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

  private mapDocumentSourceToTreeNode(
    documentSource: DocumentSource
  ): TreeNode<DocumentSourceGridRow> {
    return {
      data: {
        id: documentSource.id,
        numberDocumentSource: documentSource.numberDocumentSource,
        businessStructureName:
          documentSource.businessStructure?.label ??
          documentSource.businessStructure?.name ??
          `Id ${documentSource.businessStructureId}`,
        moduleName:
          documentSource.moduleItem?.label ??
          documentSource.moduleItem?.name ??
          `Id ${documentSource.modulesId}`,
        documentSourceTypeName:
          documentSource.documentSourceType?.label ??
          documentSource.documentSourceType?.name ??
          `Id ${documentSource.documentSourceTypeId}`,
        accountingDocumentName:
          documentSource.accountingDocument?.label ??
          documentSource.accountingDocument?.name ??
          `Id ${documentSource.accountingDocumentId}`,
        financialStatementName:
          documentSource.financialStatement?.label ??
          documentSource.financialStatement?.name ??
          `Id ${documentSource.financialStatementId}`,
        totalValue: documentSource.totalValue,
        documentDate: documentSource.documentDate,
        accountingDate: documentSource.accountingDate,
        exercise: documentSource.exercise,
        createdAt: documentSource.createdAt,
        deletedAt: documentSource.deletedAt
      }
    };
  }
}
