import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { Task } from '@turbo-vets/data';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/tasks`;

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.api);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.api}/${id}`);
  }

  createTask(body: {
    title: string;
    description?: string;
    priority?: number;
    category?: string;
    sortOrder?: number;
    assignedToId?: string;
  }): Observable<Task> {
    return this.http.post<Task>(this.api, body);
  }

  updateTask(
    id: string,
    body: {
      title?: string;
      description?: string;
      status?: string;
      priority?: number;
      category?: string;
      sortOrder?: number;
      assignedToId?: string;
    }
  ): Observable<Task> {
    return this.http.put<Task>(`${this.api}/${id}`, body);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
