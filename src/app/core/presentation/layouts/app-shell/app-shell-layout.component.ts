import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NbLayoutModule, NbSidebarModule, NbSidebarService } from '@nebular/theme';

import { AppShellContentComponent } from './components/app-shell-content/app-shell-content.component';
import { AppShellFooterComponent } from './components/app-shell-footer/app-shell-footer.component';
import { AppShellSidebarComponent } from './components/app-shell-sidebar/app-shell-sidebar.component';
import { AppShellTopbarComponent } from './components/app-shell-topbar/app-shell-topbar.component';
import { ShellNavigationItem } from './models/shell-navigation-item.model';

@Component({
  selector: 'app-shell-layout',
  imports: [
    NbLayoutModule,
    NbSidebarModule,
    AppShellTopbarComponent,
    AppShellSidebarComponent,
    AppShellContentComponent,
    AppShellFooterComponent
  ],
  templateUrl: './app-shell-layout.component.html',
  styleUrl: './app-shell-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellLayoutComponent {
  private readonly sidebarService = inject(NbSidebarService);
  protected readonly currentYear = new Date().getFullYear();

  protected readonly appName = signal('Pergamo');
  protected readonly shellTitle = signal('Application Shell');
  protected readonly shellSubtitle = signal('Contenedor principal despues del login');
  protected readonly navigationItems = signal<ShellNavigationItem[]>([
    {
      label: 'Dashboard',
      path: '/dashboard',
      description: 'Vista base del area autenticada'
    },
    {
      label: 'Contabilidad',
      path: '/contabilidad',
      description: 'Feature de negocio con puertos y adaptadores'
    }
  ]);

  protected toggleSidebar(): void {
    this.sidebarService.toggle(true, 'main-menu');
  }
}
