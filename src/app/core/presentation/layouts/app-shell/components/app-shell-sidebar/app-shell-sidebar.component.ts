import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbMenuItem, NbMenuModule, NbMenuService } from '@nebular/theme';
import { filter } from 'rxjs';

import { ShellNavigationItem } from '../../models/shell-navigation-item.model';

@Component({
  selector: 'app-shell-sidebar',
  imports: [NbMenuModule],
  templateUrl: './app-shell-sidebar.component.html',
  styleUrl: './app-shell-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellSidebarComponent {
  private readonly menuService = inject(NbMenuService);

  readonly shellTitle = input.required<string>();
  readonly shellSubtitle = input.required<string>();
  readonly navigationItems = input.required<ShellNavigationItem[]>();
  protected readonly menuTag = 'main-sidebar-menu';
  protected readonly totalNavigationItems = computed(
    () => this.navigationItems().length
  );
  protected readonly activeItemTitle = signal('Dashboard');
  protected readonly menuItems = computed<NbMenuItem[]>(() =>
    this.navigationItems().map((item) => ({
      title: item.label,
      link: item.path,
      pathMatch: item.path === '/dashboard' ? 'full' : 'prefix',
      home: item.path === '/dashboard',
      icon: item.path === '/dashboard' ? 'home-outline' : 'briefcase-outline',
      data: {
        description: item.description
      }
    }))
  );

  constructor() {
    this.menuService
      .onItemSelect()
      .pipe(
        filter(({ tag }) => tag === this.menuTag),
        takeUntilDestroyed()
      )
      .subscribe(({ item }) => {
        this.activeItemTitle.set(item.title);
      });
  }
}
