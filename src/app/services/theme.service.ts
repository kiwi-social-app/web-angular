import { DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly selectedMode = signal<ThemeMode>(this.readInitialMode());
  readonly mode = this.selectedMode.asReadonly();

  constructor() {
    effect(() => {
      const mode = this.selectedMode();
      const root = this.document.documentElement;
      if (mode === 'system') {
        delete root.dataset['theme'];
      } else {
        root.dataset['theme'] = mode;
      }
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch {}
    });
  }

  setMode(mode: ThemeMode): void {
    this.selectedMode.set(mode);
  }

  private readInitialMode(): ThemeMode {
    const theme = this.document.documentElement.dataset['theme'];
    return theme === 'light' || theme === 'dark' ? theme : 'system';
  }
}
