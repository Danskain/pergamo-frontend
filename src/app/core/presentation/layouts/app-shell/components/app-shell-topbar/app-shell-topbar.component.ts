import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import {
  NbBadgeModule,
  NbButtonModule,
  NbIconModule,
  NbSearchModule,
  NbThemeService,
  NbToggleModule,
  NbUserModule
} from '@nebular/theme';

import { AuthSessionService } from '../../../../../auth/auth-session.service';

type AppTheme = 'default' | 'dark';

@Component({
  selector: 'app-shell-topbar',
  imports: [
    NbBadgeModule,
    NbButtonModule,
    NbIconModule,
    NbSearchModule,
    NbToggleModule,
    NbUserModule
  ],
  templateUrl: './app-shell-topbar.component.html',
  styleUrl: './app-shell-topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellTopbarComponent {
  private readonly authSession = inject(AuthSessionService);
  private readonly themeService = inject(NbThemeService);

  readonly appName = input.required<string>();
  readonly menuToggle = output<void>();
  protected readonly notificationCount = 3;
  protected readonly userName = computed(() => this.authSession.userProfile().fullName);
  protected readonly userTitle = computed(() => this.authSession.userProfile().role);
  protected readonly userInitials = computed(() => {
    const fullName = this.userName().trim();

    if (!fullName) {
      return 'U';
    }

    return fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  });
  protected readonly isDarkMode = signal(this.getStoredTheme() === 'dark');

  constructor() {
    this.applyTheme(this.isDarkMode() ? 'dark' : 'default');
  }

  protected onMenuToggle(): void {
    this.menuToggle.emit();
  }

  protected onThemeToggle(checked: boolean): void {
    const theme: AppTheme = checked ? 'dark' : 'default';
    this.isDarkMode.set(checked);
    this.applyTheme(theme);
  }

  private applyTheme(theme: AppTheme): void {
    this.themeService.changeTheme(theme);
    this.storeTheme(theme);
  }

  private getStoredTheme(): AppTheme {
    if (typeof localStorage === 'undefined') {
      return 'default';
    }

    return localStorage.getItem('pergamo-theme') === 'dark' ? 'dark' : 'default';
  }

  private storeTheme(theme: AppTheme): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem('pergamo-theme', theme);
  }
}
