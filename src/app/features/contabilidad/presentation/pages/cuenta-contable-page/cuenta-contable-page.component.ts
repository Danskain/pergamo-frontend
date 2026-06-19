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

import { CreateAccountingAccountUseCase } from '../../../application/use-cases/create-accounting-account.use-case';
import { DeleteAccountingAccountUseCase } from '../../../application/use-cases/delete-accounting-account.use-case';
import { GetAccountingAccountDetailUseCase } from '../../../application/use-cases/get-accounting-account-detail.use-case';
import { ListAccountingAccountsUseCase } from '../../../application/use-cases/list-accounting-accounts.use-case';
import { RestoreAccountingAccountUseCase } from '../../../application/use-cases/restore-accounting-account.use-case';
import { UpdateAccountingAccountUseCase } from '../../../application/use-cases/update-accounting-account.use-case';
import { SelectOption } from '../../../domain/models/accounting-select-option.model';
import { injectAccountingCatalogOptions } from '../../form-support/inject-accounting-catalog-options';
import {
  AccountingAccount,
  AccountingAccountPage,
  AccountingAccountPayload
} from '../../../domain/models/accounting-account.model';
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

type AccountingAccountGridRow = {
  id: number;
  account: string;
  name: string;
  chartAccountName: string;
  accountClassName: string;
  typesAccountName: string;
  accountingGroupName: string;
  allowsManualTransactions: boolean;
  associatedAccount: boolean;
  acceptsTaxes: boolean;
  foreignCurrency: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

@Component({
  selector: 'app-cuenta-contable-page',
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
  templateUrl: './cuenta-contable-page.component.html',
  styleUrl: './cuenta-contable-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuentaContablePageComponent {
  private static readonly FORM_CATALOGS = [
    'chart_accounts',
    'account_class',
    'types_accounts',
    'accounting_groups'
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
  ) as NbTreeGridDataSourceBuilder<AccountingAccountGridRow>;
  private readonly listAccountingAccountsUseCase = inject(ListAccountingAccountsUseCase);
  private readonly getAccountingAccountDetailUseCase = inject(
    GetAccountingAccountDetailUseCase
  );
  private readonly createAccountingAccountUseCase = inject(CreateAccountingAccountUseCase);
  private readonly updateAccountingAccountUseCase = inject(UpdateAccountingAccountUseCase);
  private readonly deleteAccountingAccountUseCase = inject(DeleteAccountingAccountUseCase);
  private readonly restoreAccountingAccountUseCase = inject(RestoreAccountingAccountUseCase);
  private readonly accountingCatalogOptions = injectAccountingCatalogOptions(
    CuentaContablePageComponent.FORM_CATALOGS,
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
    'account',
    'chartAccountName',
    'accountClassName',
    'typesAccountName',
    'accountingGroupName',
    'allowsManualTransactions',
    'associatedAccount',
    'acceptsTaxes',
    'foreignCurrency',
    'createdAt',
    'actions'
  ];
  protected readonly treeGridAllColumns = [
    this.treeGridCustomColumn,
    ...applyCrudColumnPolicy(this.treeGridColumns)
  ];
  protected readonly treeGridDataSource = signal<
    NbTreeGridDataSource<AccountingAccountGridRow>
  >(this.treeGridDataSourceBuilder.create([] as TreeNode<AccountingAccountGridRow>[]));

  protected readonly form = this.formBuilder.group({
    account: ['', [Validators.required, Validators.maxLength(255)]],
    chartAccountId: [null as number | null, [Validators.required, Validators.min(1)]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    accountClassId: [null as number | null, [Validators.required, Validators.min(1)]],
    typesAccountId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountingGroupId: [null as number | null, [Validators.required, Validators.min(1)]],
    allowsManualTransactions: [false],
    associatedAccount: [false],
    acceptsTaxes: [false],
    foreignCurrency: [false]
  });

  protected readonly accountingAccountsResource = rxResource<
    AccountingAccountPage,
    { page: number; perPage: number; refreshTick: number }
  >({
    params: () => ({
      page: this.page(),
      perPage: this.perPage(),
      refreshTick: this.refreshTick()
    }),
    stream: ({ params }) =>
      this.listAccountingAccountsUseCase.execute(params.page, params.perPage)
  });

  protected readonly selectedAccountingAccountResource = rxResource<
    AccountingAccount | null,
    { id: number | null; refreshTick: number }
  >({
    params: () => ({
      id: this.editingId(),
      refreshTick: this.detailRefreshTick()
    }),
    stream: ({ params }) =>
      params.id ? this.getAccountingAccountDetailUseCase.execute(params.id) : of(null),
    defaultValue: null
  });
  protected readonly selectOptionsResource = this.accountingCatalogOptions.resource;

  protected readonly accountingAccountPage = computed<AccountingAccountPage | null>(
    () => this.accountingAccountsResource.value() ?? null
  );
  protected readonly accountingAccounts = computed<AccountingAccount[]>(
    () => this.accountingAccountPage()?.items ?? []
  );
  protected readonly pagination = computed(() => {
    const page = this.accountingAccountPage();

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
  protected readonly chartAccountOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('chart_accounts');
  protected readonly accountClassOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('account_class');
  protected readonly typesAccountOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('types_accounts');
  protected readonly accountingGroupOptions: () => Array<SelectOption<Record<string, unknown>>> =
    this.accountingCatalogOptions.optionsFor('accounting_groups');
  protected readonly isEditing = computed(() => this.editingId() !== null);
  protected readonly formTitle = computed(() =>
    this.isEditing() ? 'Editar cuenta contable' : 'Nueva cuenta contable'
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
      const accountingAccount = this.selectedAccountingAccountResource.value();

      if (!accountingAccount) {
        return;
      }

      this.patchForm(accountingAccount);
    });

    effect(() => {
      const nodes = this.accountingAccounts().map((accountingAccount) =>
        this.mapAccountingAccountToTreeNode(accountingAccount)
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

  protected editAccountingAccount(id: number): void {
    this.showForm.set(true);
    this.showToast(
      'info',
      'Cargando detalle',
      'Se esta cargando la informacion completa de la cuenta contable seleccionada.'
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
        'Revisa los campos obligatorios antes de guardar la cuenta contable.'
      );
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);

    try {
      if (this.isEditing() && this.editingId()) {
        await firstValueFrom(
          this.updateAccountingAccountUseCase.execute(this.editingId()!, payload)
        );
        this.showToast(
          'success',
          'Registro actualizado',
          'La cuenta contable se actualizo correctamente.'
        );
      } else {
        await firstValueFrom(this.createAccountingAccountUseCase.execute(payload));
        this.showToast(
          'success',
          'Registro creado',
          'La cuenta contable se creo correctamente.'
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

  protected async deleteAccountingAccount(id: number): Promise<void> {
    const confirmed = confirm(
      'Deseas eliminar esta cuenta contable? Esta accion no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);

    try {
      await firstValueFrom(this.deleteAccountingAccountUseCase.execute(id));
      this.showToast(
        'success',
        'Registro eliminado',
        'La cuenta contable fue eliminada correctamente.'
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

  protected async restoreAccountingAccount(id: number): Promise<void> {
    const confirmed = confirm('Deseas restaurar esta cuenta contable eliminada?');

    if (!confirmed) {
      return;
    }

    this.restoringId.set(id);

    try {
      await firstValueFrom(this.restoreAccountingAccountUseCase.execute(id));
      this.showToast(
        'success',
        'Registro restaurado',
        'La cuenta contable fue restaurada correctamente.'
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
      'Se recargo la informacion de cuentas contables desde la API.'
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

  private patchForm(accountingAccount: AccountingAccount): void {
    this.form.reset({
      account: accountingAccount.account,
      chartAccountId: accountingAccount.chartAccountId,
      name: accountingAccount.name,
      accountClassId: accountingAccount.accountClassId,
      typesAccountId: accountingAccount.typesAccountId,
      accountingGroupId: accountingAccount.accountingGroupId,
      allowsManualTransactions: accountingAccount.allowsManualTransactions,
      associatedAccount: accountingAccount.associatedAccount,
      acceptsTaxes: accountingAccount.acceptsTaxes,
      foreignCurrency: accountingAccount.foreignCurrency
    });
  }

  private resetForm(): void {
    this.form.reset({
      account: '',
      chartAccountId: null,
      name: '',
      accountClassId: null,
      typesAccountId: null,
      accountingGroupId: null,
      allowsManualTransactions: false,
      associatedAccount: false,
      acceptsTaxes: false,
      foreignCurrency: false
    });
  }

  private buildPayload(): AccountingAccountPayload {
    const value = this.form.getRawValue();

    return {
      account: value.account?.trim() ?? '',
      chartAccountId: value.chartAccountId ?? 0,
      name: value.name?.trim() ?? '',
      accountClassId: value.accountClassId ?? 0,
      typesAccountId: value.typesAccountId ?? 0,
      accountingGroupId: value.accountingGroupId ?? 0,
      allowsManualTransactions: value.allowsManualTransactions ?? false,
      associatedAccount: value.associatedAccount ?? false,
      acceptsTaxes: value.acceptsTaxes ?? false,
      foreignCurrency: value.foreignCurrency ?? false
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

  private mapAccountingAccountToTreeNode(
    accountingAccount: AccountingAccount
  ): TreeNode<AccountingAccountGridRow> {
    return {
      data: {
        id: accountingAccount.id,
        account: accountingAccount.account,
        name: accountingAccount.name,
        chartAccountName:
          accountingAccount.chartAccount?.name ?? `Id ${accountingAccount.chartAccountId}`,
        accountClassName:
          accountingAccount.accountClass?.name ?? `Id ${accountingAccount.accountClassId}`,
        typesAccountName:
          accountingAccount.typesAccount?.name ?? `Id ${accountingAccount.typesAccountId}`,
        accountingGroupName:
          accountingAccount.accountingGroup?.name ?? `Id ${accountingAccount.accountingGroupId}`,
        allowsManualTransactions: accountingAccount.allowsManualTransactions,
        associatedAccount: accountingAccount.associatedAccount,
        acceptsTaxes: accountingAccount.acceptsTaxes,
        foreignCurrency: accountingAccount.foreignCurrency,
        createdAt: accountingAccount.createdAt,
        updatedAt: accountingAccount.updatedAt,
        deletedAt: accountingAccount.deletedAt
      }
    };
  }
}
