import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-shell-footer',
  templateUrl: './app-shell-footer.component.html',
  styleUrl: './app-shell-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellFooterComponent {
  readonly appName = input.required<string>();
  readonly currentYear = input<number>(new Date().getFullYear());
}
