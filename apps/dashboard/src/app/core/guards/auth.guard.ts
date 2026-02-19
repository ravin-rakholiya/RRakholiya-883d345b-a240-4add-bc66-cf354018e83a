import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { AuthTokenService } from '../services/auth-token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(AuthTokenService);
  const router = inject(Router);
  const token = tokenService.getToken();
  if (token) return true;
  return router.createUrlTree(['/login']);
};
