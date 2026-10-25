import {
  Component,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { ThemeMode, ThemeService } from '../../services/theme.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatDivider,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
})
export class NavbarComponent {
  protected readonly searchEnabled = environment.searchEnabled;
  private readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly themeOptions: {
    mode: ThemeMode;
    label: string;
    icon: string;
  }[] = [
    { mode: 'light', label: 'Light', icon: 'light_mode' },
    { mode: 'dark', label: 'Dark', icon: 'dark_mode' },
    { mode: 'system', label: 'System', icon: 'brightness_auto' },
  ];
  protected readonly themeIcon = computed(
    () =>
      this.themeOptions.find(
        (option) => option.mode === this.themeService.mode(),
      )!.icon,
  );

  protected signOut(): void {
    this.authService.signOut();
  }
}
