import { Route } from '@angular/router';

export const TASKS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./task-list/task-list.component').then((m) => m.TaskListComponent),
  },
];
