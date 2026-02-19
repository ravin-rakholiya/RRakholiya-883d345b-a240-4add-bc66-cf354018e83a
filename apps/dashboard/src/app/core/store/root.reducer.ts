import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { tasksReducer, TasksState } from './tasks/tasks.reducer';

export interface RootState {
  auth: AuthState;
  tasks: TasksState;
}

export const rootReducers: ActionReducerMap<RootState> = {
  auth: authReducer,
  tasks: tasksReducer,
};
