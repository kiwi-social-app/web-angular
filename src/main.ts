import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  provideRouter,
  TitleStrategy,
  withInMemoryScrolling,
} from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withXhr,
} from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { initializeApp } from 'firebase/app';
import { routes } from './app/app.routes';
import { AppTitleStrategy } from './app/app-title.strategy';
import { provideRxStomp } from './app/rx-stomp.config';
import { authInterceptor } from './app/services/auth.interceptor';

if (environment.production) {
  enableProdMode();
}

initializeApp(environment.firebase);

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', hideRequiredMarker: true },
    },
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    provideRxStomp(),
  ],
}).catch((err) => console.error(err));
