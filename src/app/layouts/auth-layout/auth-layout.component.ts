import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet],
  template: `
    <main class="auth-layout">
      <p class="brand">Kiwi Social</p>
      <router-outlet />
    </main>
  `,
  styles: `
    .auth-layout {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-5);
      min-height: 100dvh;
      padding: var(--space-7) var(--space-4);
      box-sizing: border-box;
    }

    .brand {
      margin: 0;
      font: var(--mat-sys-title-large);
      color: var(--mat-sys-primary);
    }
  `,
})
export class AuthLayoutComponent {}
