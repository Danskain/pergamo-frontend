import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    data: {
      animation: 'dashboard'
    },
    loadComponent: () =>
      import('./presentation/pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      )
  }
];
