import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/presentation/layouts/app-shell/app-shell-layout.component').then(
        (m) => m.AppShellLayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTES
          )
      },
      {
        path: 'contabilidad',
        loadChildren: () =>
          import('./features/contabilidad/contabilidad.routes').then(
            (m) => m.CONTABILIDAD_ROUTES
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
