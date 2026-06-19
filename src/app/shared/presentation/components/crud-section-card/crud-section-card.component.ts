import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NbCardModule, NbSpinnerModule } from '@nebular/theme';

@Component({
  selector: 'app-crud-section-card',
  imports: [NbCardModule, NbSpinnerModule],
  templateUrl: './crud-section-card.component.html',
  styleUrl: './crud-section-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrudSectionCardComponent {
  readonly kicker = input('');
  readonly title = input.required<string>();
  readonly summary = input('');
  readonly loading = input(false);
}
