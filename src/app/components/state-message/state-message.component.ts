import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-state-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon],
  template: `
    <mat-icon class="icon">{{ icon() }}</mat-icon>
    <p class="heading">{{ heading() }}</p>
    @if (message()) {
      <p class="message">{{ message() }}</p>
    }
    <ng-content />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-7) var(--space-4);
      text-align: center;
    }

    .icon {
      width: 3rem;
      height: 3rem;
      font-size: 3rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .heading {
      margin: 0;
      font: var(--mat-sys-title-medium);
    }

    .message {
      margin: 0 0 var(--space-2);
      max-width: 30rem;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
    }
  `,
})
export class StateMessageComponent {
  readonly icon = input.required<string>();
  readonly heading = input.required<string>();
  readonly message = input<string>();
}
