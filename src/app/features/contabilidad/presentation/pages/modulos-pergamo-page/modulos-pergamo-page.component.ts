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

import { CreatePergamoModuleUseCase } from '../../../application/use-cases/create-pergamo-module.use-case';
import { DeletePergamoModuleUseCase } from '../../../application/use-cases/delete-pergamo-module.use-case';
import { GetPergamoModuleDetailUseCase } from '../../../application/use-cases/get-pergamo-module-detail.use-case';
import { ListPergamoModulesUseCase } from '../../../application/use-cases/list-pergamo-modules.use-case';
import { RestorePergamoModuleUseCase } from '../../../application/use-cases/restore-pergamo-module.use-case';
import { UpdatePergamoModuleUseCase } from '../../../application/use-cases/update-pergamo-module.use-case';
import {
  PergamoModule,
  PergamoModulePage,
  PergamoModulePayload
} from '../../../domain/models/pergamo-module.model';
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

type PergamoModuleGridRow = {
  id: number;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-modulos-pergamo-page',
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
  templateUrl: './modulos-pergamo-page.component.html',
  styleUrl: './modulos-pergamo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModulosPergamoPageComponent {
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
  ) as NbTreeGridDataSourceBuilder<PergamoModuleGridRow>;
  private readonly listPergamoModulesUseCase = inject(ListPergamoModulesUseCase);
  private readonly getPergamoModuleDetailUseCase = inject(GetPergamoModuleDetailUseCase);
  private readonly createPergamoModuleUseCase = inject(CreatePergamoModuleUseCase);
  private readonly updatePergamoModuleUseCase = inject(UpdatePergamoModuleUseCase);
  private readonly deletePergamoModuleUseCase = inject(DeletePergamoModuleUseCase);
  private readonly restorePergamoModuleUseCase = inject(RestorePergamoModuleUseCase);

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
    NbTreeGridDataSource<PergamoModuleGridRow>
  >(this.treeGridDataSourceBuilder.create([] as TreeNode<PergamoModuleGridRow>[]));

  protected readonly form = this.formBuilder.group({
    code: ['', [Validators.required, Validators.maxLength(255)]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required]]
  });

  protected readonly pergamoModulesResource = rxResource<
    PergamoModulePage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) =>
      this.listPergamoModulesUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedPergamoModuleResource = rxResource<
    PergamoModule | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getPergamoModuleDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });

  protected readonly pergamoModulePage = computed<PergamoModulePage | null>(
    () => this.pergamoModulesResource.value() ?? null
  );
  protected readonly pergamoModules = computed<PergamoModule[]>(
    () => this.pergamoModulePage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.pergamoModulePage();

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
    this.isEditing() ? 'Editar modulo Pergamo' : 'Nuevo modulo Pergamo'
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
      const pergamoModule = this.selectedPergamoModuleResource.value();

      if (!pergamoModule) {
        return;
      }

      this.patchForm(pergamoModule);
    });

    effect(() => {
      const nodes = this.pergamoModules().map((pergamoModule) =>
        this.mapPergamoModuleToTreeNode(pergamoModule)
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

  protected editPergamoModule(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa del modulo Pergamo seleccionado.'
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
        'Revisa los campos obligatorios antes de guardar el modulo Pergamo.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(
          this.updatePergamoModuleUseCase.execute(this.editingId()!, payload)
        );
        this.showToast(
          'success',
          'Registro actualizado',
          'El modulo Pergamo se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createPergamoModuleUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'El modulo Pergamo se creo correctamente.'
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

  protected async deletePergamoModule(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar este modulo Pergamo? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deletePergamoModuleUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'El modulo Pergamo fue eliminado correctamente.'
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

  protected async restorePergamoModule(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar este modulo Pergamo eliminado?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restorePergamoModuleUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'El modulo Pergamo fue restaurado correctamente.'
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
      'Se recargo la informacion de modulos Pergamo desde la API.'
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

  private patchForm(pergamoModule: PergamoModule): void {
    this.form.reset({
      code: pergamoModule.code,
      name: pergamoModule.name,
      description: pergamoModule.description
    });
  }

  private resetForm(): void {
    this.form.reset({
      code: '',
      name: '',
      description: ''
    });
  }

  private buildPayload(): PergamoModulePayload {
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

  private mapPergamoModuleToTreeNode(
    pergamoModule: PergamoModule
  ): TreeNode<PergamoModuleGridRow> {
    return {
      data: {
        id: pergamoModule.id,
        code: pergamoModule.code,
        name: pergamoModule.name,
        description: pergamoModule.description,
        createdAt: pergamoModule.createdAt,
        updatedAt: pergamoModule.updatedAt,
        deletedAt: pergamoModule.deletedAt
      }
    };
  }
}
