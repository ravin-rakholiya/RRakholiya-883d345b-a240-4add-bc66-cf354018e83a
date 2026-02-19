import { createReducer, on } from '@ngrx/store';
import type { Task } from '@turbo-vets/data';
import * as TasksActions from './tasks.actions';

export interface TasksState {
  tasks: Task[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loaded: false,
  loading: false,
  error: null,
};

export const tasksReducer = createReducer(
  initialState,
  on(TasksActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loaded: true,
    loading: false,
    error: null,
  })),
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TasksActions.createTask, (state) => ({ ...state, error: null })),
  on(TasksActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [task, ...state.tasks],
  })),
  on(TasksActions.createTaskFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(TasksActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),
  on(TasksActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t.id !== id),
  }))
);
