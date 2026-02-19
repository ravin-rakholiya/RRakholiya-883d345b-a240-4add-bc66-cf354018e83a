import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{
    accessToken: string;
    expiresIn: number;
    user: { id: string; email: string; role: string };
  }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{
    accessToken: string;
    expiresIn: number;
    user: { id: string; email: string; role: string };
  }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const loadUserFromStorage = createAction('[Auth] Load User From Storage');

export const restoreSession = createAction(
  '[Auth] Restore Session',
  props<{
    accessToken: string;
    user: { id: string; email: string; role: string };
  }>()
);
