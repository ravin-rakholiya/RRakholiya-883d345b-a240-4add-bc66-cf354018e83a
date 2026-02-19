import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import type { Task } from '@turbo-vets/data';
import { TasksState } from './tasks.reducer';
import * as TasksActions from './tasks.actions';

@Injectable({ providedIn: 'root' })
export class TasksFacade {
  private readonly store = inject(Store);

  tasks$: Observable<Task[]> = this.store.select(
    (s: { tasks: TasksState }) => s.tasks?.tasks ?? []
  );
  loading$ = this.store.select((s: { tasks: TasksState }) => s.tasks?.loading ?? false);
  error$ = this.store.select((s: { tasks: TasksState }) => s.tasks?.error ?? null);

  loadTasks(): void {
    this.store.dispatch(TasksActions.loadTasks());
  }

  createTask(
    title: string,
    description?: string,
    priority?: number,
    category?: string,
    assignedToId?: string
  ): void {
    this.store.dispatch(
      TasksActions.createTask({ title, description, priority, category, assignedToId })
    );
  }

  updateTask(
    id: string,
    patch: { title?: string; description?: string; status?: string; priority?: number; category?: string; sortOrder?: number; assignedToId?: string }
  ): void {
    this.store.dispatch(TasksActions.updateTask({ id, ...patch }));
  }

  deleteTask(id: string): void {
    this.store.dispatch(TasksActions.deleteTask({ id }));
  }

  reorderTasks(orderedIds: string[]): void {
    this.store.dispatch(TasksActions.reorderTasks({ orderedIds }));
  }
}
