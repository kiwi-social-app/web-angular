import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main class="content">
      <router-outlet />
    </main>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 83vh;
    }

    .content {
      padding: 2rem;
      height: 100%;
    }
  `,
})
export class ShellLayoutComponent {}
