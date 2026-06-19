import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-shell-content',
  imports: [RouterOutlet],
  templateUrl: './app-shell-content.component.html',
  styleUrl: './app-shell-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellContentComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly animationDurationMs = 560;
  private animationTimer?: ReturnType<typeof setTimeout>;

  protected readonly isAnimating = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.restartAnimation();
      });

    this.destroyRef.onDestroy(() => {
      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
      }
    });
  }

  private restartAnimation(): void {
    this.isAnimating.set(false);

    requestAnimationFrame(() => {
      this.isAnimating.set(true);
      this.animationTimer = setTimeout(() => {
        this.isAnimating.set(false);
      }, this.animationDurationMs);
    });
  }
}
