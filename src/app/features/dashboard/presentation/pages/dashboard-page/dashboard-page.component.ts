import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { NbCardModule } from '@nebular/theme';

import { AuthCurrentUserService } from '../../../../../core/auth/auth-current-user.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [NbCardModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private readonly authCurrentUser = inject(AuthCurrentUserService);
  private readonly refreshTimers: number[] = [];

  protected readonly featureName = signal('Dashboard');
  protected readonly pillars = signal([
    'domain',
    'application',
    'infrastructure',
    'presentation'
  ]);
  protected readonly totalPillars = computed(() => this.pillars().length);

  ngOnInit(): void {
    [0, 500, 1500].forEach((delayMs) => {
      const timerId = window.setTimeout(() => {
        this.authCurrentUser.refreshCurrentUser(true);
      }, delayMs);

      this.refreshTimers.push(timerId);
    });
  }

  ngOnDestroy(): void {
    this.refreshTimers.forEach((timerId) => window.clearTimeout(timerId));
    this.refreshTimers.length = 0;
  }
}
