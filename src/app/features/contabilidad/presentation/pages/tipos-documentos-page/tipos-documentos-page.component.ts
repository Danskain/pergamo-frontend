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
  NbToggleModule,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbTreeGridModule
} from '@nebular/theme';

import { CreateDocumentSourceTypeUseCase } from '../../../application/use-cases/create-document-source-type.use-case';
import { DeleteDocumentSourceTypeUseCase } from '../../../application/use-cases/delete-document-source-type.use-case';
import { GetDocumentSourceTypeDetailUseCase } from '../../../application/use-cases/get-document-source-type-detail.use-case';
import { ListDocumentSourceTypesUseCase } from '../../../application/use-cases/list-document-source-types.use-case';
import { RestoreDocumentSourceTypeUseCase } from '../../../application/use-cases/restore-document-source-type.use-case';
import { UpdateDocumentSourceTypeUseCase } from '../../../application/use-cases/update-document-source-type.use-case';
import {
  DocumentSourceType,
  DocumentSourceTypePage,
  DocumentSourceTypePayload
} from '../../../domain/models/document-source-type.model';
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

type DocumentSourceTypeGridRow = {
  id: number;
  code: string;
  name: string;
  description: string;
  generatesAccounting: boolean;
  manualEntry: boolean;
  requiresApproval: boolean;
  requiresThird: boolean;
  requiresCeco: boolean;
  affectsInventory: boolean;
  affectsCartera: boolean;
  affectsCxp: boolean;
  affectsTreasury: boolean;
  allowsReversal: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-tipos-documentos-page',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbToggleModule,
    NbTreeGridModule,
    CrudCollectionShellComponent,
    CrudPageHeroComponent,
    CrudSectionCardComponent
  ],
  templateUrl: './tipos-documentos-page.component.html',
  styleUrl: './tipos-documentos-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TiposDocumentosPageComponent {
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
  ) as NbTreeGridDataSourceBuilder<DocumentSourceTypeGridRow>;
  private readonly listDocumentSourceTypesUseCase = inject(ListDocumentSourceTypesUseCase);
  private readonly getDocumentSourceTypeDetailUseCase = inject(
    GetDocumentSourceTypeDetailUseCase
  );
  private readonly createDocumentSourceTypeUseCase = inject(
    CreateDocumentSourceTypeUseCase
  );
  private readonly updateDocumentSourceTypeUseCase = inject(
    UpdateDocumentSourceTypeUseCase
  );
  private readonly deleteDocumentSourceTypeUseCase = inject(
    DeleteDocumentSourceTypeUseCase
  );
  private readonly restoreDocumentSourceTypeUseCase = inject(
    RestoreDocumentSourceTypeUseCase
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
    'generatesAccounting',
    'manualEntry',
    'requiresApproval',
    'requiresThird',
    'requiresCeco',
    'affectsInventory',
    'affectsCartera',
    'affectsCxp',
    'affectsTreasury',
    'allowsReversal',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<
    NbTreeGridDataSource<DocumentSourceTypeGridRow>
  >(this.treeGridDataSourceBuilder.create([] as TreeNode<DocumentSourceTypeGridRow>[]));

  protected readonly form = this.formBuilder.group({
    code: ['', [Validators.required, Validators.maxLength(255)]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required]],
    generatesAccounting: [false],
    manualEntry: [false],
    requiresApproval: [false],
    requiresThird: [false],
    requiresCeco: [false],
    affectsInventory: [false],
    affectsCartera: [false],
    affectsCxp: [false],
    affectsTreasury: [false],
    allowsReversal: [false]
  });

  protected readonly documentSourceTypesResource = rxResource<
    DocumentSourceTypePage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) =>
      this.listDocumentSourceTypesUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedDocumentSourceTypeResource = rxResource<
    DocumentSourceType | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getDocumentSourceTypeDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });

  protected readonly documentSourceTypePage = computed<DocumentSourceTypePage | null>(
    () => this.documentSourceTypesResource.value() ?? null
  );
  protected readonly documentSourceTypes = computed<DocumentSourceType[]>(
    () => this.documentSourceTypePage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.documentSourceTypePage();

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
    this.isEditing() ? 'Editar tipo de documento' : 'Nuevo tipo de documento'
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
      const documentSourceType = this.selectedDocumentSourceTypeResource.value();

      if (!documentSourceType) {
        return;
      }

      this.patchForm(documentSourceType);
    });

    effect(() => {
      const nodes = this.documentSourceTypes().map((documentSourceType) =>
        this.mapDocumentSourceTypeToTreeNode(documentSourceType)
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

  protected editDocumentSourceType(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa del tipo de documento seleccionado.'
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
        'Revisa los campos obligatorios antes de guardar el tipo de documento.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(
          this.updateDocumentSourceTypeUseCase.execute(this.editingId()!, payload)
        );
        this.showToast(
          'success',
          'Registro actualizado',
          'El tipo de documento se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createDocumentSourceTypeUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'El tipo de documento se creo correctamente.'
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

  protected async deleteDocumentSourceType(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar este tipo de documento? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteDocumentSourceTypeUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'El tipo de documento fue eliminado correctamente.'
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

  protected async restoreDocumentSourceType(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar este tipo de documento eliminado?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreDocumentSourceTypeUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'El tipo de documento fue restaurado correctamente.'
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
      'Se recargo la informacion de tipos de documentos desde la API.'
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

  private patchForm(documentSourceType: DocumentSourceType): void {
    this.form.reset({
      code: documentSourceType.code,
      name: documentSourceType.name,
      description: documentSourceType.description,
      generatesAccounting: documentSourceType.generatesAccounting,
      manualEntry: documentSourceType.manualEntry,
      requiresApproval: documentSourceType.requiresApproval,
      requiresThird: documentSourceType.requiresThird,
      requiresCeco: documentSourceType.requiresCeco,
      affectsInventory: documentSourceType.affectsInventory,
      affectsCartera: documentSourceType.affectsCartera,
      affectsCxp: documentSourceType.affectsCxp,
      affectsTreasury: documentSourceType.affectsTreasury,
      allowsReversal: documentSourceType.allowsReversal
    });
  }

  private resetForm(): void {
    this.form.reset({
      code: '',
      name: '',
      description: '',
      generatesAccounting: false,
      manualEntry: false,
      requiresApproval: false,
      requiresThird: false,
      requiresCeco: false,
      affectsInventory: false,
      affectsCartera: false,
      affectsCxp: false,
      affectsTreasury: false,
      allowsReversal: false
    });
  }

  private buildPayload(): DocumentSourceTypePayload {
    const value = this.form.getRawValue();

    return {
      code: value.code?.trim() ?? '',
      name: value.name?.trim() ?? '',
      description: value.description?.trim() ?? '',
      generatesAccounting: value.generatesAccounting ?? false,
      manualEntry: value.manualEntry ?? false,
      requiresApproval: value.requiresApproval ?? false,
      requiresThird: value.requiresThird ?? false,
      requiresCeco: value.requiresCeco ?? false,
      affectsInventory: value.affectsInventory ?? false,
      affectsCartera: value.affectsCartera ?? false,
      affectsCxp: value.affectsCxp ?? false,
      affectsTreasury: value.affectsTreasury ?? false,
      allowsReversal: value.allowsReversal ?? false
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

  private mapDocumentSourceTypeToTreeNode(
    documentSourceType: DocumentSourceType
  ): TreeNode<DocumentSourceTypeGridRow> {
    return {
      data: {
        id: documentSourceType.id,
        code: documentSourceType.code,
        name: documentSourceType.name,
        description: documentSourceType.description,
        generatesAccounting: documentSourceType.generatesAccounting,
        manualEntry: documentSourceType.manualEntry,
        requiresApproval: documentSourceType.requiresApproval,
        requiresThird: documentSourceType.requiresThird,
        requiresCeco: documentSourceType.requiresCeco,
        affectsInventory: documentSourceType.affectsInventory,
        affectsCartera: documentSourceType.affectsCartera,
        affectsCxp: documentSourceType.affectsCxp,
        affectsTreasury: documentSourceType.affectsTreasury,
        allowsReversal: documentSourceType.allowsReversal,
        createdAt: documentSourceType.createdAt,
        updatedAt: documentSourceType.updatedAt,
        deletedAt: documentSourceType.deletedAt
      }
    };
  }
}
