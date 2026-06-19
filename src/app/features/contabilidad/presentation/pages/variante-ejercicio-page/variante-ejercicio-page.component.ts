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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
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
  NbTreeGridModule,
  NbToggleModule
} from '@nebular/theme';

import { CreateExerciseVariationUseCase } from '../../../application/use-cases/create-exercise-variation.use-case';
import { DeleteExerciseVariationUseCase } from '../../../application/use-cases/delete-exercise-variation.use-case';
import { GetExerciseVariationDetailUseCase } from '../../../application/use-cases/get-exercise-variation-detail.use-case';
import { GetMonthsUseCase } from '../../../application/use-cases/get-months.use-case';
import { ListExerciseVariationsUseCase } from '../../../application/use-cases/list-exercise-variations.use-case';
import { UpdateExerciseVariationUseCase } from '../../../application/use-cases/update-exercise-variation.use-case';
import {
  ExerciseVariation,
  ExerciseVariationPage,
  ExerciseVariationPayload
} from '../../../domain/models/exercise-variation.model';
import { Month } from '../../../domain/models/month.model';
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

type ExerciseVariationGridRow = {
  id: number;
  code: string;
  name: string;
  description: string;
  startMonth: string;
  endMonth: string;
  startExercise: number;
  endExercise: number;
  normalPeriods: number;
  specialPeriods: number;
  calendarDependent: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-variante-ejercicio-page',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbTreeGridModule,
    NbToggleModule,
    CrudCollectionShellComponent,
    CrudPageHeroComponent,
    CrudSectionCardComponent
  ],
  templateUrl: './variante-ejercicio-page.component.html',
  styleUrl: './variante-ejercicio-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VarianteEjercicioPageComponent {
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
  ) as NbTreeGridDataSourceBuilder<ExerciseVariationGridRow>;
  private readonly getMonthsUseCase = inject(GetMonthsUseCase);
  private readonly listExerciseVariationsUseCase = inject(ListExerciseVariationsUseCase);
  private readonly getExerciseVariationDetailUseCase = inject(
    GetExerciseVariationDetailUseCase
  );
  private readonly createExerciseVariationUseCase = inject(
    CreateExerciseVariationUseCase
  );
  private readonly updateExerciseVariationUseCase = inject(
    UpdateExerciseVariationUseCase
  );
  private readonly deleteExerciseVariationUseCase = inject(
    DeleteExerciseVariationUseCase
  );

  private readonly refreshTick = signal(0);
  private readonly monthsRefreshTick = signal(0);
  private readonly detailRefreshTick = signal(0);
  protected readonly page = signal(1);
  protected readonly perPage = signal(28);
  protected readonly editingId = signal<number | null>(null);
  protected readonly showForm = signal(false);
  protected readonly submitting = signal(false);
  protected readonly deletingId = signal<number | null>(null);
  protected readonly sortDirection = signal<NbSortDirection>(NbSortDirection.NONE);
  protected readonly sortColumn = signal('');
  protected readonly treeGridCustomColumn = 'name';
  protected readonly treeGridColumns = [
    'id',
    'code',
    'description',
    'startMonth',
    'endMonth',
    'startExercise',
    'endExercise',
    'normalPeriods',
    'specialPeriods',
    'calendarDependent',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<
    NbTreeGridDataSource<ExerciseVariationGridRow>
  >(this.treeGridDataSourceBuilder.create([] as TreeNode<ExerciseVariationGridRow>[]));

  protected readonly form = this.formBuilder.group({
    code: ['', [Validators.required, Validators.maxLength(10)]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    startExercise: [null as number | null, [Validators.required, Validators.min(1), Validators.max(12)]],
    endExercise: [null as number | null, [Validators.required, Validators.min(1), Validators.max(12)]],
    normalPeriods: [null as number | null, [Validators.required, Validators.min(1), Validators.max(24)]],
    specialPeriods: [null as number | null, [Validators.required, Validators.min(0), Validators.max(24)]],
    calendarDependent: [false],
    description: ['', [Validators.required, Validators.maxLength(255)]]
  });

  protected readonly monthsResource = rxResource<Month[], number>({
    params: () => this.monthsRefreshTick(),
    stream: () => this.getMonthsUseCase.execute(),
    defaultValue: []
  });

  protected readonly variationsResource = rxResource<
    ExerciseVariationPage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) =>
      this.listExerciseVariationsUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedVariationResource = rxResource<
    ExerciseVariation | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id
        ? this.getExerciseVariationDetailUseCase.execute(params.id)
        : of(null),
    defaultValue: null
  });

  protected readonly months = computed<Month[]>(
    () => this.monthsResource.value()
  );
  protected readonly variationPage = computed<ExerciseVariationPage | null>(
    () => this.variationsResource.value() ?? null
  );
  protected readonly variations = computed<ExerciseVariation[]>(
    () => this.variationPage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.variationPage();

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
    this.isEditing() ? 'Editar variante' : 'Nueva variante'
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
      const variation = this.selectedVariationResource.value();

      if (!variation) {
        return;
      }

      this.patchForm(variation);
    });

    effect(() => {
      const nodes = this.variations().map((variation) =>
        this.mapVariationToTreeNode(variation)
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

  protected editVariation(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa del registro seleccionado.'
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
        'Revisa los campos obligatorios antes de guardar la variante de ejercicio.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(
          this.updateExerciseVariationUseCase.execute(this.editingId()!, payload)
        );
        this.showToast(
          'success',
          'Registro actualizado',
          'La variante de ejercicio se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createExerciseVariationUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'La variante de ejercicio se creo correctamente.'
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

  protected async deleteVariation(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar esta variante de ejercicio? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteExerciseVariationUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'La variante de ejercicio fue eliminada correctamente.'
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

  protected refreshData(): void {
    this.reloadList();
    this.monthsRefreshTick.update((value) => value + 1);
    this.showToast(
      'info',
      'Datos actualizados',
      'Se recargo la informacion de meses y variantes desde la API.'
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

  protected getMonthName(monthId: number): string {
    return this.months().find((month) => month.id === monthId)?.name ?? '-';
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

  private patchForm(variation: ExerciseVariation): void {
    this.form.reset({
      code: variation.code,
      name: variation.name,
      startExercise: variation.startExercise,
      endExercise: variation.endExercise,
      normalPeriods: variation.normalPeriods,
      specialPeriods: variation.specialPeriods,
      calendarDependent: variation.calendarDependent,
      description: variation.description
    });
  }

  private resetForm(): void {
    this.form.reset({
      code: '',
      name: '',
      startExercise: null,
      endExercise: null,
      normalPeriods: null,
      specialPeriods: null,
      calendarDependent: false,
      description: ''
    });
  }

  private buildPayload(): ExerciseVariationPayload {
    const value = this.form.getRawValue();

    return {
      code: value.code?.trim() ?? '',
      name: value.name?.trim() ?? '',
      startExercise: value.startExercise ?? 0,
      endExercise: value.endExercise ?? 0,
      normalPeriods: value.normalPeriods ?? 0,
      specialPeriods: value.specialPeriods ?? 0,
      calendarDependent: value.calendarDependent ?? false,
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

  private mapVariationToTreeNode(
    variation: ExerciseVariation
  ): TreeNode<ExerciseVariationGridRow> {
    return {
      data: {
        id: variation.id,
        code: variation.code,
        name: variation.name,
        description: variation.description,
        startMonth:
          variation.startMonth?.name ?? this.getMonthName(variation.startExercise),
        endMonth: variation.endMonth?.name ?? this.getMonthName(variation.endExercise),
        startExercise: variation.startExercise,
        endExercise: variation.endExercise,
        normalPeriods: variation.normalPeriods,
        specialPeriods: variation.specialPeriods,
        calendarDependent: variation.calendarDependent,
        createdAt: variation.createdAt,
        updatedAt: variation.updatedAt,
        deletedAt: variation.deletedAt
      }
    };
  }
}
