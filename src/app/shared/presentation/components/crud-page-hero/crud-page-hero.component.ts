import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

@Component({
  selector: 'app-crud-page-hero',
  imports: [NbCardModule],
  templateUrl: './crud-page-hero.component.html',
  styleUrl: './crud-page-hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrudPageHeroComponent {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly description = input('');
}
