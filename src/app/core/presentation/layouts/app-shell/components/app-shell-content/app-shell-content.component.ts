import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell-content',
  imports: [RouterOutlet],
  templateUrl: './app-shell-content.component.html',
  styleUrl: './app-shell-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellContentComponent {}
