import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { routes } from './app/app.routes';
import { provideRxStomp } from './app/rx-stomp.config';
import { authInterceptor } from './app/services/auth.interceptor';

if (environment.production) {
  enableProdMode();
}

initializeApp(environment.firebase);

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRxStomp(),
  ],
}).catch((err) => console.error(err));
