import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar class="navbar" />
    <main class="content">
      <router-outlet />
    </main>
  `,
  styles: `
    :host {
      --app-bar-height: 4rem;
      --nav-bar-height: 5rem;
      --shell-offset: calc(var(--app-bar-height) + 2 * var(--space-5));
      display: block;
      min-height: 100dvh;
    }

    .navbar {
      display: block;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .content {
      padding: var(--space-5) var(--space-4);
    }

    @media (max-width: 37.5em) {
      :host {
        --shell-offset: calc(var(--nav-bar-height) + 2 * var(--space-5));
      }

      .navbar {
        position: fixed;
        top: auto;
        bottom: 0;
        left: 0;
        right: 0;
      }

      .content {
        padding-bottom: calc(var(--nav-bar-height) + var(--space-5));
      }
    }
  `,
})
export class ShellLayoutComponent {}
