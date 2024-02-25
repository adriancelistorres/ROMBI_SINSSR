import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideToastr({ timeOut: 8000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true, // Habilita el botón de cierre
      progressBar: true, // Habilita la barra de progreso
    }), 
    provideAnimations(),
  ],
};
