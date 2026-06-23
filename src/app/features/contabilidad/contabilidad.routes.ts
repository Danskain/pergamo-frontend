import { Routes } from '@angular/router';

import { ACCOUNTING_SELECT_OPTIONS_REPOSITORY } from './application/ports/accounting-select-options.repository';
import { ACCOUNTING_NATURE_REPOSITORY } from './application/ports/accounting-nature.repository';
import { ACCOUNTING_STANDARD_REPOSITORY } from './application/ports/accounting-standard.repository';
import { ACCOUNT_CLASS_REPOSITORY } from './application/ports/account-class.repository';
import { ACCOUNTING_ACCOUNT_REPOSITORY } from './application/ports/accounting-account.repository';
import { ACCOUNTING_DOCUMENT_REPOSITORY } from './application/ports/accounting-document.repository';
import { ACCOUNTING_EVENT_REPOSITORY } from './application/ports/accounting-event.repository';
import { ACCOUNTING_ENTRY_HEADER_REPOSITORY } from './application/ports/accounting-entry-header.repository';
import { ACCOUNTING_ENTRY_POSITION_REPOSITORY } from './application/ports/accounting-entry-position.repository';
import { ACCOUNTING_GROUP_REPOSITORY } from './application/ports/accounting-group.repository';
import { ACCOUNTING_SCHEME_REPOSITORY } from './application/ports/accounting-scheme.repository';
import { ACCOUNTING_SUMMARY_REPOSITORY } from './application/ports/accounting-summary.repository';
import { BUSINESS_STRUCTURE_REPOSITORY } from './application/ports/business-structure.repository';
import { CHART_ACCOUNT_REPOSITORY } from './application/ports/chart-account.repository';
import { COST_CENTER_REPOSITORY } from './application/ports/cost-center.repository';
import { COST_CENTER_CLASS_REPOSITORY } from './application/ports/cost-center-class.repository';
import { COST_CENTER_NATURE_REPOSITORY } from './application/ports/cost-center-nature.repository';
import { KEY_OPERATION_REPOSITORY } from './application/ports/key-operation.repository';
import { DOCUMENT_SOURCE_REPOSITORY } from './application/ports/document-source.repository';
import { DOCUMENT_SOURCE_TYPE_REPOSITORY } from './application/ports/document-source-type.repository';
import { ACCOUNTING_MOMENT_REPOSITORY } from './application/ports/accounting-moment.repository';
import { COST_CENTER_TYPE_REPOSITORY } from './application/ports/cost-center-type.repository';
import { EXERCISE_VARIATION_REPOSITORY } from './application/ports/exercise-variation.repository';
import { FINANCIAL_STATEMENT_REPOSITORY } from './application/ports/financial-statement.repository';
import { PERGAMO_MODULE_REPOSITORY } from './application/ports/pergamo-module.repository';
import { REFERENCE_REPOSITORY } from './application/ports/reference.repository';
import { TYPE_ACCOUNT_REPOSITORY } from './application/ports/type-account.repository';
import { TYPE_PLAN_REPOSITORY } from './application/ports/type-plan.repository';
import { CreateAccountClassUseCase } from './application/use-cases/create-account-class.use-case';
import { CreateAccountingAccountUseCase } from './application/use-cases/create-accounting-account.use-case';
import { CreateAccountingDocumentUseCase } from './application/use-cases/create-accounting-document.use-case';
import { CreateAccountingEventUseCase } from './application/use-cases/create-accounting-event.use-case';
import { CreateAccountingEntryHeaderUseCase } from './application/use-cases/create-accounting-entry-header.use-case';
import { CreateAccountingEntryPositionUseCase } from './application/use-cases/create-accounting-entry-position.use-case';
import { CreateAccountingGroupUseCase } from './application/use-cases/create-accounting-group.use-case';
import { CreateAccountingMomentUseCase } from './application/use-cases/create-accounting-moment.use-case';
import { CreateAccountingNatureUseCase } from './application/use-cases/create-accounting-nature.use-case';
import { CreateAccountingSchemeUseCase } from './application/use-cases/create-accounting-scheme.use-case';
import { CreateAccountingStandardUseCase } from './application/use-cases/create-accounting-standard.use-case';
import { CreateBusinessStructureUseCase } from './application/use-cases/create-business-structure.use-case';
import { CreateCostCenterClassUseCase } from './application/use-cases/create-cost-center-class.use-case';
import { CreateCostCenterUseCase } from './application/use-cases/create-cost-center.use-case';
import { CreateCostCenterNatureUseCase } from './application/use-cases/create-cost-center-nature.use-case';
import { CreateCostCenterTypeUseCase } from './application/use-cases/create-cost-center-type.use-case';
import { CreateDocumentSourceUseCase } from './application/use-cases/create-document-source.use-case';
import { CreateDocumentSourceTypeUseCase } from './application/use-cases/create-document-source-type.use-case';
import { CreateFinancialStatementUseCase } from './application/use-cases/create-financial-statement.use-case';
import { CreateKeyOperationUseCase } from './application/use-cases/create-key-operation.use-case';
import { CreatePergamoModuleUseCase } from './application/use-cases/create-pergamo-module.use-case';
import { CreateReferenceUseCase } from './application/use-cases/create-reference.use-case';
import { CreateTypeAccountUseCase } from './application/use-cases/create-type-account.use-case';
import { GetAccountingSelectOptionsUseCase } from './application/use-cases/get-accounting-select-options.use-case';
import { DeleteAccountClassUseCase } from './application/use-cases/delete-account-class.use-case';
import { DeleteAccountingAccountUseCase } from './application/use-cases/delete-accounting-account.use-case';
import { DeleteAccountingDocumentUseCase } from './application/use-cases/delete-accounting-document.use-case';
import { DeleteAccountingEventUseCase } from './application/use-cases/delete-accounting-event.use-case';
import { DeleteAccountingEntryHeaderUseCase } from './application/use-cases/delete-accounting-entry-header.use-case';
import { DeleteAccountingEntryPositionUseCase } from './application/use-cases/delete-accounting-entry-position.use-case';
import { DeleteAccountingGroupUseCase } from './application/use-cases/delete-accounting-group.use-case';
import { DeleteAccountingMomentUseCase } from './application/use-cases/delete-accounting-moment.use-case';
import { DeleteAccountingNatureUseCase } from './application/use-cases/delete-accounting-nature.use-case';
import { DeleteAccountingSchemeUseCase } from './application/use-cases/delete-accounting-scheme.use-case';
import { DeleteAccountingStandardUseCase } from './application/use-cases/delete-accounting-standard.use-case';
import { DeleteBusinessStructureUseCase } from './application/use-cases/delete-business-structure.use-case';
import { DeleteCostCenterClassUseCase } from './application/use-cases/delete-cost-center-class.use-case';
import { DeleteCostCenterUseCase } from './application/use-cases/delete-cost-center.use-case';
import { DeleteCostCenterNatureUseCase } from './application/use-cases/delete-cost-center-nature.use-case';
import { DeleteCostCenterTypeUseCase } from './application/use-cases/delete-cost-center-type.use-case';
import { DeleteDocumentSourceUseCase } from './application/use-cases/delete-document-source.use-case';
import { DeleteDocumentSourceTypeUseCase } from './application/use-cases/delete-document-source-type.use-case';
import { DeleteFinancialStatementUseCase } from './application/use-cases/delete-financial-statement.use-case';
import { DeleteKeyOperationUseCase } from './application/use-cases/delete-key-operation.use-case';
import { DeletePergamoModuleUseCase } from './application/use-cases/delete-pergamo-module.use-case';
import { DeleteReferenceUseCase } from './application/use-cases/delete-reference.use-case';
import { DeleteTypeAccountUseCase } from './application/use-cases/delete-type-account.use-case';
import { GetAccountClassDetailUseCase } from './application/use-cases/get-account-class-detail.use-case';
import { GetAccountingAccountDetailUseCase } from './application/use-cases/get-accounting-account-detail.use-case';
import { GetAccountingDocumentDetailUseCase } from './application/use-cases/get-accounting-document-detail.use-case';
import { GetAccountingEventDetailUseCase } from './application/use-cases/get-accounting-event-detail.use-case';
import { GetAccountingEntryHeaderDetailUseCase } from './application/use-cases/get-accounting-entry-header-detail.use-case';
import { GetAccountingEntryPositionDetailUseCase } from './application/use-cases/get-accounting-entry-position-detail.use-case';
import { GetAccountingGroupDetailUseCase } from './application/use-cases/get-accounting-group-detail.use-case';
import { GetAccountingMomentDetailUseCase } from './application/use-cases/get-accounting-moment-detail.use-case';
import { GetAccountingNatureDetailUseCase } from './application/use-cases/get-accounting-nature-detail.use-case';
import { GetAccountingSchemeDetailUseCase } from './application/use-cases/get-accounting-scheme-detail.use-case';
import { GetAccountingStandardDetailUseCase } from './application/use-cases/get-accounting-standard-detail.use-case';
import { GetBusinessStructureDetailUseCase } from './application/use-cases/get-business-structure-detail.use-case';
import { GetCostCenterClassDetailUseCase } from './application/use-cases/get-cost-center-class-detail.use-case';
import { GetCostCenterDetailUseCase } from './application/use-cases/get-cost-center-detail.use-case';
import { GetCostCenterNatureDetailUseCase } from './application/use-cases/get-cost-center-nature-detail.use-case';
import { GetCostCenterTypeDetailUseCase } from './application/use-cases/get-cost-center-type-detail.use-case';
import { GetDocumentSourceDetailUseCase } from './application/use-cases/get-document-source-detail.use-case';
import { GetDocumentSourceTypeDetailUseCase } from './application/use-cases/get-document-source-type-detail.use-case';
import { GetFinancialStatementDetailUseCase } from './application/use-cases/get-financial-statement-detail.use-case';
import { GetKeyOperationDetailUseCase } from './application/use-cases/get-key-operation-detail.use-case';
import { GetPergamoModuleDetailUseCase } from './application/use-cases/get-pergamo-module-detail.use-case';
import { GetReferenceDetailUseCase } from './application/use-cases/get-reference-detail.use-case';
import { GetTypeAccountDetailUseCase } from './application/use-cases/get-type-account-detail.use-case';
import { CreateChartAccountUseCase } from './application/use-cases/create-chart-account.use-case';
import { DeleteChartAccountUseCase } from './application/use-cases/delete-chart-account.use-case';
import { GetChartAccountDetailUseCase } from './application/use-cases/get-chart-account-detail.use-case';
import { CreateExerciseVariationUseCase } from './application/use-cases/create-exercise-variation.use-case';
import { DeleteExerciseVariationUseCase } from './application/use-cases/delete-exercise-variation.use-case';
import { GetAccountingSummaryUseCase } from './application/use-cases/get-accounting-summary.use-case';
import { GetExerciseVariationDetailUseCase } from './application/use-cases/get-exercise-variation-detail.use-case';
import { GetMonthsUseCase } from './application/use-cases/get-months.use-case';
import { ListAccountClassesUseCase } from './application/use-cases/list-account-classes.use-case';
import { ListAccountingAccountsUseCase } from './application/use-cases/list-accounting-accounts.use-case';
import { ListAccountingDocumentsUseCase } from './application/use-cases/list-accounting-documents.use-case';
import { ListAccountingEventsUseCase } from './application/use-cases/list-accounting-events.use-case';
import { ListAccountingEntryHeadersUseCase } from './application/use-cases/list-accounting-entry-headers.use-case';
import { ListAccountingEntryPositionsUseCase } from './application/use-cases/list-accounting-entry-positions.use-case';
import { ListAccountingGroupsUseCase } from './application/use-cases/list-accounting-groups.use-case';
import { ListAccountingMomentsUseCase } from './application/use-cases/list-accounting-moments.use-case';
import { ListAccountingNaturesUseCase } from './application/use-cases/list-accounting-natures.use-case';
import { ListAccountingSchemesUseCase } from './application/use-cases/list-accounting-schemes.use-case';
import { ListBusinessStructuresUseCase } from './application/use-cases/list-business-structures.use-case';
import { ListCostCenterClassesUseCase } from './application/use-cases/list-cost-center-classes.use-case';
import { ListCostCentersUseCase } from './application/use-cases/list-cost-centers.use-case';
import { ListCostCenterNaturesUseCase } from './application/use-cases/list-cost-center-natures.use-case';
import { ListCostCenterTypesUseCase } from './application/use-cases/list-cost-center-types.use-case';
import { ListDocumentSourcesUseCase } from './application/use-cases/list-document-sources.use-case';
import { ListDocumentSourceTypesUseCase } from './application/use-cases/list-document-source-types.use-case';
import { ListFinancialStatementsUseCase } from './application/use-cases/list-financial-statements.use-case';
import { ListKeyOperationsUseCase } from './application/use-cases/list-key-operations.use-case';
import { ListPergamoModulesUseCase } from './application/use-cases/list-pergamo-modules.use-case';
import { ListReferencesUseCase } from './application/use-cases/list-references.use-case';
import { GetTypePlanDetailUseCase } from './application/use-cases/get-type-plan-detail.use-case';
import { ListAccountingStandardsUseCase } from './application/use-cases/list-accounting-standards.use-case';
import { ListChartAccountsUseCase } from './application/use-cases/list-chart-accounts.use-case';
import { ListExerciseVariationsUseCase } from './application/use-cases/list-exercise-variations.use-case';
import { ListTypeAccountsUseCase } from './application/use-cases/list-type-accounts.use-case';
import { ListTypePlansUseCase } from './application/use-cases/list-type-plans.use-case';
import { RestoreAccountClassUseCase } from './application/use-cases/restore-account-class.use-case';
import { RestoreAccountingAccountUseCase } from './application/use-cases/restore-accounting-account.use-case';
import { RestoreAccountingDocumentUseCase } from './application/use-cases/restore-accounting-document.use-case';
import { RestoreAccountingEventUseCase } from './application/use-cases/restore-accounting-event.use-case';
import { RestoreAccountingEntryHeaderUseCase } from './application/use-cases/restore-accounting-entry-header.use-case';
import { RestoreAccountingEntryPositionUseCase } from './application/use-cases/restore-accounting-entry-position.use-case';
import { RestoreAccountingGroupUseCase } from './application/use-cases/restore-accounting-group.use-case';
import { RestoreAccountingMomentUseCase } from './application/use-cases/restore-accounting-moment.use-case';
import { RestoreAccountingNatureUseCase } from './application/use-cases/restore-accounting-nature.use-case';
import { RestoreAccountingSchemeUseCase } from './application/use-cases/restore-accounting-scheme.use-case';
import { RestoreAccountingStandardUseCase } from './application/use-cases/restore-accounting-standard.use-case';
import { RestoreBusinessStructureUseCase } from './application/use-cases/restore-business-structure.use-case';
import { RestoreCostCenterClassUseCase } from './application/use-cases/restore-cost-center-class.use-case';
import { RestoreCostCenterUseCase } from './application/use-cases/restore-cost-center.use-case';
import { RestoreCostCenterNatureUseCase } from './application/use-cases/restore-cost-center-nature.use-case';
import { RestoreCostCenterTypeUseCase } from './application/use-cases/restore-cost-center-type.use-case';
import { RestoreDocumentSourceUseCase } from './application/use-cases/restore-document-source.use-case';
import { RestoreDocumentSourceTypeUseCase } from './application/use-cases/restore-document-source-type.use-case';
import { RestoreFinancialStatementUseCase } from './application/use-cases/restore-financial-statement.use-case';
import { RestoreKeyOperationUseCase } from './application/use-cases/restore-key-operation.use-case';
import { RestorePergamoModuleUseCase } from './application/use-cases/restore-pergamo-module.use-case';
import { RestoreReferenceUseCase } from './application/use-cases/restore-reference.use-case';
import { RestoreChartAccountUseCase } from './application/use-cases/restore-chart-account.use-case';
import { RestoreTypeAccountUseCase } from './application/use-cases/restore-type-account.use-case';
import { UpdateAccountClassUseCase } from './application/use-cases/update-account-class.use-case';
import { UpdateAccountingAccountUseCase } from './application/use-cases/update-accounting-account.use-case';
import { UpdateAccountingDocumentUseCase } from './application/use-cases/update-accounting-document.use-case';
import { UpdateAccountingEventUseCase } from './application/use-cases/update-accounting-event.use-case';
import { UpdateAccountingEntryHeaderUseCase } from './application/use-cases/update-accounting-entry-header.use-case';
import { UpdateAccountingEntryPositionUseCase } from './application/use-cases/update-accounting-entry-position.use-case';
import { UpdateAccountingGroupUseCase } from './application/use-cases/update-accounting-group.use-case';
import { UpdateAccountingMomentUseCase } from './application/use-cases/update-accounting-moment.use-case';
import { UpdateAccountingNatureUseCase } from './application/use-cases/update-accounting-nature.use-case';
import { UpdateAccountingSchemeUseCase } from './application/use-cases/update-accounting-scheme.use-case';
import { UpdateBusinessStructureUseCase } from './application/use-cases/update-business-structure.use-case';
import { UpdateCostCenterClassUseCase } from './application/use-cases/update-cost-center-class.use-case';
import { UpdateCostCenterUseCase } from './application/use-cases/update-cost-center.use-case';
import { UpdateCostCenterNatureUseCase } from './application/use-cases/update-cost-center-nature.use-case';
import { UpdateCostCenterTypeUseCase } from './application/use-cases/update-cost-center-type.use-case';
import { UpdateDocumentSourceUseCase } from './application/use-cases/update-document-source.use-case';
import { UpdateDocumentSourceTypeUseCase } from './application/use-cases/update-document-source-type.use-case';
import { UpdateFinancialStatementUseCase } from './application/use-cases/update-financial-statement.use-case';
import { UpdateKeyOperationUseCase } from './application/use-cases/update-key-operation.use-case';
import { UpdatePergamoModuleUseCase } from './application/use-cases/update-pergamo-module.use-case';
import { UpdateReferenceUseCase } from './application/use-cases/update-reference.use-case';
import { RestoreTypePlanUseCase } from './application/use-cases/restore-type-plan.use-case';
import { UpdateAccountingStandardUseCase } from './application/use-cases/update-accounting-standard.use-case';
import { UpdateChartAccountUseCase } from './application/use-cases/update-chart-account.use-case';
import { UpdateExerciseVariationUseCase } from './application/use-cases/update-exercise-variation.use-case';
import { UpdateTypeAccountUseCase } from './application/use-cases/update-type-account.use-case';
import { UpdateTypePlanUseCase } from './application/use-cases/update-type-plan.use-case';
import { CreateTypePlanUseCase } from './application/use-cases/create-type-plan.use-case';
import { DeleteTypePlanUseCase } from './application/use-cases/delete-type-plan.use-case';
import { HttpAccountClassRepository } from './infrastructure/adapters/http-account-class.repository';
import { HttpAccountingAccountRepository } from './infrastructure/adapters/http-accounting-account.repository';
import { HttpAccountingDocumentRepository } from './infrastructure/adapters/http-accounting-document.repository';
import { HttpAccountingEventRepository } from './infrastructure/adapters/http-accounting-event.repository';
import { HttpAccountingEntryHeaderRepository } from './infrastructure/adapters/http-accounting-entry-header.repository';
import { HttpAccountingEntryPositionRepository } from './infrastructure/adapters/http-accounting-entry-position.repository';
import { HttpAccountingGroupRepository } from './infrastructure/adapters/http-accounting-group.repository';
import { HttpAccountingMomentRepository } from './infrastructure/adapters/http-accounting-moment.repository';
import { HttpAccountingNatureRepository } from './infrastructure/adapters/http-accounting-nature.repository';
import { HttpAccountingSchemeRepository } from './infrastructure/adapters/http-accounting-scheme.repository';
import { HttpAccountingStandardRepository } from './infrastructure/adapters/http-accounting-standard.repository';
import { HttpAccountingSelectOptionsRepository } from './infrastructure/adapters/http-accounting-select-options.repository';
import { HttpBusinessStructureRepository } from './infrastructure/adapters/http-business-structure.repository';
import { HttpChartAccountRepository } from './infrastructure/adapters/http-chart-account.repository';
import { HttpCostCenterRepository } from './infrastructure/adapters/http-cost-center.repository';
import { HttpCostCenterClassRepository } from './infrastructure/adapters/http-cost-center-class.repository';
import { HttpCostCenterNatureRepository } from './infrastructure/adapters/http-cost-center-nature.repository';
import { HttpCostCenterTypeRepository } from './infrastructure/adapters/http-cost-center-type.repository';
import { HttpDocumentSourceRepository } from './infrastructure/adapters/http-document-source.repository';
import { HttpDocumentSourceTypeRepository } from './infrastructure/adapters/http-document-source-type.repository';
import { HttpExerciseVariationRepository } from './infrastructure/adapters/http-exercise-variation.repository';
import { HttpFinancialStatementRepository } from './infrastructure/adapters/http-financial-statement.repository';
import { HttpKeyOperationRepository } from './infrastructure/adapters/http-key-operation.repository';
import { HttpPergamoModuleRepository } from './infrastructure/adapters/http-pergamo-module.repository';
import { HttpReferenceRepository } from './infrastructure/adapters/http-reference.repository';
import { HttpTypeAccountRepository } from './infrastructure/adapters/http-type-account.repository';
import { HttpTypePlanRepository } from './infrastructure/adapters/http-type-plan.repository';
import { MockAccountingSummaryRepository } from './infrastructure/adapters/mock-accounting-summary.repository';

export const CONTABILIDAD_ROUTES: Routes = [
  {
    path: '',
    data: {
      animation: 'contabilidad'
    },
    providers: [
      GetAccountingSummaryUseCase,
      {
        provide: ACCOUNTING_SUMMARY_REPOSITORY,
        useClass: MockAccountingSummaryRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/contabilidad-page/contabilidad-page.component').then(
        (m) => m.ContabilidadPageComponent
      )
  },
  {
    path: 'submenu-1',
    pathMatch: 'full',
    redirectTo: 'variante-ejercicio'
  },
  {
    path: 'variante-ejercicio',
    data: {
      animation: 'contabilidad-submenu-1',
      submenuTitle: 'Variante Ejercicio',
      submenuDescription:
        'Este contenedor corresponde al submodulo Variante Ejercicio de Contabilidad.'
    },
    providers: [
      GetMonthsUseCase,
      ListExerciseVariationsUseCase,
      GetExerciseVariationDetailUseCase,
      CreateExerciseVariationUseCase,
      UpdateExerciseVariationUseCase,
      DeleteExerciseVariationUseCase,
      {
        provide: EXERCISE_VARIATION_REPOSITORY,
        useClass: HttpExerciseVariationRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/variante-ejercicio-page/variante-ejercicio-page.component').then(
        (m) => m.VarianteEjercicioPageComponent
      )
  },
  {
    path: 'submenu-2',
    pathMatch: 'full',
    redirectTo: 'norma-contable'
  },
  {
    path: 'norma-contable',
    data: {
      animation: 'contabilidad-norma-contable',
      submenuTitle: 'Norma Contable',
      submenuDescription:
        'Este contenedor corresponde al submodulo Norma Contable de Contabilidad.'
    },
    providers: [
      ListAccountingStandardsUseCase,
      GetAccountingStandardDetailUseCase,
      CreateAccountingStandardUseCase,
      UpdateAccountingStandardUseCase,
      DeleteAccountingStandardUseCase,
      RestoreAccountingStandardUseCase,
      {
        provide: ACCOUNTING_STANDARD_REPOSITORY,
        useClass: HttpAccountingStandardRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/norma-contable-page/norma-contable-page.component').then(
        (m) => m.NormaContablePageComponent
      )
  },
  {
    path: 'submenu-3',
    pathMatch: 'full',
    redirectTo: 'tipo-plan'
  },
  {
    path: 'tipo-plan',
    data: {
      animation: 'contabilidad-tipo-plan',
      submenuTitle: 'Tipo de Plan',
      submenuDescription:
        'Este contenedor corresponde al submodulo Tipo de Plan de Contabilidad.'
    },
    providers: [
      ListTypePlansUseCase,
      GetTypePlanDetailUseCase,
      CreateTypePlanUseCase,
      UpdateTypePlanUseCase,
      DeleteTypePlanUseCase,
      RestoreTypePlanUseCase,
      {
        provide: TYPE_PLAN_REPOSITORY,
        useClass: HttpTypePlanRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/tipo-plan-page/tipo-plan-page.component').then(
        (m) => m.TipoPlanPageComponent
      )
  },
  {
    path: 'submenu-4',
    pathMatch: 'full',
    redirectTo: 'naturaleza-contable'
  },
  {
    path: 'naturaleza-contable',
    data: {
      animation: 'contabilidad-naturaleza-contable',
      submenuTitle: 'Naturaleza Contable',
      submenuDescription:
        'Este contenedor corresponde al submodulo Naturaleza Contable de Contabilidad.'
    },
    providers: [
      ListAccountingNaturesUseCase,
      GetAccountingNatureDetailUseCase,
      CreateAccountingNatureUseCase,
      UpdateAccountingNatureUseCase,
      DeleteAccountingNatureUseCase,
      RestoreAccountingNatureUseCase,
      {
        provide: ACCOUNTING_NATURE_REPOSITORY,
        useClass: HttpAccountingNatureRepository
      }
    ],
    loadComponent: () =>
      import(
        './presentation/pages/naturaleza-contable-page/naturaleza-contable-page.component'
      ).then((m) => m.NaturalezaContablePageComponent)
  },
  {
    path: 'submenu-5',
    pathMatch: 'full',
    redirectTo: 'clase-contable'
  },
  {
    path: 'clase-contable',
    data: {
      animation: 'contabilidad-clase-contable',
      submenuTitle: 'Clase Contable',
      submenuDescription:
        'Este contenedor corresponde al submodulo Clase Contable de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListAccountClassesUseCase,
      GetAccountClassDetailUseCase,
      CreateAccountClassUseCase,
      UpdateAccountClassUseCase,
      DeleteAccountClassUseCase,
      RestoreAccountClassUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: ACCOUNT_CLASS_REPOSITORY,
        useClass: HttpAccountClassRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/clase-contable-page/clase-contable-page.component').then(
        (m) => m.ClaseContablePageComponent
      )
  },
  {
    path: 'submenu-6',
    pathMatch: 'full',
    redirectTo: 'plan-cuentas'
  },
  {
    path: 'plan-cuentas',
    data: {
      animation: 'contabilidad-plan-cuentas',
      submenuTitle: 'Plan Cuentas',
      submenuDescription:
        'Este contenedor corresponde al submodulo Plan Cuentas de Contabilidad.'
    },
    providers: [
      ListChartAccountsUseCase,
      GetChartAccountDetailUseCase,
      GetAccountingSelectOptionsUseCase,
      CreateChartAccountUseCase,
      UpdateChartAccountUseCase,
      DeleteChartAccountUseCase,
      RestoreChartAccountUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: CHART_ACCOUNT_REPOSITORY,
        useClass: HttpChartAccountRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/plan-cuentas-page/plan-cuentas-page.component').then(
        (m) => m.PlanCuentasPageComponent
      )
  },
  {
    path: 'submenu-7',
    pathMatch: 'full',
    redirectTo: 'grupo-contable'
  },
  {
    path: 'grupo-contable',
    data: {
      animation: 'contabilidad-grupo-contable',
      submenuTitle: 'Grupo Contable',
      submenuDescription:
        'Este contenedor corresponde al submodulo Grupo Contable de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListAccountingGroupsUseCase,
      GetAccountingGroupDetailUseCase,
      CreateAccountingGroupUseCase,
      UpdateAccountingGroupUseCase,
      DeleteAccountingGroupUseCase,
      RestoreAccountingGroupUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: ACCOUNTING_GROUP_REPOSITORY,
        useClass: HttpAccountingGroupRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/grupo-contable-page/grupo-contable-page.component').then(
        (m) => m.GrupoContablePageComponent
      )
  },
  {
    path: 'submenu-8',
    pathMatch: 'full',
    redirectTo: 'tipo-cuentas'
  },
  {
    path: 'tipo-cuentas',
    data: {
      animation: 'contabilidad-tipo-cuentas',
      submenuTitle: 'Tipo de Cuentas',
      submenuDescription:
        'Este contenedor corresponde al submodulo Tipo de Cuentas de Contabilidad.'
    },
    providers: [
      ListTypeAccountsUseCase,
      GetTypeAccountDetailUseCase,
      CreateTypeAccountUseCase,
      UpdateTypeAccountUseCase,
      DeleteTypeAccountUseCase,
      RestoreTypeAccountUseCase,
      {
        provide: TYPE_ACCOUNT_REPOSITORY,
        useClass: HttpTypeAccountRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/tipo-cuentas-page/tipo-cuentas-page.component').then(
        (m) => m.TipoCuentasPageComponent
      )
  },
  {
    path: 'submenu-9',
    pathMatch: 'full',
    redirectTo: 'cuenta-contable'
  },
  {
    path: 'cuenta-contable',
    data: {
      animation: 'contabilidad-cuenta-contable',
      submenuTitle: 'Cuenta Contable',
      submenuDescription:
        'Este contenedor corresponde al submodulo Cuenta Contable de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListAccountingAccountsUseCase,
      GetAccountingAccountDetailUseCase,
      CreateAccountingAccountUseCase,
      UpdateAccountingAccountUseCase,
      DeleteAccountingAccountUseCase,
      RestoreAccountingAccountUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: ACCOUNTING_ACCOUNT_REPOSITORY,
        useClass: HttpAccountingAccountRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/cuenta-contable-page/cuenta-contable-page.component').then(
        (m) => m.CuentaContablePageComponent
      )
  },
  {
    path: 'submenu-10',
    pathMatch: 'full',
    redirectTo: 'estructura-empresarial'
  },
  {
    path: 'estructura-empresarial',
    data: {
      animation: 'contabilidad-estructura-empresarial',
      submenuTitle: 'Estructura Empresarial',
      submenuDescription:
        'Este contenedor corresponde al submodulo Estructura Empresarial de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListBusinessStructuresUseCase,
      GetBusinessStructureDetailUseCase,
      CreateBusinessStructureUseCase,
      UpdateBusinessStructureUseCase,
      DeleteBusinessStructureUseCase,
      RestoreBusinessStructureUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: BUSINESS_STRUCTURE_REPOSITORY,
        useClass: HttpBusinessStructureRepository
      }
    ],
    loadComponent: () =>
      import(
        './presentation/pages/estructura-empresarial-page/estructura-empresarial-page.component'
      ).then((m) => m.EstructuraEmpresarialPageComponent)
  },
  {
    path: 'submenu-11',
    pathMatch: 'full',
    redirectTo: 'modulos-pergamo'
  },
  {
    path: 'modulos-pergamo',
    data: {
      animation: 'contabilidad-modulos-pergamo',
      submenuTitle: 'Modulos Pergamo',
      submenuDescription:
        'Este contenedor corresponde al submodulo Modulos Pergamo de Contabilidad.'
    },
    providers: [
      ListPergamoModulesUseCase,
      GetPergamoModuleDetailUseCase,
      CreatePergamoModuleUseCase,
      UpdatePergamoModuleUseCase,
      DeletePergamoModuleUseCase,
      RestorePergamoModuleUseCase,
      {
        provide: PERGAMO_MODULE_REPOSITORY,
        useClass: HttpPergamoModuleRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/modulos-pergamo-page/modulos-pergamo-page.component').then(
        (m) => m.ModulosPergamoPageComponent
      )
  },
  {
    path: 'submenu-12',
    pathMatch: 'full',
    redirectTo: 'tipos-documentos'
  },
  {
    path: 'tipos-documentos',
    data: {
      animation: 'contabilidad-tipos-documentos',
      submenuTitle: 'Tipos de Documentos',
      submenuDescription:
        'Este contenedor corresponde al submodulo Tipos de Documentos de Contabilidad.'
    },
    providers: [
      ListDocumentSourceTypesUseCase,
      GetDocumentSourceTypeDetailUseCase,
      CreateDocumentSourceTypeUseCase,
      UpdateDocumentSourceTypeUseCase,
      DeleteDocumentSourceTypeUseCase,
      RestoreDocumentSourceTypeUseCase,
      {
        provide: DOCUMENT_SOURCE_TYPE_REPOSITORY,
        useClass: HttpDocumentSourceTypeRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/tipos-documentos-page/tipos-documentos-page.component').then(
        (m) => m.TiposDocumentosPageComponent
      )
  },
  {
    path: 'submenu-13',
    pathMatch: 'full',
    redirectTo: 'estados-financieros'
  },
  {
    path: 'estados-financieros',
    data: {
      animation: 'contabilidad-estados-financieros',
      submenuTitle: 'Estados Financieros',
      submenuDescription:
        'Este contenedor corresponde al submodulo Estados Financieros de Contabilidad.'
    },
    providers: [
      ListFinancialStatementsUseCase,
      GetFinancialStatementDetailUseCase,
      CreateFinancialStatementUseCase,
      UpdateFinancialStatementUseCase,
      DeleteFinancialStatementUseCase,
      RestoreFinancialStatementUseCase,
      {
        provide: FINANCIAL_STATEMENT_REPOSITORY,
        useClass: HttpFinancialStatementRepository
      }
    ],
    loadComponent: () =>
      import(
        './presentation/pages/estados-financieros-page/estados-financieros-page.component'
      ).then((m) => m.EstadosFinancierosPageComponent)
  },
  {
    path: 'submenu-14',
    pathMatch: 'full',
    redirectTo: 'references'
  },
  {
    path: 'references',
    data: {
      animation: 'contabilidad-references',
      submenuTitle: 'References',
      submenuDescription:
        'Este contenedor corresponde al submodulo References de Contabilidad.'
    },
    providers: [
      ListReferencesUseCase,
      GetReferenceDetailUseCase,
      CreateReferenceUseCase,
      UpdateReferenceUseCase,
      DeleteReferenceUseCase,
      RestoreReferenceUseCase,
      {
        provide: REFERENCE_REPOSITORY,
        useClass: HttpReferenceRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/references-page/references-page.component').then(
        (m) => m.ReferencesPageComponent
      )
  },
  {
    path: 'submenu-15',
    pathMatch: 'full',
    redirectTo: 'documentos-contables'
  },
  {
    path: 'documentos-contables',
    data: {
      animation: 'contabilidad-documentos-contables',
      submenuTitle: 'Documentos Contables',
      submenuDescription:
        'Este contenedor corresponde al submodulo Documentos Contables de Contabilidad.'
    },
    providers: [
      ListAccountingDocumentsUseCase,
      GetAccountingDocumentDetailUseCase,
      CreateAccountingDocumentUseCase,
      UpdateAccountingDocumentUseCase,
      DeleteAccountingDocumentUseCase,
      RestoreAccountingDocumentUseCase,
      {
        provide: ACCOUNTING_DOCUMENT_REPOSITORY,
        useClass: HttpAccountingDocumentRepository
      }
    ],
    loadComponent: () =>
      import(
        './presentation/pages/documentos-contables-page/documentos-contables-page.component'
      ).then((m) => m.DocumentosContablesPageComponent)
  },
  {
    path: 'submenu-16',
    pathMatch: 'full',
    redirectTo: 'documento-origen'
  },
  {
    path: 'documento-origen',
    data: {
      animation: 'contabilidad-documento-origen',
      submenuTitle: 'Documento Origen',
      submenuDescription:
        'Este contenedor corresponde al submodulo Documento Origen de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListDocumentSourcesUseCase,
      GetDocumentSourceDetailUseCase,
      CreateDocumentSourceUseCase,
      UpdateDocumentSourceUseCase,
      DeleteDocumentSourceUseCase,
      RestoreDocumentSourceUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: DOCUMENT_SOURCE_REPOSITORY,
        useClass: HttpDocumentSourceRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/documento-origen-page/documento-origen-page.component').then(
        (m) => m.DocumentoOrigenPageComponent
      )
  },
  {
    path: 'submenu-17',
    pathMatch: 'full',
    redirectTo: 'cabecera-asiento-contable'
  },
  {
    path: 'cabecera-asiento-contable',
    data: {
      animation: 'contabilidad-cabecera-asiento-contable',
      submenuTitle: 'Cabecera Asiento Contable',
      submenuDescription:
        'Este contenedor corresponde al submodulo Cabecera Asiento Contable de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListAccountingEntryHeadersUseCase,
      GetAccountingEntryHeaderDetailUseCase,
      CreateAccountingEntryHeaderUseCase,
      UpdateAccountingEntryHeaderUseCase,
      DeleteAccountingEntryHeaderUseCase,
      RestoreAccountingEntryHeaderUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: ACCOUNTING_ENTRY_HEADER_REPOSITORY,
        useClass: HttpAccountingEntryHeaderRepository
      }
    ],
    loadComponent: () =>
      import(
        './presentation/pages/cabecera-asiento-contable-page/cabecera-asiento-contable-page.component'
      ).then((m) => m.CabeceraAsientoContablePageComponent)
  },
  {
    path: 'submenu-18',
    pathMatch: 'full',
    redirectTo: 'tipo-centro-costo'
  },
  {
    path: 'tipo-centro-costo',
    data: {
      animation: 'contabilidad-tipo-centro-costo',
      submenuTitle: 'Tipo Centro de Costo',
      submenuDescription:
        'Este contenedor corresponde al submodulo Tipo Centro de Costo de Contabilidad.'
    },
    providers: [
      ListCostCenterTypesUseCase,
      GetCostCenterTypeDetailUseCase,
      CreateCostCenterTypeUseCase,
      UpdateCostCenterTypeUseCase,
      DeleteCostCenterTypeUseCase,
      RestoreCostCenterTypeUseCase,
      {
        provide: COST_CENTER_TYPE_REPOSITORY,
        useClass: HttpCostCenterTypeRepository
      }
    ],
    loadComponent: () =>
      import(
        './presentation/pages/tipo-centro-costo-page/tipo-centro-costo-page.component'
      ).then((m) => m.TipoCentroCostoPageComponent)
  },
  {
    path: 'submenu-19',
    pathMatch: 'full',
    redirectTo: 'clase-centro-costo'
  },
  {
    path: 'clase-centro-costo',
    data: {
      animation: 'contabilidad-clase-centro-costo',
      submenuTitle: 'Clase Centro de Costo',
      submenuDescription:
        'Este contenedor corresponde al submodulo Clase Centro de Costo de Contabilidad.'
    },
    providers: [
      ListCostCenterClassesUseCase,
      GetCostCenterClassDetailUseCase,
      CreateCostCenterClassUseCase,
      UpdateCostCenterClassUseCase,
      DeleteCostCenterClassUseCase,
      RestoreCostCenterClassUseCase,
      {
        provide: COST_CENTER_CLASS_REPOSITORY,
        useClass: HttpCostCenterClassRepository
      }
    ],
    loadComponent: () =>
      import(
        './presentation/pages/clase-centro-costo-page/clase-centro-costo-page.component'
      ).then((m) => m.ClaseCentroCostoPageComponent)
  },
  {
    path: 'submenu-20',
    pathMatch: 'full',
    redirectTo: 'naturaleza-centro-costo'
  },
  {
    path: 'naturaleza-centro-costo',
    data: {
      animation: 'contabilidad-naturaleza-centro-costo',
      submenuTitle: 'Naturaleza Centro de Costo',
      submenuDescription:
        'Este contenedor corresponde al submodulo Naturaleza Centro de Costo de Contabilidad.'
    },
    providers: [
      ListCostCenterNaturesUseCase,
      GetCostCenterNatureDetailUseCase,
      CreateCostCenterNatureUseCase,
      UpdateCostCenterNatureUseCase,
      DeleteCostCenterNatureUseCase,
      RestoreCostCenterNatureUseCase,
      {
        provide: COST_CENTER_NATURE_REPOSITORY,
        useClass: HttpCostCenterNatureRepository
      }
    ],
    loadComponent: () =>
      import(
        './presentation/pages/naturaleza-centro-costo-page/naturaleza-centro-costo-page.component'
      ).then((m) => m.NaturalezaCentroCostoPageComponent)
  },
  {
    path: 'submenu-21',
    pathMatch: 'full',
    redirectTo: 'centro-costo'
  },
  {
    path: 'centro-costo',
    data: {
      animation: 'contabilidad-centro-costo',
      submenuTitle: 'Centro de Costo',
      submenuDescription:
        'Este contenedor corresponde al submodulo Centro de Costo de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListCostCentersUseCase,
      GetCostCenterDetailUseCase,
      CreateCostCenterUseCase,
      UpdateCostCenterUseCase,
      DeleteCostCenterUseCase,
      RestoreCostCenterUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: COST_CENTER_REPOSITORY,
        useClass: HttpCostCenterRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/centro-costo-page/centro-costo-page.component').then(
        (m) => m.CentroCostoPageComponent
      )
  },
  {
    path: 'submenu-22',
    pathMatch: 'full',
    redirectTo: 'posicion-asiento-contable'
  },
  {
    path: 'posicion-asiento-contable',
    data: {
      animation: 'contabilidad-posicion-asiento-contable',
      submenuTitle: 'Posicion Asiento Contable',
      submenuDescription:
        'Este contenedor corresponde al submodulo Posicion Asiento Contable de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListAccountingEntryPositionsUseCase,
      GetAccountingEntryPositionDetailUseCase,
      CreateAccountingEntryPositionUseCase,
      UpdateAccountingEntryPositionUseCase,
      DeleteAccountingEntryPositionUseCase,
      RestoreAccountingEntryPositionUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: ACCOUNTING_ENTRY_POSITION_REPOSITORY,
        useClass: HttpAccountingEntryPositionRepository
      }
    ],
    loadComponent: () =>
      import(
        './presentation/pages/posicion-asiento-contable-page/posicion-asiento-contable-page.component'
      ).then((m) => m.PosicionAsientoContablePageComponent)
  },
  {
    path: 'submenu-23',
    pathMatch: 'full',
    redirectTo: 'clave-operacion'
  },
  {
    path: 'clave-operacion',
    data: {
      animation: 'contabilidad-clave-operacion',
      submenuTitle: 'Clave Operacion',
      submenuDescription:
        'Este contenedor corresponde al submodulo Clave Operacion de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListKeyOperationsUseCase,
      GetKeyOperationDetailUseCase,
      CreateKeyOperationUseCase,
      UpdateKeyOperationUseCase,
      DeleteKeyOperationUseCase,
      RestoreKeyOperationUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: KEY_OPERATION_REPOSITORY,
        useClass: HttpKeyOperationRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/clave-operacion-page/clave-operacion-page.component').then(
        (m) => m.ClaveOperacionPageComponent
      )
  },
  {
    path: 'submenu-24',
    pathMatch: 'full',
    redirectTo: 'momento-contable'
  },
  {
    path: 'momento-contable',
    data: {
      animation: 'contabilidad-momento-contable',
      submenuTitle: 'Momento Contable',
      submenuDescription:
        'Este contenedor corresponde al submodulo Momento Contable de Contabilidad.'
    },
    providers: [
      ListAccountingMomentsUseCase,
      GetAccountingMomentDetailUseCase,
      CreateAccountingMomentUseCase,
      UpdateAccountingMomentUseCase,
      DeleteAccountingMomentUseCase,
      RestoreAccountingMomentUseCase,
      {
        provide: ACCOUNTING_MOMENT_REPOSITORY,
        useClass: HttpAccountingMomentRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/momento-contable-page/momento-contable-page.component').then(
        (m) => m.MomentoContablePageComponent
      )
  },
  {
    path: 'submenu-25',
    pathMatch: 'full',
    redirectTo: 'evento-contable'
  },
  {
    path: 'evento-contable',
    data: {
      animation: 'contabilidad-evento-contable',
      submenuTitle: 'Evento Contable',
      submenuDescription:
        'Este contenedor corresponde al submodulo Evento Contable de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListAccountingEventsUseCase,
      GetAccountingEventDetailUseCase,
      CreateAccountingEventUseCase,
      UpdateAccountingEventUseCase,
      DeleteAccountingEventUseCase,
      RestoreAccountingEventUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: ACCOUNTING_EVENT_REPOSITORY,
        useClass: HttpAccountingEventRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/evento-contable-page/evento-contable-page.component').then(
        (m) => m.EventoContablePageComponent
      )
  },
  {
    path: 'submenu-26',
    pathMatch: 'full',
    redirectTo: 'esquema-contable'
  },
  {
    path: 'esquema-contable',
    data: {
      animation: 'contabilidad-esquema-contable',
      submenuTitle: 'Esquema Contable',
      submenuDescription:
        'Este contenedor corresponde al submodulo Esquema Contable de Contabilidad.'
    },
    providers: [
      GetAccountingSelectOptionsUseCase,
      ListAccountingSchemesUseCase,
      GetAccountingSchemeDetailUseCase,
      CreateAccountingSchemeUseCase,
      UpdateAccountingSchemeUseCase,
      DeleteAccountingSchemeUseCase,
      RestoreAccountingSchemeUseCase,
      {
        provide: ACCOUNTING_SELECT_OPTIONS_REPOSITORY,
        useClass: HttpAccountingSelectOptionsRepository
      },
      {
        provide: ACCOUNTING_SCHEME_REPOSITORY,
        useClass: HttpAccountingSchemeRepository
      }
    ],
    loadComponent: () =>
      import('./presentation/pages/esquema-contable-page/esquema-contable-page.component').then(
        (m) => m.EsquemaContablePageComponent
      )
  },
  {
    path: 'submenu-legacy-2',
    data: {
      animation: 'contabilidad-submenu-legacy-2',
      submenuTitle: 'Submenu 2',
      submenuDescription: 'Este contenedor corresponde al Submenu 2 de Contabilidad.'
    },
    loadComponent: () =>
      import('./presentation/pages/contabilidad-submenu-page/contabilidad-submenu-page.component').then(
        (m) => m.ContabilidadSubmenuPageComponent
      )
  }
];
