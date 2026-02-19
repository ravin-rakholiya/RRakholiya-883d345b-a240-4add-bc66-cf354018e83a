import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AuthTokenService } from '../../services/auth-token.service';
import * as AuthActions from './auth.actions';

const login$ = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
    actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        authService.login(email, password).pipe(
          map((res) =>
            AuthActions.loginSuccess({
              accessToken: res.accessToken,
              expiresIn: res.expiresIn,
              user: res.user,
            })
          ),
          catchError((err) =>
            of(
              AuthActions.loginFailure({
                error: err?.error?.message || 'Login failed',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const loginSuccessSetToken$ = createEffect(
  (
    actions$ = inject(Actions),
    tokenService = inject(AuthTokenService),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ accessToken }) => tokenService.setToken(accessToken)),
      tap(() => router.navigate(['/tasks']))
    ),
  { functional: true, dispatch: false }
);

export const register$ = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    tokenService = inject(AuthTokenService)
  ) =>
    actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((payload) =>
        authService
          .register(
            payload.email,
            payload.password,
            payload.firstName,
            payload.lastName
          )
          .pipe(
            map((res) =>
              AuthActions.registerSuccess({
                accessToken: res.accessToken,
                expiresIn: res.expiresIn,
                user: res.user,
              })
            ),
            catchError((err) =>
              of(
                AuthActions.registerFailure({
                  error: err?.error?.message || 'Registration failed',
                })
              )
            )
          )
      )
    ),
  { functional: true }
);

export const registerSuccessSetToken$ = createEffect(
  (
    actions$ = inject(Actions),
    tokenService = inject(AuthTokenService),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(({ accessToken }) => tokenService.setToken(accessToken)),
      tap(() => router.navigate(['/tasks']))
    ),
  { functional: true, dispatch: false }
);

export const logout$ = createEffect(
  (
    actions$ = inject(Actions),
    tokenService = inject(AuthTokenService),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => tokenService.clearToken()),
      tap(() => router.navigate(['/login']))
    ),
  { functional: true, dispatch: false }
);

export const loadUserFromStorage$ = createEffect(
  (
    actions$ = inject(Actions),
    tokenService = inject(AuthTokenService)
  ) =>
    actions$.pipe(
      ofType(AuthActions.loadUserFromStorage),
      map(() => {
        const token = tokenService.getStoredToken();
        if (!token || tokenService.isTokenExpired(token)) {
          tokenService.clearToken();
          return null;
        }
        const payload = tokenService.decodePayload(token);
        if (!payload?.sub || !payload?.email || !payload?.role) {
          tokenService.clearToken();
          return null;
        }
        return AuthActions.restoreSession({
          accessToken: token,
          user: {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
          },
        });
      }),
      filter((action): action is ReturnType<typeof AuthActions.restoreSession> => action !== null),
      tap((action) => tokenService.setToken(action.accessToken))
    ),
  { functional: true }
);

export const AuthEffects = {
  login$,
  loginSuccessSetToken$,
  register$,
  registerSuccessSetToken$,
  logout$,
  loadUserFromStorage$,
};
