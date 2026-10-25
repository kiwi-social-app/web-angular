import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatProgressSpinner],
  host: { role: 'status' },
  template: `
    <mat-progress-spinner
      mode="indeterminate"
      diameter="40"
      aria-hidden="true"
    />
    <p class="label">{{ label() }}</p>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-7) var(--space-4);
    }

    .label {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
    }
  `,
})
export class LoadingStateComponent {
  readonly label = input('Loading…');
}
