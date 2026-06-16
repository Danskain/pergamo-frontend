import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

@Component({
  selector: 'app-dashboard-page',
  imports: [NbCardModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  protected readonly featureName = signal('Dashboard');
  protected readonly pillars = signal([
    'domain',
    'application',
    'infrastructure',
    'presentation'
  ]);
  protected readonly totalPillars = computed(() => this.pillars().length);
}
