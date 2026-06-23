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
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbTreeGridModule
} from '@nebular/theme';

import { CreateAccountingEventUseCase } from '../../../application/use-cases/create-accounting-event.use-case';
import { DeleteAccountingEventUseCase } from '../../../application/use-cases/delete-accounting-event.use-case';
import { GetAccountingEventDetailUseCase } from '../../../application/use-cases/get-accounting-event-detail.use-case';
import { ListAccountingEventsUseCase } from '../../../application/use-cases/list-accounting-events.use-case';
import { RestoreAccountingEventUseCase } from '../../../application/use-cases/restore-accounting-event.use-case';
import { UpdateAccountingEventUseCase } from '../../../application/use-cases/update-accounting-event.use-case';
import { SelectOption } from '../../../domain/models/accounting-select-option.model';
import {
  AccountingEvent,
  AccountingEventPage,
  AccountingEventPayload
} from '../../../domain/models/accounting-event.model';
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

type AccountingEventGridRow = {
  id: number;
  code: string;
  name: string;
  accountingMomentName: string;
  origin: string;
  createdAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-evento-contable-page',
  imports: [
    DatePipe,
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
  templateUrl: './evento-contable-page.component.html',
  styleUrl: './evento-contable-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventoContablePageComponent {
  private static readonly FORM_CATALOGS = ['accounting_moments'];

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
  ) as NbTreeGridDataSourceBuilder<AccountingEventGridRow>;
  private readonly listAccountingEventsUseCase = inject(ListAccountingEventsUseCase);
  private readonly getAccountingEventDetailUseCase = inject(GetAccountingEventDetailUseCase);
  private readonly createAccountingEventUseCase = inject(CreateAccountingEventUseCase);
  private readonly updateAccountingEventUseCase = inject(UpdateAccountingEventUseCase);
  private readonly deleteAccountingEventUseCase = inject(DeleteAccountingEventUseCase);
  private readonly restoreAccountingEventUseCase = inject(RestoreAccountingEventUseCase);
  private readonly accountingCatalogOptions = injectAccountingCatalogOptions(
    EventoContablePageComponent.FORM_CATALOGS,
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
    'accountingMomentName',
    'origin',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<NbTreeGridDataSource<AccountingEventGridRow>>(
    this.treeGridDataSourceBuilder.create([] as TreeNode<AccountingEventGridRow>[])
  );

  protected readonly form = this.formBuilder.group({
    code: ['', [Validators.required, Validators.maxLength(255)]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    accountingMomentId: [null as number | null, [Validators.required, Validators.min(1)]],
    origin: ['', [Validators.required, Validators.maxLength(255)]]
  });

  protected readonly accountingEventsResource = rxResource<
    AccountingEventPage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) => this.listAccountingEventsUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedAccountingEventResource = rxResource<
    AccountingEvent | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getAccountingEventDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });
  protected readonly selectOptionsResource = this.accountingCatalogOptions.resource;

  protected readonly accountingEventPage = computed<AccountingEventPage | null>(
    () => this.accountingEventsResource.value() ?? null
  );
  protected readonly accountingEvents = computed<AccountingEvent[]>(
    () => this.accountingEventPage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.accountingEventPage();

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
  protected readonly accountingMomentOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('accounting_moments');
  protected readonly isEditing = computed(() => this.editingId() !== null);
  protected readonly formTitle = computed(() =>
    this.isEditing() ? 'Editar evento contable' : 'Nuevo evento contable'
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
      const accountingEvent = this.selectedAccountingEventResource.value();

      if (!accountingEvent) {
        return;
      }

      this.patchForm(accountingEvent);
    });

    effect(() => {
      const nodes = this.accountingEvents().map((accountingEvent) =>
        this.mapAccountingEventToTreeNode(accountingEvent)
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

  protected editAccountingEvent(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa del evento contable seleccionado.'
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
        'Revisa los campos obligatorios antes de guardar el evento contable.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(
          this.updateAccountingEventUseCase.execute(this.editingId()!, payload)
        );
        this.showToast(
          'success',
          'Registro actualizado',
          'El evento contable se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createAccountingEventUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'El evento contable se creo correctamente.'
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

  protected async deleteAccountingEvent(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar este evento contable? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteAccountingEventUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'El evento contable fue eliminado correctamente.'
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

  protected async restoreAccountingEvent(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar este evento contable eliminado?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreAccountingEventUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'El evento contable fue restaurado correctamente.'
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
      'Se recargo la informacion de eventos contables y catalogos desde la API.'
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

  private patchForm(accountingEvent: AccountingEvent): void {
    this.form.reset({
      code: accountingEvent.code,
      name: accountingEvent.name,
      accountingMomentId: accountingEvent.accountingMomentId,
      origin: accountingEvent.origin
    });
  }

  private resetForm(): void {
    this.form.reset({
      code: '',
      name: '',
      accountingMomentId: null,
      origin: ''
    });
  }

  private buildPayload(): AccountingEventPayload {
    const value = this.form.getRawValue();

    return {
      code: value.code?.trim() ?? '',
      name: value.name?.trim() ?? '',
      accountingMomentId: value.accountingMomentId ?? 0,
      origin: value.origin?.trim() ?? ''
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

  private mapAccountingEventToTreeNode(
    accountingEvent: AccountingEvent
  ): TreeNode<AccountingEventGridRow> {
    return {
      data: {
        id: accountingEvent.id,
        code: accountingEvent.code,
        name: accountingEvent.name,
        accountingMomentName:
          accountingEvent.accountingMoment?.label ??
          accountingEvent.accountingMoment?.name ??
          `Id ${accountingEvent.accountingMomentId}`,
        origin: accountingEvent.origin,
        createdAt: accountingEvent.createdAt,
        deletedAt: accountingEvent.deletedAt
      }
    };
  }
}
