import type { TaskStatus, TaskCategory } from '../interfaces';

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: number;
  category?: TaskCategory;
  assignedToId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: number;
  category?: TaskCategory;
  assignedToId?: string;
}

export interface TaskResponseDto {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: number;
  category?: TaskCategory;
  createdById: string;
  assignedToId?: string;
  organizationId?: string;
  dueAt?: string;
  createdAt: string;
  updatedAt: string;
}
