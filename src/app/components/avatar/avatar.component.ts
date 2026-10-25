import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'aria-hidden': 'true' },
  template: `{{ initial() }}`,
  styles: `
    :host {
      display: inline-grid;
      place-items: center;
      flex: none;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--mat-sys-corner-full);
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      font: var(--mat-sys-title-medium);
    }
  `,
})
export class AvatarComponent {
  readonly name = input<string>();

  protected readonly initial = computed(
    () => this.name()?.trim().charAt(0).toUpperCase() || '?',
  );
}
