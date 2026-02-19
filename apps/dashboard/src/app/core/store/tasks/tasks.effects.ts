import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { TasksService } from '../../services/tasks.service';
import * as TasksActions from './tasks.actions';

const loadTasks$ = createEffect(
  (
    actions$ = inject(Actions),
    tasksService = inject(TasksService)
  ) =>
    actions$.pipe(
      ofType(TasksActions.loadTasks),
      mergeMap(() =>
        tasksService.getTasks().pipe(
          map((tasks) => TasksActions.loadTasksSuccess({ tasks })),
          catchError((err) =>
            of(
              TasksActions.loadTasksFailure({
                error: err?.error?.message || 'Failed to load tasks',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

const createTask$ = createEffect(
  (
    actions$ = inject(Actions),
    tasksService = inject(TasksService)
  ) =>
    actions$.pipe(
      ofType(TasksActions.createTask),
      mergeMap((payload) =>
        tasksService
          .createTask({
            title: payload.title,
            description: payload.description,
            priority: payload.priority,
            category: payload.category,
            assignedToId: payload.assignedToId,
          })
          .pipe(
            map((task) => TasksActions.createTaskSuccess({ task })),
            catchError((err) =>
              of(
                TasksActions.createTaskFailure({
                  error: err?.error?.message || 'Failed to create task',
                })
              )
            )
          )
      )
    ),
  { functional: true }
);

const updateTask$ = createEffect(
  (actions$ = inject(Actions), tasksService = inject(TasksService)) =>
    actions$.pipe(
      ofType(TasksActions.updateTask),
      mergeMap((action) => {
        const { id, type: _type, ...body } = action as { id: string; type: string; [k: string]: unknown };
        return tasksService.updateTask(id, body).pipe(
          map((task) => TasksActions.updateTaskSuccess({ task })),
          catchError((err) =>
            of(
              TasksActions.updateTaskFailure({
                error: err?.error?.message || 'Failed to update task',
              })
            )
          )
        );
      })
    ),
  { functional: true }
);

const deleteTask$ = createEffect(
  (actions$ = inject(Actions), tasksService = inject(TasksService)) =>
    actions$.pipe(
      ofType(TasksActions.deleteTask),
      mergeMap(({ id }) =>
        tasksService.deleteTask(id).pipe(
          map(() => TasksActions.deleteTaskSuccess({ id })),
          catchError((err) =>
            of(
              TasksActions.deleteTaskFailure({
                error: err?.error?.message || 'Failed to delete task',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

const reorderTasks$ = createEffect(
  (actions$ = inject(Actions), tasksService = inject(TasksService)) =>
    actions$.pipe(
      ofType(TasksActions.reorderTasks),
      mergeMap(({ orderedIds }) => {
        const updates = orderedIds.map((id, index) =>
          tasksService.updateTask(id, { sortOrder: index })
        );
        if (updates.length === 0) return of(TasksActions.loadTasks());
        return forkJoin(updates).pipe(
          map(() => TasksActions.loadTasks()),
          catchError((err) =>
            of(
              TasksActions.loadTasksFailure({
                error: err?.error?.message || 'Failed to reorder tasks',
              })
            )
          )
        );
      })
    ),
  { functional: true }
);

export const TasksEffects = {
  loadTasks$,
  createTask$,
  updateTask$,
  deleteTask$,
  reorderTasks$,
};
