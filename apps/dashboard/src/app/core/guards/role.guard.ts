import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth/auth.reducer';

export const roleGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[] | undefined;
  if (!allowedRoles?.length) return true;

  return store.select((s: { auth: AuthState }) => s.auth?.user?.role).pipe(
    take(1),
    map((role) => {
      if (role && allowedRoles.includes(role)) return true;
      return router.createUrlTree(['/tasks']);
    })
  );
};
