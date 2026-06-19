import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contabilidad-submenu-page',
  templateUrl: './contabilidad-submenu-page.component.html',
  styleUrl: './contabilidad-submenu-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContabilidadSubmenuPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title =
    (this.route.snapshot.data['submenuTitle'] as string | undefined) ?? 'Submenu';
  protected readonly description =
    (this.route.snapshot.data['submenuDescription'] as string | undefined) ??
    'Este contenedor corresponde al submenu seleccionado.';
}
