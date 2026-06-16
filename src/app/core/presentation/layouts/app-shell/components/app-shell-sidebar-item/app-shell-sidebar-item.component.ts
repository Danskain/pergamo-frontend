import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ShellNavigationItem } from '../../models/shell-navigation-item.model';

@Component({
  selector: 'app-shell-sidebar-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-shell-sidebar-item.component.html',
  styleUrl: './app-shell-sidebar-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellSidebarItemComponent {
  readonly item = input.required<ShellNavigationItem>();
}
