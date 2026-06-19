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
      icon: 'home-outline',
      path: '/dashboard',
      description: 'Vista base del area autenticada'
    },
    {
      label: 'Contabilidad',
      icon: 'pie-chart-outline',
      description: 'Feature de negocio con puertos y adaptadores',
      children: [
        {
          label: 'Variante Ejercicio',
          icon: 'calendar-outline',
          path: '/contabilidad/variante-ejercicio',
          description: 'Submodulo Variante Ejercicio de contabilidad'
        },
        {
          label: 'Norma Contable',
          icon: 'file-text-outline',
          path: '/contabilidad/norma-contable',
          description: 'Submodulo Norma Contable de contabilidad'
        },
        {
          label: 'Tipo de Plan',
          icon: 'layers-outline',
          path: '/contabilidad/tipo-plan',
          description: 'Submodulo Tipo de Plan de contabilidad'
        },
        {
          label: 'Naturaleza Contable',
          icon: 'compass-outline',
          path: '/contabilidad/naturaleza-contable',
          description: 'Submodulo Naturaleza Contable de contabilidad'
        },
        {
          label: 'Clase Contable',
          icon: 'grid-outline',
          path: '/contabilidad/clase-contable',
          description: 'Submodulo Clase Contable de contabilidad'
        },
        {
          label: 'Plan Cuentas',
          icon: 'book-open-outline',
          path: '/contabilidad/plan-cuentas',
          description: 'Submodulo Plan Cuentas de contabilidad'
        },
        {
          label: 'Grupo Contable',
          icon: 'folder-outline',
          path: '/contabilidad/grupo-contable',
          description: 'Submodulo Grupo Contable de contabilidad'
        },
        {
          label: 'Tipo de Cuentas',
          icon: 'options-2-outline',
          path: '/contabilidad/tipo-cuentas',
          description: 'Submodulo Tipo de Cuentas de contabilidad'
        },
        {
          label: 'Cuenta Contable',
          icon: 'credit-card-outline',
          path: '/contabilidad/cuenta-contable',
          description: 'Submodulo Cuenta Contable de contabilidad'
        },
        {
          label: 'Estructura Empresarial',
          icon: 'briefcase-outline',
          path: '/contabilidad/estructura-empresarial',
          description: 'Submodulo Estructura Empresarial de contabilidad'
        },
        {
          label: 'Modulos Pergamo',
          icon: 'cube-outline',
          path: '/contabilidad/modulos-pergamo',
          description: 'Submodulo Modulos Pergamo de contabilidad'
        },
        {
          label: 'Tipos de Documentos',
          icon: 'file-text-outline',
          path: '/contabilidad/tipos-documentos',
          description: 'Submodulo Tipos de Documentos de contabilidad'
        },
        {
          label: 'Estados Financieros',
          icon: 'bar-chart-2-outline',
          path: '/contabilidad/estados-financieros',
          description: 'Submodulo Estados Financieros de contabilidad'
        },
        {
          label: 'References',
          icon: 'bookmark-outline',
          path: '/contabilidad/references',
          description: 'Submodulo References de contabilidad'
        },
        {
          label: 'Documentos Contables',
          icon: 'file-add-outline',
          path: '/contabilidad/documentos-contables',
          description: 'Submodulo Documentos Contables de contabilidad'
        },
        {
          label: 'Documento Origen',
          icon: 'file-text-outline',
          path: '/contabilidad/documento-origen',
          description: 'Submodulo Documento Origen de contabilidad'
        },
        {
          label: 'Cabecera Asiento Contable',
          icon: 'clipboard-outline',
          path: '/contabilidad/cabecera-asiento-contable',
          description: 'Submodulo Cabecera Asiento Contable de contabilidad'
        },
        {
          label: 'Tipo Centro de Costo',
          icon: 'layers-outline',
          path: '/contabilidad/tipo-centro-costo',
          description: 'Submodulo Tipo Centro de Costo de contabilidad'
        },
        {
          label: 'Clase Centro de Costo',
          icon: 'grid-outline',
          path: '/contabilidad/clase-centro-costo',
          description: 'Submodulo Clase Centro de Costo de contabilidad'
        },
        {
          label: 'Naturaleza Centro de Costo',
          icon: 'compass-outline',
          path: '/contabilidad/naturaleza-centro-costo',
          description: 'Submodulo Naturaleza Centro de Costo de contabilidad'
        },
        {
          label: 'Centro de Costo',
          icon: 'map-outline',
          path: '/contabilidad/centro-costo',
          description: 'Submodulo Centro de Costo de contabilidad'
        },
        {
          label: 'Posicion Asiento Contable',
          icon: 'list-outline',
          path: '/contabilidad/posicion-asiento-contable',
          description: 'Submodulo Posicion Asiento Contable de contabilidad'
        }
      ]
    }
  ]);

  protected toggleSidebar(): void {
    this.sidebarService.toggle(true, 'main-menu');
  }
}
