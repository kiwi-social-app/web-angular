import {
  enableProdMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { routes } from './app/app.routes';
import { provideRxStomp } from './app/rx-stomp.config';

if (environment.production) {
  enableProdMode();
}

initializeApp(environment.firebase);

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideRxStomp(),
  ],
}).catch((err) => console.error(err));
