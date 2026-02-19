import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthTokenService } from '../services/auth-token.service';

export function authInterceptor(
  req: import('@angular/common/http').HttpRequest<unknown>,
  next: import('@angular/common/http').HttpHandlerFn
) {
  const tokenService = inject(AuthTokenService);
  const router = inject(Router);
  const token = tokenService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        tokenService.clearToken();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
}
