import {
  HttpEvent,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { SecurityService } from '../../intranet/services/security.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const securityService = inject(SecurityService);
  const token = securityService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};
