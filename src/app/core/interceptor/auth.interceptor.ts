import {
  HttpEvent,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { SecurityService } from '../../intranet/services/auth/security.service';
import { catchError, throwError } from 'rxjs';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const securityService = inject(SecurityService);
  const routes=inject(Router);
  const token = securityService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe
  (catchError((error) => {
    const CODES=[401,403]
    if (CODES.includes(error.status)) {
        console.log('Error 401/403','DEBES LOGEARTE NUEVAMENTE 😎',error.status);
        //modificas cuando haya un deslogeo joss, pones el metodo aca
    }
      return throwError(()=>error);
    }
  ));
};
