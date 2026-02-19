import { Component, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest, map } from 'rxjs';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { AuthFacade } from '../../../core/store/auth/auth.facade';
import { TasksFacade } from '../../../core/store/tasks/tasks.facade';
import { DashboardLayoutComponent } from '../../../shared/layout/dashboard-layout/dashboard-layout.component';
import { ConfirmModalComponent } from '../../../shared/modal/confirm-modal/confirm-modal.component';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton.component';
import { ToastService } from '../../../shared/toast/toast.service';

type Task = { id: string; title: string; description?: string; status: string; priority?: number; category?: string; sortOrder?: number };
const STATUS_OPTIONS = ['All', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const TASK_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];
const CATEGORY_OPTIONS = ['All', 'Work', 'Personal', 'Other'];
const SORT_OPTIONS = [
  { value: 'sortOrder', label: 'Order' },
  { value: 'createdAt', label: 'Date' },
  { value: 'priority', label: 'Priority' },
];

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    DashboardLayoutComponent,
    ConfirmModalComponent,
    SkeletonComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  private readonly auth = inject(AuthFacade);
  private readonly tasksFacade = inject(TasksFacade);
  private readonly toast = inject(ToastService);

  user$ = this.auth.user$;
  tasks$ = this.tasksFacade.tasks$;
  loading$ = this.tasksFacade.loading$;
  error$ = this.tasksFacade.error$;
  showForm = false;
  taskTitle = signal('');
  taskDesc = signal('');
  taskCategory = signal('Work');
  deleteTargetId = signal<string | null>(null);

  filterStatus = signal<string>('All');
  filterCategory = signal<string>('All');
  sortBy = signal<string>('sortOrder');

  statusOptions = STATUS_OPTIONS;
  taskStatusOptions = TASK_STATUS_OPTIONS;
  categoryOptions = CATEGORY_OPTIONS;
  sortOptions = SORT_OPTIONS;

  currentList = signal<Task[]>([]);

  filteredTasks$ = combineLatest({
    tasks: this.tasks$,
    status: toObservable(this.filterStatus),
    category: toObservable(this.filterCategory),
    sort: toObservable(this.sortBy),
  }).pipe(
    map(({ tasks, status, category, sort }) => {
      let list = (tasks ?? []) as Task[];
      if (status !== 'All') list = list.filter((t) => t.status === status);
      if (category !== 'All') list = list.filter((t) => (t.category || 'Other') === category);
      if (sort === 'priority') {
        list = [...list].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
      } else if (sort === 'createdAt') {
        list = [...list].sort((a, b) => {
          const da = (a as { createdAt?: string }).createdAt ?? '';
          const db = (b as { createdAt?: string }).createdAt ?? '';
          return db.localeCompare(da);
        });
      } else {
        list = [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      }
      this.currentList.set(list);
      return list;
    })
  );

  ngOnInit(): void {
    this.tasksFacade.loadTasks();
  }

  create(): void {
    const title = this.taskTitle()?.trim();
    if (!title) return;
    this.tasksFacade.createTask(title, this.taskDesc()?.trim(), undefined, this.taskCategory() || 'Other');
    this.toast.success('Task created');
    this.taskTitle.set('');
    this.taskDesc.set('');
    this.taskCategory.set('Work');
    this.showForm = false;
  }

  cancelForm(): void {
    this.showForm = false;
    this.taskTitle.set('');
    this.taskDesc.set('');
    this.taskCategory.set('Work');
  }

  updateStatus(id: string, status: string): void {
    this.tasksFacade.updateTask(id, { status });
    const labels: Record<string, string> = { PENDING: 'Pending', IN_PROGRESS: 'In progress', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
    this.toast.success(`Status set to ${labels[status] ?? status}`);
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    const tasks = (event.container.data ?? this.currentList()) as Task[];
    const ordered = [...tasks];
    moveItemInArray(ordered, event.previousIndex, event.currentIndex);
    this.tasksFacade.reorderTasks(ordered.map((t) => t.id));
    this.toast.success('Order updated');
  }

  openDeleteConfirm(id: string): void {
    this.deleteTargetId.set(id);
  }

  confirmDelete(): void {
    const id = this.deleteTargetId();
    if (id) {
      this.tasksFacade.deleteTask(id);
      this.deleteTargetId.set(null);
      this.toast.success('Task deleted');
    }
  }

  statusClass(status: string): string {
    return status?.toLowerCase().replace(/\s+/g, '_') ?? 'pending';
  }
}