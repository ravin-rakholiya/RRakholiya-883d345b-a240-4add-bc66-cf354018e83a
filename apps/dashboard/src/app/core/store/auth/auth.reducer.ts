import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: { id: string; email: string; role: string } | null;
  token: string | null;
  loaded: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loaded: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, AuthActions.register, (state) => ({
    ...state,
    error: null,
  })),
  on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { accessToken, user }) => ({
    ...state,
    user,
    token: accessToken,
    loaded: true,
    error: null,
  })),
  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(AuthActions.logout, () => ({
    ...initialState,
    loaded: true,
  })),
  on(AuthActions.loadUserFromStorage, (state) => ({ ...state, loaded: true })),
  on(AuthActions.restoreSession, (state, { accessToken, user }) => ({
    ...state,
    token: accessToken,
    user,
    loaded: true,
    error: null,
  }))
);
