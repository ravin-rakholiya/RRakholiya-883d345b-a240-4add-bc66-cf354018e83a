import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthState } from './auth.reducer';
import { AuthTokenService } from '../../services/auth-token.service';
import * as AuthActions from './auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);
  private readonly tokenService = inject(AuthTokenService);

  user$: Observable<AuthState['user']> = this.store.select((s: { auth: AuthState }) => s.auth?.user ?? null);
  token$: Observable<string | null> = this.store.select((s: { auth: AuthState }) => s.auth?.token ?? null);
  error$: Observable<string | null> = this.store.select((s: { auth: AuthState }) => s.auth?.error ?? null);
  isAuthenticated$: Observable<boolean> = this.store.select(
    (s: { auth: AuthState }) => !!(s.auth?.token && s.auth?.user)
  );

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  login(email: string, password: string): void {
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): void {
    this.store.dispatch(
      AuthActions.register({ email, password, firstName, lastName })
    );
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
